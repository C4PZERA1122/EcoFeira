import { useEffect, useState } from 'react';
import { storageService } from '../services/storageService';

export function useOnlineStatus() {
  const [navigatorOnline, setNavigatorOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(
    storageService.isSimulatedOffline()
  );

  useEffect(() => {
    const handleOnline = () => setNavigatorOnline(true);
    const handleOffline = () => setNavigatorOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const unsubscribe = storageService.subscribe(() => {
      setIsSimulatedOffline(storageService.isSimulatedOffline());
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
    };
  }, []);

  const toggleSimulatedOffline = () => {
    storageService.setSimulatedOffline(!isSimulatedOffline);
  };

  const isOnline = navigatorOnline && !isSimulatedOffline;

  return {
    isOnline,
    isSimulatedOffline,
    toggleSimulatedOffline,
  };
}
