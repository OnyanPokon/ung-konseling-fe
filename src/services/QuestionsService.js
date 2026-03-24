/* eslint-disable no-unused-vars */
import { Questions } from '@/models';
import api from '@/utils/api';

export default class QuestionsService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Questions[];
   * }>}
   * */
  static getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
    const abortController = new AbortController();
    const response = api.get('/question', {
      token,
      signal: abortController.signal,
      params
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const question = apiData?.question ?? apiData?.data ?? apiData ?? [];
        return Questions.fromApiData(question);
      }
    };
  }

  static getById({ token, id, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
    const abortController = new AbortController();
    const response = api.get(`/question/${id}`, {
      token,
      signal: abortController.signal,
      params
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const question = apiData?.question ?? apiData?.data ?? apiData ?? {};
        return Questions.fromApiData(question);
      }
    };
  }

  /**
   * @param {Questions} data
   * @param {string} token
   */
  static async store(data, token) {
    return await api.post('/question', { body: Questions.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {Questions} data
   * @param {string} token
   */
  static async update(id, data, token) {
    return await api.put(`/question/${id}`, { body: Questions.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {string} token
   */
  static async delete(id, token) {
    return await api.delete(`/question/${id}`, { token });
  }

  /**
   * @param {number[]} ids
   * @param {string} token
   */
  static async deleteBatch(ids, token) {
    return await api.delete(`/question/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
