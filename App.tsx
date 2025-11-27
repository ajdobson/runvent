import React, { useEffect, useState } from 'react';
import CalendarScreen from './src/screens/CalendarScreen';
import { StorageService } from './src/services/StorageService';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
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

