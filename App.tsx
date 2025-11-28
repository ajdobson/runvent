import React, { useEffect, useState } from 'react';
import { MobileAds } from 'react-native-google-mobile-ads';
import CalendarScreen from './src/screens/CalendarScreen';
import { StorageService } from './src/services/StorageService';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize AdMob
    MobileAds()
      .initialize()
      .then(() => {
        console.log('AdMob initialized');
      })
      .catch((error) => {
        console.error('AdMob initialization error:', error);
      });

    // Initialize storage
    StorageService.init().then(() => {
      setIsReady(true);
    });
  }, []);

  if (!isReady) {
    return null; // Or a loading screen
  }

  return <CalendarScreen />;
}

