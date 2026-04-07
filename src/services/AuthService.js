import { Konselis, User } from '@/models';
import api from '@/utils/api';

export default class AuthService {
  /**
   * Logs in a user with the provided email and password.
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<{
   *   code: HTTPStatusCode,
   *   status: boolean,
   *   message: string,
   *   data?: string
   * }>} - A promise that resolves to an object containing the HTTP status code, status, message, and authentication token.
   */
  static async login(email, password) {
    const response = await api.post('/auth/login', { body: { email, password } });
    if (!response.data) return response;
    return {
      ...response,
      data: response.data.token
    };
  }

  /**
   * @param {string} token
   * @returns {Promise<Promise<{
   *   code: HTTPStatusCode,
   *   status: boolean,
   *   message: string,
   *   data?: User
   * }>}
   */
  static async me(token) {
    const response = await api.get('/auth/me', { token });
    if (!response.data) return response;
    return { ...response, data: User.fromApiData(response.data, token) };
  }

  static async logout() {
    return await api.post('/auth/logout');
  }

  /**
   * @param {Konselis} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async regisKonseli(data, token) {
    return await api.post('/register/konseli', { body: Konselis.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async updateProfile(data, token) {
    return await api.post(`/auth/update-profile`, { body: data, token });
  }

  /**
   * @param {number} id
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async changePassword(data, token) {
    return await api.post(`/auth/change-password`, { body: data, token });
  }

  /**
   * @param {string} token
   * @returns {Promise<Promise<{
   *   code: HTTPStatusCode,
   *   status: boolean,
   *   message: string,
   *   data?: User
   * }>}
   */
  static adminOverview({ token }) {
    const abortController = new AbortController();
    const response = api.get(`/auth/overview`, {
      token,
      signal: abortController.signal
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const konselor = apiData?.konselor ?? apiData?.data ?? apiData ?? {};
        return konselor;
      }
    };
  }
}
