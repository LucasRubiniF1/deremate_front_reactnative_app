import { useEffect, useRef } from 'react';
import { useNotificationContext } from '../../App';

/**
 * Custom hook to detect when a notification is closed and trigger effects
 * @param {Function} callback - Function to call when notification is closed
 * @param {Array} dependencies - Dependencies for the useEffect (optional)
 * @param {Object} options - Additional options
 * @param {boolean} options.onlyOnClose - Only trigger when notification closes (not when it opens)
 * @param {boolean} options.includeData - Pass notification data to callback
 */
export const useNotificationClose = (callback, dependencies = [], options = {}) => {
  const { hasActiveNotification, notificationData } = useNotificationContext();
  const { onlyOnClose = true, includeData = false } = options;
  const previousNotificationState = useRef(hasActiveNotification);

  useEffect(() => {
    // If we only want to trigger on close and notification was active before but not now
    if (onlyOnClose && previousNotificationState.current && !hasActiveNotification) {
      if (includeData) {
        callback(notificationData);
      } else {
        callback();
      }
    }
    // If we want to trigger on both open and close
    else if (!onlyOnClose && previousNotificationState.current !== hasActiveNotification) {
      if (includeData) {
        callback(notificationData, hasActiveNotification);
      } else {
        callback(hasActiveNotification);
      }
    }

    // Update the previous state
    previousNotificationState.current = hasActiveNotification;
  }, [hasActiveNotification, callback, onlyOnClose, includeData, notificationData, ...dependencies]);

  return {
    hasActiveNotification,
    notificationData
  };
};

/**
 * Hook to detect when a specific type of notification is closed
 * @param {string} notificationType - Type of notification to watch for
 * @param {Function} callback - Function to call when notification is closed
 * @param {Array} dependencies - Dependencies for the useEffect
 */
export const useSpecificNotificationClose = (notificationType, callback, dependencies = []) => {
  const { hasActiveNotification, notificationData } = useNotificationContext();
  const previousNotificationState = useRef(hasActiveNotification);
  const previousNotificationType = useRef(null);

  useEffect(() => {
    // Check if this is the notification type we're watching for
    const isTargetNotification = notificationData?.data?.type === notificationType || 
                                notificationData?.title?.includes(notificationType);

    // If notification was active before but not now, and it was our target type
    if (previousNotificationState.current && !hasActiveNotification && 
        previousNotificationType.current === notificationType) {
      callback(notificationData);
    }

    // Update the previous states
    previousNotificationState.current = hasActiveNotification;
    previousNotificationType.current = isTargetNotification ? notificationType : null;
  }, [hasActiveNotification, notificationData, notificationType, callback, ...dependencies]);

  return {
    hasActiveNotification,
    notificationData,
    isTargetNotification: notificationData?.data?.type === notificationType || 
                         notificationData?.title?.includes(notificationType)
  };
}; 