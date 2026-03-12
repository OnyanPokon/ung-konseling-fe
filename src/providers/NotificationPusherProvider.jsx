import React from 'react';
import { message, notification } from 'antd';
import { useAuth, useService } from '@/hooks';
import PropTypes from 'prop-types';
import { NotificationService } from '@/services';
import { createEcho } from '@/lib/echo';
import { NotificationPusherContext } from '@/context';

export default function NotificationPusherProvider({ children }) {
  const { user, token, isAuthBootstrapping } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const echoRef = React.useRef(null);
  const initializedRef = React.useRef(false);

  const [notifications, setNotifications] = React.useState([]);
  const [unreadCount, setUnreadCount] = React.useState(0);

  const { execute, data, isLoading } = useService(NotificationService.getAll);
  const readNotif = useService(NotificationService.markAsRead);

  const fetchNotificationHistory = React.useCallback(() => {
    if (!token) return;

    execute({
      token
    });
  }, [execute, token]);

  React.useEffect(() => {
    if (isAuthBootstrapping) return;
    if (!user?.id || !token) return;

    fetchNotificationHistory();
  }, [fetchNotificationHistory, isAuthBootstrapping, token, user?.id]);

  React.useEffect(() => {
    if (!data) return;

    console.log('📦 SET NOTIFICATION HISTORY');

    setNotifications(data);

    const unread = data.filter((n) => !n.read_at).length;
    setUnreadCount(unread);
  }, [data]);

  React.useEffect(() => {
    if (isAuthBootstrapping) return;
    if (!user?.id || !token) return;
    if (initializedRef.current) return;

    initializedRef.current = true;

    console.log('🚀 INIT WEBSOCKET');

    const echo = createEcho(token);
    echoRef.current = echo;

    const channelName = `User.${user.id}`;

    console.log('📡 SUBSCRIBE:', channelName);

    echo.private(channelName).notification((notif) => {
      console.log('📨 REALTIME NOTIF:', notif);

      notification.info({
        message: notif.title,
        description: notif.message,
        placement: 'topRight'
      });

      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      console.log('🧹 CLEANUP WEBSOCKET');

      if (echoRef.current) {
        echoRef.current.leave(`private-${channelName}`);
        echoRef.current.disconnect();
        echoRef.current = null;
      }

      initializedRef.current = false;
    };
  }, [user?.id, token, isAuthBootstrapping]);

  const readNotification = React.useCallback(
    async (notificationId) => {
      try {
        await readNotif.execute({
          id: notificationId,
          token
        });

        messageApi.success('Berhasil menandai notifikasi');

        setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n)));

        setUnreadCount((prev) => Math.max(prev - 1, 0));
      } catch (err) {
        console.error(err);
        messageApi.error('Gagal menandai notifikasi');
      }
    },
    [readNotif, token, messageApi]
  );

  return (
    <NotificationPusherContext.Provider
      value={{
        notifications,
        unreadCount,
        loading: isLoading,
        setNotifications,
        setUnreadCount,
        refetch: fetchNotificationHistory,
        readNotification
      }}
    >
      {contextHolder}
      {children}
    </NotificationPusherContext.Provider>
  );
}

NotificationPusherProvider.propTypes = {
  children: PropTypes.node.isRequired
};
