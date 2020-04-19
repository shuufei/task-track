import { useState, useEffect } from 'react';

export const useInit = (callback: () => void) => {
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (!initialized) {
      callback();
      setInitialized(true);
    }
  }, [callback, initialized, setInitialized]);
  return;
};
