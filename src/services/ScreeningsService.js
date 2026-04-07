/* eslint-disable no-unused-vars */
import { Assessments } from '@/models';
import api from '@/utils/api';

export default class ScreeningsService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Screenings[];
   * }>}
   * */
  static getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
    const abortController = new AbortController();
    const response = api.get('/assessment', {
      token,
      signal: abortController.signal,
      params
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const assessment = apiData?.assessment ?? apiData?.data ?? apiData ?? [];
        return Assessments.fromApiData(assessment);
      }
    };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Assessments[];
   * }>}
   * */
  static getBySlug({ slug }) {
    const abortController = new AbortController();
    const response = api.get(`/landing/assessment/${slug}`, {
      signal: abortController.signal
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const assessment = apiData?.assessment ?? apiData?.data ?? apiData ?? [];
        return assessment;
      }
    };
  }

  static getById({ token, id, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
    const abortController = new AbortController();
    const response = api.get(`/assessment/${id}`, {
      token,
      signal: abortController.signal,
      params
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const assessment = apiData?.assessment ?? apiData?.data ?? apiData ?? {};
        return Assessments.fromApiData(assessment);
      }
    };
  }

  static getMatrix({ token, id, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
    const abortController = new AbortController();
    const response = api.get(`/assessment/${id}/matrix`, {
      token,
      signal: abortController.signal,
      params
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const assessment = apiData?.assessment ?? apiData?.data ?? apiData ?? {};
        return assessment;
      }
    };
  }

  /**
   * @param {Assessments} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/assessment', { body: Assessments.toApiData(data), token });
  }

  /**
   * @param {Assessments} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async storeResponse(data) {
    return await api.post('/landing/assessment/response', { body: data });
  }

  /**
   * @param {number} id
   * @param {Assessments} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.put(`/assessment/${id}`, { body: Assessments.toApiData(data), token });
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
    return await api.delete(`/assessment/${id}`, { token });
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
    return await api.delete(`/assessment/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
