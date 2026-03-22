/* eslint-disable no-unused-vars */
import { Articles } from '@/models';
import api from '@/utils/api';

export default class ArticlesService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Articles[];
   * }>}
   * */
  static getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
    const abortController = new AbortController();
    const response = api.get('/artikel', {
      token,
      signal: abortController.signal,
      params
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const articles = apiData?.articles ?? apiData?.data ?? apiData ?? [];
        return Articles.fromApiData(articles);
      }
    };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: News[];
   * }>}
   * */
  static getAllInLanding({ ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
    const abortController = new AbortController();
    const response = api.get('/landing/artikel', {
      signal: abortController.signal,
      params
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const articles = apiData?.articles ?? apiData?.data ?? apiData ?? [];
        return Articles.fromApiData(articles);
      }
    };
  }

  static async getBySlug({ slug }) {
    const response = await api.get(`/landing/artikel/${slug}`);
    if (!response.data) return response;
    return { ...response, data: Articles.fromApiData(response.data) };
  }

  /**
   * @param {Articles} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token, file) {
    return await api.post('/artikel', { body: Articles.toApiData(data), token, file: { thumbnail: file } });
  }

  /**
   * @param {number} id
   * @param {Articles} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.put(`/artikel/${id}`, { body: Articles.toApiData(data), token });
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
    return await api.delete(`/artikel/${id}`, { token });
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
    return await api.delete(`/artikel/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
