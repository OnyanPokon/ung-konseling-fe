/* eslint-disable no-unused-vars */
import { ScreeningQuestions } from '@/models';
import api from '@/utils/api';

export default class AssessmentQuestionService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: AssessmentQuestion[];
   * }>}
   * */
  static getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
    const abortController = new AbortController();
    const response = api.get('/screening_question', {
      token,
      signal: abortController.signal,
      params
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const question = apiData?.question ?? apiData?.data ?? apiData ?? [];
        return ScreeningQuestions.fromApiData(question);
      }
    };
  }

  static getById({ token, id, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
    const abortController = new AbortController();
    const response = api.get(`/screening_question/${id}`, {
      token,
      signal: abortController.signal,
      params
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const question = apiData?.question ?? apiData?.data ?? apiData ?? {};
        return ScreeningQuestions.fromApiData(question);
      }
    };
  }

  /**
   * @param {AssessmentQuestion} data
   * @param {string} token
   */
  static async store(data, token) {
    return await api.post('/screening_question', { body: ScreeningQuestions.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {AssessmentQuestion} data
   * @param {string} token
   */
  static async update(id, data, token) {
    return await api.put(`/screening_question/${id}`, { body: ScreeningQuestions.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {string} token
   */
  static async delete(id, token) {
    return await api.delete(`/screening_question/${id}`, { token });
  }

  /**
   * @param {number[]} ids
   * @param {string} token
   */
  static async deleteBatch(ids, token) {
    return await api.delete(`/screening_question/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
