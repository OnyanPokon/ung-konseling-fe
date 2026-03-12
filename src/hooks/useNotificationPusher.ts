import { NotificationPusherContext } from '@/context';
import { useContext } from 'react';

export default function useNotificationPusher() {
  const notificationPusherContext = useContext(NotificationPusherContext);

  if (!notificationPusherContext) {
    throw new Error('useNotificationPusher must be used within a NotificationPusherProvider');
  }

  return notificationPusherContext;
}
