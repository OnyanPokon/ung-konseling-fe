import { useAuth } from '@/hooks';
import { useEffect } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';

const Auth = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  useEffect(() => {
    if (!token || !user) return;

    const dashboardByRole = {
      konselor: '/konselor_dashboard',
      konseli: '/konseli_dashboard',
      admin: '/admin_dashboard'
    };

    if (redirect && !redirect.includes('/auth')) {
      navigate(redirect, { replace: true });
      return;
    }

    const roleDashboard = dashboardByRole[user.role?.toLowerCase()] || '/';

    navigate(roleDashboard, { replace: true });
  }, [token, user, redirect, navigate]);

  return (
    <div className="w-full bg-slate-50 font-sans">
      <div className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col items-center justify-center px-4 py-12">
        <Outlet />
      </div>
    </div>
  );
};

export default Auth;
