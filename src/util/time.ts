export const MIN_SEC = 0;
export const MAX_SEC = 60 * 60 * 99 + 60 * 59 + 59; // 24:59:59より大きい値はとりえない

export const convertToTimeFormatFromSec = (timeSec: number) => {
  if (timeSec <= MIN_SEC) {
    return '00:00:00';
  }
  if (timeSec >= MAX_SEC) {
    return '99:59:59';
  }
  const hours = Math.floor(timeSec / (60 * 60));
  const minutes = Math.floor((timeSec - hours * 60 * 60) / 60);
  const seconds = Math.floor(timeSec) - hours * 60 * 60 - minutes * 60;
  const zeroPadding = (n: number) => {
    return String(n).padStart(2, '0');
  };
  return `${zeroPadding(hours)}:${zeroPadding(minutes)}:${zeroPadding(
    seconds
  )}`;
};
