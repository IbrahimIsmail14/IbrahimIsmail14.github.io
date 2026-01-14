
export type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning';

/**
 * Triggers a subtle haptic vibration if supported by the browser/device.
 * Gracefully degrades if the Vibration API is unavailable.
 */
export const triggerHaptic = (style: HapticStyle = 'light') => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    const patterns: Record<HapticStyle, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: 50,
      success: [10, 30, 10],
      warning: [20, 50, 20],
    };
    
    try {
      navigator.vibrate(patterns[style]);
    } catch (e) {
      // Ignore errors if vibration is blocked or fails
    }
  }
};
