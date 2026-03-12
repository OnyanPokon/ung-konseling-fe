import { Notification } from '@/models';
import api from '@/utils/api';

export default class NotificationService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Notification[];
   * }>}
   * */
  static async getAll({ token }) {
    const response = await api.get('/notifications', { token });
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  /**
   * @param {Notification} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async markAsRead(id, token) {
    return await api.post(`/notifications/${id}/read`, { token });
  }

  /**
   * @param {number} id
   * @param {Notification} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.patch(`/notification/edit/${id}`, { body: Notification.toApiData(data), token });
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
    return await api.delete(`/notification/delete/${id}`, { token });
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
    return await api.delete(`/notification/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
