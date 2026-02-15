/* eslint-disable no-unused-vars */
import { JadwalKonselors } from '@/models';
import api from '@/utils/api';

export default class JadwalKonselorsService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: JadwalKonselors[];
   * }>}
   * */
  static getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
    const abortController = new AbortController();
    const response = api.get('/jadwal_konselor', {
      token,
      signal: abortController.signal,
      params
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const jadwalKonselor = apiData?.jadwalKonselor ?? apiData?.data ?? apiData ?? [];
        return JadwalKonselors.fromApiData(jadwalKonselor);
      }
    };
  }

  /**
   * @param {JadwalKonselors} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/jadwal_konselor', { body: JadwalKonselors.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {JadwalKonselors} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.put(`/jadwal_konselor/${id}`, { body: JadwalKonselors.toApiData(data), token });
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
    return await api.delete(`/jadwal_konselor/${id}`, { token });
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
    return await api.delete(`/jadwal_konselor/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
