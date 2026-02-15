import { HttpStatusCode } from '@/constants';
import { AuthContext } from '@/context';
import { useLocalStorage, useService } from '@/hooks';
import { AuthService } from '@/services';
import env from '@/utils/env';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

/**
 * @typedef {{
 *  isSuccess: boolean;
 *  message: string;
 * }} Response
 */

/**
 * @type {React.Context<{
 *  login: (email: string, password: string) => Promise<Response>;
 *  logout: () => void;
 *  forgot: (email: string) => Promise<Response>;
 *  reset: (token: string, password: string) => Promise<Response>;
 *  token: string;
 *  user: import('@/models/User').default | null;
 *  isLoading: boolean;
 *  onUnauthorized: () => void;
 * }>}
 */

export default function AuthProvider({ children }) {
  const { execute: loginService, isLoading: loginIsLoading } = useService(AuthService.login);
  const { execute: logoutService, isLoading: logoutIsLoading } = useService(AuthService.logout);
  const { execute: forgotService, isLoading: forgotIsLoading } = useService(AuthService.forgot);
  const { execute: resetService, isLoading: resetIsLoading } = useService(AuthService.reset);
  const { execute: getUser, isLoading: getUserIsLoading } = useService(AuthService.me);
  const [token, setToken] = useLocalStorage('token', '');
  const [user, setUser] = useState(null);
  const [isAuthBootstrapping, setIsAuthBootstrapping] = useState(true);

  env.dev(() => {
    window.token = token;
    window.user = user;
  });

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setUser(null);
        setIsAuthBootstrapping(false);
        return;
      }

      try {
        const res = await getUser(token);

        const code = res?.code;

        if (code === HttpStatusCode.UNAUTHORIZED) {
          setUser(null);
          setToken('');
        } else {
          setUser(res.data);
        }
      } catch {
        setUser(null);
        setToken('');
      } finally {
        setIsAuthBootstrapping(false);
      }
    };

    bootstrap();
  }, [getUser, token, setToken]);

  const login = useCallback(
    /**
     * @param {string} username
     * @param {string} password
     * @returns {Promise<Response>}
     */
    async (username, password) => {
      const { message, isSuccess, data: token } = await loginService(username, password);
      if (!isSuccess) return { message, isSuccess };

      setToken(token);
      return {
        isSuccess,
        message: 'Login berhasil'
      };
    },
    [loginService, setToken]
  );

  const forgot = useCallback(
    /**
     * @param {string} email
     * @returns {Promise<Response>}
     */
    async (email) => {
      const { message, isSuccess } = await forgotService(email);
      if (!isSuccess) return { message, isSuccess };

      return {
        isSuccess,
        message: 'Email reset kata sandi telah dikirim'
      };
    },
    [forgotService]
  );

  const reset = useCallback(
    /**
     * @param {string} token
     * @param {string} password
     * @param {string} confirmPassword
     * @returns {Promise<Response>}
     */
    async (token, password, confirmPassword) => {
      const { message, isSuccess } = await resetService(token, password, confirmPassword);
      if (!isSuccess) return { message, isSuccess };

      return {
        isSuccess,
        message: 'Kata Sandi berhasil direset'
      };
    },
    [resetService]
  );

  const logout = useCallback(() => {
    setToken('');
    logoutService(token);
  }, [logoutService, setToken, token]);

  const onUnauthorized = useCallback(() => logout(), [logout]);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        forgot,
        reset,
        token,
        user,
        isLoading: loginIsLoading || logoutIsLoading || getUserIsLoading || forgotIsLoading || resetIsLoading,
        isAuthBootstrapping,
        onUnauthorized
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
