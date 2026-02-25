import Model from './Model';

export interface IncomingApiData {
  id: number;
  tiket: {
    id: number;
    nomor_tiket: string;
    deskripsi_keluhan: string;
    status: 'pending' | 'approved' | 'rejected';
    jenis_layanan: 'bimbingan' | 'konseling';
    jenis_keluhan: 'sosial' | 'pribadi' | 'akademik' | 'karir';
    urgensi: 'mendesak' | 'cukup_mendesak' | 'tidak_mendesak';
    created_at: string;
    konseli: {
      id: number;
      nim: string;
      phone: string;
      user: {
        id: number;
        nama: string;
        email: string;
      };
    };
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
  jam_mulai: string;
  jam_selesai: string;
  tempat: string;
  catatan_konselor: number;
  status: 'dijadwalkan' | 'selesai' | 'dijadwalkan_ulang' | 'dibatalkan';
  created_at: string;
  updated_at: string;
}

export interface OutgoingApiData {
  tiket_id: number;
  konselor_id: number;
  hari_layanan_id: number;
  jam_mulai: string;
  jam_selesai: string;
  tempat: string;
  catatan_konselor: string;
  status: 'dijadwalkan' | 'selesai' | 'dijadwalkan_ulang' | 'dibatalkan';
}

interface FormValue {
  tiket_id: number;
  konselor_id: number;
  hari_layanan_id: number;
  start_time: string;
  end_time: string;
  place: string;
  note: string;
  status: 'dijadwalkan' | 'selesai' | 'dijadwalkan_ulang' | 'dibatalkan';
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class SesiKonselings extends Model {
  constructor(
    public id: number,
    public tiket: {
      id: number;
      ticket_number: string;
      desc: string;
      status: 'pending' | 'approved' | 'rejected';
      service_type: 'bimbingan' | 'konseling';
      type: 'sosial' | 'pribadi' | 'akademik' | 'karir';
      urgent: 'mendesak' | 'cukup_mendesak' | 'tidak_mendesak';
      created_at: string;
      konseli: {
        id: number;
        nim: string;
        phone: string;
        user: {
          id: number;
          name: string;
          email: string;
        };
      };
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
    public start_time: string,
    public end_time: string,
    public place: string,
    public note: number,
    public status: 'dijadwalkan' | 'selesai' | 'dijadwalkan_ulang' | 'dibatalkan',
    public created_at: string,
    public updated_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, SesiKonselings> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, SesiKonselings>;
    return new SesiKonselings(
      apiData.id,
      {
        id: apiData.tiket.id,
        ticket_number: apiData.tiket.nomor_tiket,
        desc: apiData.tiket.deskripsi_keluhan,
        status: apiData.tiket.status,
        service_type: apiData.tiket.jenis_layanan,
        type: apiData.tiket.jenis_keluhan,
        urgent: apiData.tiket.urgensi,
        created_at: apiData.tiket.created_at,
        konseli: {
          id: apiData.tiket.konseli.id,
          nim: apiData.tiket.konseli.nim,
          phone: apiData.tiket.konseli.phone,
          user: {
            id: apiData.tiket.konseli.user.id,
            name: apiData.tiket.konseli.user.nama,
            email: apiData.tiket.konseli.user.email
          }
        }
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
      apiData.jam_mulai,
      apiData.jam_selesai,
      apiData.tempat,
      apiData.catatan_konselor,
      apiData.status,
      apiData.created_at,
      apiData.updated_at
    ) as ReturnType<T, IncomingApiData, SesiKonselings>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(sesiKonselings: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(sesiKonselings)) return sesiKonselings.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      tiket_id: sesiKonselings.tiket_id,
      konselor_id: sesiKonselings.konselor_id,
      hari_layanan_id: sesiKonselings.hari_layanan_id,
      jam_mulai: sesiKonselings.start_time,
      jam_selesai: sesiKonselings.end_time,
      tempat: sesiKonselings.place,
      catatan_konselor: sesiKonselings.note,
      status: sesiKonselings.status
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.sesi_konseling = SesiKonselings;
