import React, { useEffect, useState } from 'react';
import CalendarScreen from './src/screens/CalendarScreen';
import { StorageService } from './src/services/StorageService';
import mobileAds from "react-native-google-mobile-ads";

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize storage
    StorageService.init().then(() => {
      setIsReady(true);
    });

    mobileAds()
    .initialize()
    .then((adapterStatuses) => {
      console.log("adapterStatuses", adapterStatuses);
    });
  }, []);

  if (!isReady) {
    return null;
  }

  

  return <CalendarScreen />;
}
