import * as RNIap from 'react-native-iap';
import { StorageService } from './StorageService';

// Replace with your actual product ID from App Store Connect / Google Play Console
// Product IDs are case-sensitive and must match exactly what's in App Store Connect
const REMOVE_ADS_PRODUCT_ID = 'com.ajdevelopment.runvent.removeAds';

export class PurchaseService {
  private static purchaseUpdateSubscription: any = null;
  private static purchaseErrorSubscription: any = null;

  static async initialize(): Promise<void> {
    try {
      // Check if IAP is available and connect
      await RNIap.initConnection();
      this.setupPurchaseListener();
    } catch (error) {
      console.error('Error initializing purchases:', error);
    }
  }

  static async disconnect(): Promise<void> {
    try {
      this.removePurchaseListeners();
      await RNIap.endConnection();
    } catch (error) {
      console.error('Error disconnecting purchases:', error);
    }
  }

  static async getProducts(): Promise<RNIap.Product[]> {
    try {
      console.log('Fetching products with ID:', REMOVE_ADS_PRODUCT_ID);
      const products = await RNIap.getProducts({ skus: [REMOVE_ADS_PRODUCT_ID] });
      console.log('Available products:', products);
      if (products.length === 0) {
        console.warn('⚠️ No products found. Make sure the product ID exists in App Store Connect.');
      }
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  static async purchaseRemoveAds(): Promise<boolean> {
    try {
      // First, verify the product exists
      const products = await this.getProducts();
      if (products.length === 0) {
        throw new Error(
          'Product not found. Please ensure the product ID "com.ajdevelopment.runvent.removeads" exists in App Store Connect and is in "Ready to Submit" or "Approved" status.'
        );
      }
      
      console.log('Requesting purchase for product:', REMOVE_ADS_PRODUCT_ID);
      await RNIap.requestPurchase({ sku: REMOVE_ADS_PRODUCT_ID });
      // The purchase will be handled by the purchase listener
      return true;
    } catch (error: any) {
      console.error('Error purchasing:', error);
      if (error.code === 'E_USER_CANCELLED') {
        throw new Error('Purchase was cancelled');
      }
      if (error.code === 'E_DEVELOPER_ERROR') {
        throw new Error(
          'Invalid product ID. Please ensure the product "com.ajdevelopment.runvent.removeads" exists in App Store Connect.'
        );
      }
      throw error;
    }
  }

  static async restorePurchases(): Promise<boolean> {
    try {
      const purchases = await RNIap.getAvailablePurchases();
      
      const hasRemoveAds = purchases.some(
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
      const purchases = await RNIap.getAvailablePurchases();
      
      const hasRemoveAds = purchases.some(
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
    onPurchaseUpdate?: (purchase: RNIap.Purchase) => void
  ): () => void {
    // Remove existing listeners
    this.removePurchaseListeners();

    // Set up new purchase update listener
    this.purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async (purchase: RNIap.Purchase) => {
        if (purchase.productId === REMOVE_ADS_PRODUCT_ID) {
          // Finish the transaction
          try {
            await RNIap.finishTransaction({ purchase });
            await this.setAdsRemoved(true);
            if (onPurchaseUpdate) {
              onPurchaseUpdate(purchase);
            }
          } catch (error) {
            console.error('Error processing purchase:', error);
          }
        }
      }
    );

    // Set up purchase error listener
    this.purchaseErrorSubscription = RNIap.purchaseErrorListener(
      (error: RNIap.PurchaseError) => {
        console.error('Purchase error:', error);
      }
    );

    // Return cleanup function
    return () => {
      this.removePurchaseListeners();
    };
  }

  private static removePurchaseListeners(): void {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
  }
}
