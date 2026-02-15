/* eslint-disable no-unused-vars */
import { HariLayanans } from '@/models';
import api from '@/utils/api';

export default class HariLayanansService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: HariLayanans[];
   * }>}
   * */
  static getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
    const abortController = new AbortController();
    const response = api.get('/hari_layanan', {
      token,
      signal: abortController.signal,
      params
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const hariLayanan = apiData?.hariLayanan ?? apiData?.data ?? apiData ?? [];
        return HariLayanans.fromApiData(hariLayanan);
      }
    };
  }

  /**
   * @param {HariLayanans} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/hari_layanan', { body: HariLayanans.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {HariLayanans} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.put(`/hari_layanan/${id}`, { body: HariLayanans.toApiData(data), token });
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
    return await api.delete(`/hari_layanan/${id}`, { token });
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
    return await api.delete(`/hari_layanan/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
