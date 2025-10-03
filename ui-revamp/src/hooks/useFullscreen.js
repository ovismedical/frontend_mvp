import { useEffect, useCallback } from 'react';

/**
 * Custom hook to automatically enter fullscreen on mobile devices
 * while keeping normal view on desktop
 */
export const useFullscreen = () => {
  // Detect if device is mobile
  const isMobile = useCallback(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 2) ||
           window.innerWidth <= 768;
  }, []);

  // Enter fullscreen mode
  const enterFullscreen = useCallback(async () => {
    if (!isMobile()) return; // Only on mobile

    try {
      // Check if fullscreen is already active
      if (document.fullscreenElement) return;

      // Try to enter fullscreen
      const element = document.documentElement;
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        // Safari support
        await element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        // IE/Edge support
        await element.msRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        // Firefox support
        await element.mozRequestFullScreen();
      }
    } catch (error) {
      console.warn('Could not enter fullscreen mode:', error);
    }
  }, [isMobile]);

  // Exit fullscreen mode
  const exitFullscreen = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      }
    } catch (error) {
      console.warn('Could not exit fullscreen mode:', error);
    }
  }, []);

  // Handle fullscreen change events
  const handleFullscreenChange = useCallback(() => {
    const isCurrentlyFullscreen = !!document.fullscreenElement;
    console.log('Fullscreen state changed:', isCurrentlyFullscreen);
  }, []);

  useEffect(() => {
    // Only attempt fullscreen on mobile devices
    if (!isMobile()) return;

    // Add event listeners for fullscreen changes
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Attempt to enter fullscreen after a short delay
    // This ensures the page is fully loaded
    const timer = setTimeout(() => {
      enterFullscreen();
    }, 500);

    // Cleanup
    return () => {
      clearTimeout(timer);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [isMobile, enterFullscreen, handleFullscreenChange]);

  // Handle orientation change on mobile
  useEffect(() => {
    if (!isMobile()) return;

    const handleOrientationChange = () => {
      // Re-enter fullscreen after orientation change
      setTimeout(() => {
        enterFullscreen();
      }, 100);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, [isMobile, enterFullscreen]);

  return {
    isMobile: isMobile(),
    enterFullscreen,
    exitFullscreen,
    isFullscreen: !!document.fullscreenElement
  };
};
