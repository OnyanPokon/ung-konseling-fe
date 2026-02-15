type ModelKeys = 'konseli' | 'konselor' | 'jadwal_konselor' | 'tiket' | 'hari_layanan' | 'user';

export default abstract class Model {
  static children: { [key in ModelKeys]?: ModelChildren | ModelChildren[] } = {
    konseli: undefined,
    konselor: undefined,
    jadwal_konselor: undefined,
    tiket: undefined,
    hari_layanan: undefined,
    user: undefined
  };
}

export type ModelChildren = new (...args: any[]) => Model;
