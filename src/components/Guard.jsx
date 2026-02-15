/* eslint-disable react/prop-types */
// components/Guard.jsx
import { Result } from 'antd';
import { useAuth } from '@/hooks';
import { LoadingOverlay } from '@/pages/result';

export default function Guard({ permissions = [], roles = [], children }) {
  const { user, isAuthBootstrapping } = useAuth();

  if (isAuthBootstrapping) {
    return <LoadingOverlay />;
  }

  if (!user) {
    return <Result status="403" title="Forbidden" subTitle="Anda belum login" />;
  }

  const permissionAllowed = permissions.length === 0 || !user.cantDoAny(...permissions);

  const roleAllowed = roles.length === 0 || roles.some((role) => user.is(role));

  if (!permissionAllowed || !roleAllowed) {
    return <Result status="403" title="Forbidden" subTitle="Anda tidak memiliki akses ke halaman ini" />;
  }

  return children;
}
