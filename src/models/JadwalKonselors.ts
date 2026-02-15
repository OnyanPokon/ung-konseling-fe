import Model from './Model';

export interface IncomingApiData {
  id: number;
  konselor: {
    id: number;
    is_active: boolean;
    user: {
      id: number;
      nama: string;
      email: string;
    };
  };
  hari_layanan: {
    id: number;
    hari: string;
  };
  created_at: string;
  updated_at: string;
}

export interface OutgoingApiData {
  konselor_id: number;
  hari_layanan_id: number;
}

interface FormValue {
  konselor_id: number;
  hari_layanan_id: number;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class JadwalKonselors extends Model {
  constructor(
    public id: number,
    public konselor: {
      id: number;
      is_active: boolean;
      user: {
        id: number;
        name: string;
        email: string;
      };
    },
    public work_day: {
      id: number;
      day_name: string;
    },
    public created_at: string,
    public updated_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, JadwalKonselors> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, JadwalKonselors>;
    return new JadwalKonselors(
      apiData.id,
      {
        id: apiData.konselor.id,
        is_active: apiData.konselor.is_active,
        user: {
          id: apiData.konselor.user.id,
          name: apiData.konselor.user.nama,
          email: apiData.konselor.user.email
        }
      },
      {
        id: apiData.hari_layanan.id,
        day_name: apiData.hari_layanan.hari
      },
      apiData.created_at,
      apiData.updated_at
    ) as ReturnType<T, IncomingApiData, JadwalKonselors>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(jadwalKonselors: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(jadwalKonselors)) return jadwalKonselors.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      konselor_id: jadwalKonselors.konselor_id,
      hari_layanan_id: jadwalKonselors.hari_layanan_id
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.jadwal_konselor = JadwalKonselors;
