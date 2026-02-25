import Model from './Model';

export interface IncomingApiData {
  id: number;
  nomor_tiket: string;
  konseli: {
    id: number;
    nim: string;
    phone: string;
    user: {
      id: number;
      nama: string;
      email: string;
    };
    domisili: string;
    jurusan: string;
    umur: number;
    jenis_kelamin: 'L' | 'P';
  };
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
  deskripsi_keluhan: string;
  status: 'pending' | 'approved' | 'rejected';
  jenis_layanan: 'bimbingan' | 'konseling';
  jenis_keluhan: 'sosial' | 'pribadi' | 'akademik' | 'karir';
  urgensi: 'mendesak' | 'cukup_mendesak' | 'tidak_mendesak';
  created_at: string;
  updated_at: string;
}

export interface OutgoingApiData {
  konseli_id: number;
  konselor_id: number;
  hari_layanan_id: number;
  deskripsi_keluhan: string;
  status: 'pending' | 'approved' | 'rejected';
  jenis_layanan: 'bimbingan' | 'konseling';
  jenis_keluhan: 'sosial' | 'pribadi' | 'akademik' | 'karir';
  urgensi: 'mendesak' | 'cukup_mendesak' | 'tidak_mendesak';
}

interface FormValue {
  konseli_id: number;
  konselor_id: number;
  hari_layanan_id: number;
  desc: string;
  status: 'pending' | 'approved' | 'rejected';
  service_type: 'bimbingan' | 'konseling';
  type: 'sosial' | 'pribadi' | 'akademik' | 'karir';
  urgent: 'mendesak' | 'cukup_mendesak' | 'tidak_mendesak';
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Tikets extends Model {
  constructor(
    public id: number,
    public ticket_number: string,
    public konseli: {
      id: number;
      nim: string;
      phone: string;
      user: {
        id: number;
        name: string;
        email: string;
      };
      domicile: string;
      major: string;
      age: number;
      gender: 'L' | 'P';
    },
    public konselor: {
      id: number;
      is_active: boolean;
      user: {
        id: number;
        name: string;
        email: string;
      };
    },
    public hari_layanan: {
      id: number;
      day_name: string;
    },
    public desc: string,
    public status: 'pending' | 'approved' | 'rejected',
    public service_type: 'bimbingan' | 'konseling',
    public type: 'sosial' | 'pribadi' | 'akademik' | 'karir',
    public urgent: 'mendesak' | 'cukup_mendesak' | 'tidak_mendesak',
    public created_at: string,
    public updated_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Tikets> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Tikets>;
    return new Tikets(
      apiData.id,
      apiData.nomor_tiket,
      {
        id: apiData.konseli.id,
        nim: apiData.konseli.nim,
        phone: apiData.konseli.phone,
        user: {
          id: apiData.konseli.user.id,
          name: apiData.konseli.user.nama,
          email: apiData.konseli.user.email
        },
        domicile: apiData.konseli.domisili,
        major: apiData.konseli.jurusan,
        age: apiData.konseli.umur,
        gender: apiData.konseli.jenis_kelamin
      },
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
      apiData.deskripsi_keluhan,
      apiData.status,
      apiData.jenis_layanan,
      apiData.jenis_keluhan,
      apiData.urgensi,
      apiData.created_at,
      apiData.updated_at
    ) as ReturnType<T, IncomingApiData, Tikets>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(tikets: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(tikets)) return tikets.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      konseli_id: tikets.konseli_id,
      konselor_id: tikets.konselor_id,
      hari_layanan_id: tikets.hari_layanan_id,
      deskripsi_keluhan: tikets.desc,
      status: tikets.status,
      jenis_layanan: tikets.service_type,
      jenis_keluhan: tikets.type,
      urgensi: tikets.urgent
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.tiket = Tikets;
