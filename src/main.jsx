import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AntdConfigProviders, AuthProvider, CrudModalProvider, NotificationProvider, NotificationPusherProvider } from './providers';
import 'leaflet/dist/leaflet.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AntdConfigProviders>
      <NotificationProvider>
        <AuthProvider>
          <NotificationPusherProvider>
            <CrudModalProvider>
              <App />
            </CrudModalProvider>
          </NotificationPusherProvider>
        </AuthProvider>
      </NotificationProvider>
    </AntdConfigProviders>
  </StrictMode>
);
