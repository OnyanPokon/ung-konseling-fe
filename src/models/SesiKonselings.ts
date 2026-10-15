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
      domisili: string;
      jurusan: string;
      umur: number;
      jenis_kelamin: 'L' | 'P';
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
  tanggal_konseling: string;
  tempat: string;
  status: 'dijadwalkan' | 'selesai' | 'dijadwalkan_ulang' | 'dibatalkan';
  laporan: {
    id: number | null;
    status: 'draft' | 'final' | null;
    file_url: string | null;
  };
  laiseg: {
    id: number;
    q1_topik_sesuai: string | null;
    q2_pemahaman_baru: string | null;
    q3_merasa_lebih_baik: string | null;
    q4_rencana_tindakan: string | null;
    q5_berkaitan_masalah: string | null;
    q6_manfaat_layanan: string | null;
    q7_layanan_sudah_baik: string | null;
    catatan_lainnya: string | null;
  };
  created_at: string;
  updated_at: string;
}

export interface OutgoingApiData {
  tiket_id: number;
  konselor_id: number;
  hari_layanan_id: number;
  jam_mulai: string;
  jam_selesai: string;
  tanggal_konseling: string;
  tempat: string;
  status: 'dijadwalkan' | 'selesai' | 'dijadwalkan_ulang' | 'dibatalkan';
}

interface FormValue {
  tiket_id: number;
  konselor_id: number;
  hari_layanan_id: number;
  start_time: string;
  end_time: string;
  counseling_date: string;
  place: string;
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
        domicile: string;
        major: string;
        age: number;
        gender: 'L' | 'P';
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
    public counseling_date: string,
    public place: string,
    public status: 'dijadwalkan' | 'selesai' | 'dijadwalkan_ulang' | 'dibatalkan',
    public report: {
      id: number | null;
      status: 'draft' | 'final' | null;
      file_url: string | null;
    },
    public laiseg: {
      id: number;
      q1_topik_sesuai: string | null;
      q2_pemahaman_baru: string | null;
      q3_merasa_lebih_baik: string | null;
      q4_rencana_tindakan: string | null;
      q5_berkaitan_masalah: string | null;
      q6_manfaat_layanan: string | null;
      q7_layanan_sudah_baik: string | null;
      catatan_lainnya: string | null;
    },
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
          },
          domicile: apiData.tiket.konseli.domisili,
          major: apiData.tiket.konseli.jurusan,
          age: apiData.tiket.konseli.umur,
          gender: apiData.tiket.konseli.jenis_kelamin
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
      apiData.tanggal_konseling,
      apiData.tempat,
      apiData.status,
      {
        id: apiData.laporan.id,
        status: apiData.laporan.status,
        file_url: apiData.laporan.file_url
      },
      {
        id: apiData.laiseg.id,
        q1_topik_sesuai: apiData.laiseg.q1_topik_sesuai,
        q2_pemahaman_baru: apiData.laiseg.q2_pemahaman_baru,
        q3_merasa_lebih_baik: apiData.laiseg.q3_merasa_lebih_baik,
        q4_rencana_tindakan: apiData.laiseg.q4_rencana_tindakan,
        q5_berkaitan_masalah: apiData.laiseg.q5_berkaitan_masalah,
        q6_manfaat_layanan: apiData.laiseg.q6_manfaat_layanan,
        q7_layanan_sudah_baik: apiData.laiseg.q7_layanan_sudah_baik,
        catatan_lainnya: apiData.laiseg.catatan_lainnya,
      },
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
      tanggal_konseling: sesiKonselings.counseling_date,
      tempat: sesiKonselings.place,
      status: sesiKonselings.status
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.sesi_konseling = SesiKonselings;
