export const vibrate = (pattern = 10) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Ignore errors on devices that don't support it
    }
  }
};

export const isMobile = () => {
  return window.innerWidth < 768;
};

