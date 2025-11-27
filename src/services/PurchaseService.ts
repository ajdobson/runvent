import { StorageService } from './StorageService';

// Replace with your actual product ID from App Store Connect / Google Play Console
const REMOVE_ADS_PRODUCT_ID = 'com.runvent.removeads';

// Lazy load the in-app purchases module to avoid errors if not available
let InAppPurchases: any = null;

const loadInAppPurchases = async () => {
  if (InAppPurchases === null) {
    try {
      const module = await import('expo-in-app-purchases');
      // expo-in-app-purchases uses named exports, try both default and named
      InAppPurchases = module.default || module;
      
      // If still no methods, try accessing directly from module
      if (!InAppPurchases || typeof InAppPurchases.isAvailableAsync !== 'function') {
        // Try accessing methods directly from the module object
        if (module.isAvailableAsync) {
          InAppPurchases = module;
        } else {
          console.log('expo-in-app-purchases module structure unexpected or not available');
          InAppPurchases = false;
        }
      }
    } catch (error) {
      console.log('expo-in-app-purchases not available:', error);
      InAppPurchases = false; // Mark as unavailable
    }
  }
  return InAppPurchases;
};

export class PurchaseService {
  static async initialize(): Promise<void> {
    try {
      const IAP = await loadInAppPurchases();
      if (!IAP || IAP === false) {
        console.log('In-app purchases not available');
        return;
      }

      // Check if methods exist before calling
      if (typeof IAP.isAvailableAsync !== 'function') {
        console.log('In-app purchases methods not available');
        return;
      }

      const isAvailable = await IAP.isAvailableAsync();
      if (!isAvailable) {
        console.log('In-app purchases not available on this device');
        return;
      }

      if (typeof IAP.connectAsync === 'function') {
        await IAP.connectAsync();
      }
    } catch (error) {
      console.error('Error initializing purchases:', error);
    }
  }

  static async disconnect(): Promise<void> {
    try {
      const IAP = await loadInAppPurchases();
      if (IAP && IAP !== false) {
        await IAP.disconnectAsync();
      }
    } catch (error) {
      console.error('Error disconnecting purchases:', error);
    }
  }

  static async getProducts(): Promise<any[]> {
    try {
      const IAP = await loadInAppPurchases();
      if (!IAP || IAP === false || typeof IAP.getProductsAsync !== 'function') {
        return [];
      }
      const { results } = await IAP.getProductsAsync([REMOVE_ADS_PRODUCT_ID]);
      return results;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  static async purchaseRemoveAds(): Promise<boolean> {
    try {
      const IAP = await loadInAppPurchases();
      if (!IAP || IAP === false) {
        throw new Error('In-app purchases not available');
      }

      if (typeof IAP.isAvailableAsync !== 'function' || typeof IAP.purchaseItemAsync !== 'function') {
        throw new Error('In-app purchases methods not available');
      }

      const isAvailable = await IAP.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('In-app purchases not available');
      }

      await IAP.purchaseItemAsync(REMOVE_ADS_PRODUCT_ID);
      
      // The purchase will be handled by the purchase listener
      // For now, we'll check the purchase history
      const hasPurchased = await this.checkPurchaseStatus();
      if (hasPurchased) {
        await this.setAdsRemoved(true);
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Error purchasing:', error);
      if (error.code === 'E_USER_CANCELLED') {
        throw new Error('Purchase was cancelled');
      }
      throw error;
    }
  }

  static async restorePurchases(): Promise<boolean> {
    try {
      const IAP = await loadInAppPurchases();
      if (!IAP || IAP === false) {
        throw new Error('In-app purchases not available');
      }

      if (typeof IAP.isAvailableAsync !== 'function' || typeof IAP.getPurchaseHistoryAsync !== 'function') {
        throw new Error('In-app purchases methods not available');
      }

      const isAvailable = await IAP.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('In-app purchases not available');
      }

      const { results } = await IAP.getPurchaseHistoryAsync();
      
      const hasRemoveAds = results.some(
        (purchase) => purchase.productId === REMOVE_ADS_PRODUCT_ID
      );

      if (hasRemoveAds) {
        await this.setAdsRemoved(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      throw error;
    }
  }

  static async checkPurchaseStatus(): Promise<boolean> {
    try {
      const IAP = await loadInAppPurchases();
      if (!IAP || IAP === false) {
        // If IAP not available, check stored status
        const settings = await StorageService.getSettings();
        return settings?.adsRemoved || false;
      }

      if (typeof IAP.isAvailableAsync !== 'function' || typeof IAP.getPurchaseHistoryAsync !== 'function') {
        // If methods not available, check stored status
        const settings = await StorageService.getSettings();
        return settings?.adsRemoved || false;
      }

      const isAvailable = await IAP.isAvailableAsync();
      if (!isAvailable) {
        // If IAP not available, check stored status
        const settings = await StorageService.getSettings();
        return settings?.adsRemoved || false;
      }

      const { results } = await IAP.getPurchaseHistoryAsync();
      const hasRemoveAds = results.some(
        (purchase) => purchase.productId === REMOVE_ADS_PRODUCT_ID
      );

      if (hasRemoveAds) {
        await this.setAdsRemoved(true);
        return true;
      }

      // Also check stored status
      const settings = await StorageService.getSettings();
      return settings?.adsRemoved || false;
    } catch (error) {
      console.error('Error checking purchase status:', error);
      // Fallback to stored status
      const settings = await StorageService.getSettings();
      return settings?.adsRemoved || false;
    }
  }

  static async setAdsRemoved(value: boolean): Promise<void> {
    try {
      const settings = await StorageService.getSettings();
      await StorageService.saveSettings({
        unitType: settings?.unitType || 'km',
        year: settings?.year || new Date().getFullYear(),
        adsRemoved: value,
      });
    } catch (error) {
      console.error('Error saving ads removed status:', error);
      throw error;
    }
  }

  static async isAdsRemoved(): Promise<boolean> {
    try {
      const settings = await StorageService.getSettings();
      return settings?.adsRemoved || false;
    } catch (error) {
      console.error('Error checking ads removed status:', error);
      return false;
    }
  }

  // Set up purchase listener
  static setupPurchaseListener(
    onPurchaseUpdate: (purchase: any) => void
  ): () => void {
    let subscription: any = null;
    
    loadInAppPurchases().then((IAP) => {
      if (IAP && IAP !== false && typeof IAP.setPurchaseListener === 'function') {
        subscription = IAP.setPurchaseListener(({ response, results }: any) => {
          if (response === IAP.IAPResponseCode.OK) {
            results.forEach((purchase: any) => {
              if (purchase.productId === REMOVE_ADS_PRODUCT_ID) {
                onPurchaseUpdate(purchase);
              }
            });
          }
        });
      }
    }).catch((error) => {
      console.error('Error setting up purchase listener:', error);
    });

    return () => {
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
  }
}

