import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../services/StorageService';
import { PurchaseService } from '../services/PurchaseService';
import { UnitType } from '../types';

export default function SettingsScreen() {
  const [unitType, setUnitType] = useState<UnitType>('km');
  const [adsRemoved, setAdsRemoved] = useState(false);
  const [isLoadingPurchase, setIsLoadingPurchase] = useState(false);

  useEffect(() => {
    loadSettings();
    checkPurchaseStatus();
    setupPurchaseListener();
    
    return () => {
      PurchaseService.disconnect();
    };
  }, []);

  const loadSettings = async () => {
    const settings = await StorageService.getSettings();
    if (settings) {
      setUnitType(settings.unitType);
      setAdsRemoved(settings.adsRemoved || false);
    }
  };

  const checkPurchaseStatus = async () => {
    try {
      const removed = await PurchaseService.checkPurchaseStatus();
      setAdsRemoved(removed);
    } catch (error) {
      console.error('Error checking purchase status:', error);
      // Silently fail - just check stored status
      const settings = await StorageService.getSettings();
      setAdsRemoved(settings?.adsRemoved || false);
    }
  };

  const setupPurchaseListener = async () => {
    try {
      await PurchaseService.initialize();
      
      const cleanup = PurchaseService.setupPurchaseListener(async (purchase) => {
        if (purchase && purchase.productId === 'com.runvent.removeads') {
          await PurchaseService.setAdsRemoved(true);
          setAdsRemoved(true);
          Alert.alert('Success', 'Ads have been removed! Thank you for your purchase.');
        }
      });
      
      // Store cleanup function if needed
      return cleanup;
    } catch (error) {
      // Silently fail - in-app purchases may not be available in Expo Go
      console.error('Error setting up purchase listener:', error);
    }
  };

  const handlePurchase = async () => {
    setIsLoadingPurchase(true);
    try {
      await PurchaseService.purchaseRemoveAds();
      // Purchase will be handled by the listener
    } catch (error: any) {
      Alert.alert(
        'Purchase Failed',
        error.message || 'Unable to complete purchase. Please try again.'
      );
    } finally {
      setIsLoadingPurchase(false);
    }
  };

  const handleRestore = async () => {
    setIsLoadingPurchase(true);
    try {
      const restored = await PurchaseService.restorePurchases();
      if (restored) {
        setAdsRemoved(true);
        Alert.alert('Success', 'Your purchase has been restored!');
      } else {
        Alert.alert('No Purchases Found', 'No previous purchases were found to restore.');
      }
    } catch (error: any) {
      Alert.alert('Restore Failed', error.message || 'Unable to restore purchases. Please try again.');
    } finally {
      setIsLoadingPurchase(false);
    }
  };

  const handleUnitChange = async (newUnit: UnitType) => {
    try {
      const settings = await StorageService.getSettings();
      await StorageService.saveSettings({
        unitType: newUnit,
        year: settings?.year || new Date().getFullYear(),
      });
      setUnitType(newUnit);
      Alert.alert('Success', `Unit changed to ${newUnit}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>About Runvent</Text>
        <Text style={styles.infoText}>
          The Runvent Challenge is a December running advent calendar.
        </Text>
        <Text style={styles.infoText}>
          Run 1 {unitType} on December 1st, 2 {unitType} on December 2nd, and
          so on through December 24th!
        </Text>
        <Text style={styles.infoText}>
          By the end of the challenge, you'll have run 300 {unitType} total! 🏃‍♀️
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Distance Unit</Text>
        <View style={styles.optionGroup}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              unitType === 'km' && styles.optionButtonActive,
            ]}
            onPress={() => handleUnitChange('km')}
          >
            <Text
              style={[
                styles.optionText,
                unitType === 'km' && styles.optionTextActive,
              ]}
            >
              Kilometers (km)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.optionButton,
              unitType === 'miles' && styles.optionButtonActive,
            ]}
            onPress={() => handleUnitChange('miles')}
          >
            <Text
              style={[
                styles.optionText,
                unitType === 'miles' && styles.optionTextActive,
              ]}
            >
              Miles
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Remove Ads</Text>
        {adsRemoved ? (
          <View style={styles.purchaseStatusContainer}>
            <Ionicons name="checkmark-circle" size={24} color="#228b22" />
            <Text style={styles.purchaseStatusText}>Ads Removed ✓</Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionDescription}>
              Support Runvent by removing ads and enjoy an ad-free experience!
            </Text>
            <TouchableOpacity
              style={[styles.purchaseButton, isLoadingPurchase && styles.purchaseButtonDisabled]}
              onPress={handlePurchase}
              disabled={isLoadingPurchase}
            >
              {isLoadingPurchase ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="star" size={20} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.purchaseButtonText}>Remove Ads</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.restoreButton}
              onPress={handleRestore}
              disabled={isLoadingPurchase}
            >
              <Text style={styles.restoreButtonText}>Restore Purchases</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff4d2',
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  optionGroup: {
    gap: 8,
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  optionButtonActive: {
    borderColor: '#FF4444',
    backgroundColor: '#fff5f5',
  },
  optionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  optionTextActive: {
    color: '#FF4444',
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  purchaseStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f0fff0',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#228b22',
  },
  purchaseStatusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#228b22',
    marginLeft: 8,
  },
  purchaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8a2a39',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  restoreButton: {
    padding: 12,
    alignItems: 'center',
  },
  restoreButtonText: {
    fontSize: 14,
    color: '#8a2a39',
    textDecorationLine: 'underline',
  },
});
