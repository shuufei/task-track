import { useState } from 'react';

export const useDebounce = (
  ms: number
): [(cb: () => void) => void, boolean] => {
  const [timeoutProcess, setTimeoutProcess] = useState<NodeJS.Timeout | null>(
    null
  );
  return [
    (cb: () => void) => {
      if (timeoutProcess != null) {
        clearTimeout(timeoutProcess);
      }
      setTimeoutProcess(
        setTimeout(() => {
          cb();
          setTimeoutProcess(null);
        }, ms)
      );
    },
    timeoutProcess != null ? true : false
  ];
};
