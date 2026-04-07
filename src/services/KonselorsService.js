/* eslint-disable no-unused-vars */
import { Konselors } from '@/models';
import api from '@/utils/api';

export default class KonselorsService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Konselors[];
   * }>}
   * */
  static getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
    const abortController = new AbortController();
    const response = api.get('/konselor', {
      token,
      signal: abortController.signal,
      params
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const konselor = apiData?.konselor ?? apiData?.data ?? apiData ?? [];
        return Konselors.fromApiData(konselor);
      }
    };
  }

  static getByUserId({ token, id, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
    const abortController = new AbortController();
    const response = api.get(`/konselor/user/${id}`, {
      token,
      signal: abortController.signal,
      params
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const konselor = apiData?.konselor ?? apiData?.data ?? apiData ?? {};
        return Konselors.fromApiData(konselor);
      }
    };
  }

  static getOverview({ token, ...filters }) {
    const abortController = new AbortController();
    const response = api.get(`/konselor/overview`, {
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

  /**
   * @param {Konselors} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token, file) {
    return await api.post('/konselor', { body: Konselors.toApiData(data), token, file: { foto_profil: file } });
  }

  /**
   * @param {number} id
   * @param {Konselors} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token, file) {
    return await api.post(`/konselor/${id}`, { body: Konselors.toApiData(data), token, file: { foto_profil: file } });
  }

  /**
   * @param {number} id
   * @param {Konselors} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async updateProfile(id, data, token) {
    return await api.put(`/konselor/${id}`, { body: Konselors.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   * }>}
   */
  static async delete(id, token) {
    return await api.delete(`/konselor/${id}`, { token });
  }

  /**
   * @param {number[]} ids
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   * }>}
   */
  static async deleteBatch(ids, token) {
    return await api.delete(`/konselor/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
