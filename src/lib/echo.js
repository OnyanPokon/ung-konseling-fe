import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

export const createEcho = (token) => {
  const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: false,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],

    authEndpoint: `${import.meta.env.VITE_BASE_URL}/broadcasting/auth`,

    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    }
  });

  echo.connector.pusher.connection.bind('connected', () => {
    console.log('🟢 WEBSOCKET CONNECTED');
  });

  echo.connector.pusher.connection.bind('state_change', (states) => {
    console.log('WS STATE:', states);
  });

  return echo;
};
