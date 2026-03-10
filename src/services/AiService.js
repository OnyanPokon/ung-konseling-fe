import api from '@/utils/api';

export default class AiService {
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
  static async chat(data, token) {
    return await api.post('/ai-chat', { body: data, token });
  }
}
