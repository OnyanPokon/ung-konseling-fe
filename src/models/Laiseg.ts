import Model from './Model';

export type LaisegAnswer = 'sangat_setuju' | 'setuju' | 'tidak_setuju' | 'sangat_tidak_setuju' | 'lainnya';

export interface IncomingApiData {
  id: number;
  q1_topik_sesuai: LaisegAnswer | null;
  q1_lainnya: string | null;
  q2_pemahaman_baru: LaisegAnswer | null;
  q2_lainnya: string | null;
  q3_merasa_lebih_baik: LaisegAnswer | null;
  q3_lainnya: string | null;
  q4_rencana_tindakan: LaisegAnswer | null;
  q4_lainnya: string | null;
  q5_berkaitan_masalah: LaisegAnswer | null;
  q5_lainnya: string | null;
  q6_manfaat_layanan: LaisegAnswer | null;
  q6_lainnya: string | null;
  q7_layanan_sudah_baik: LaisegAnswer | null;
  q7_lainnya: string | null;
  sesi_konseling: {
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
    tanggal_konseling: string;
    tempat: string;
    status: 'dijadwalkan' | 'selesai' | 'dijadwalkan_ulang' | 'dibatalkan';
  };
}

export interface OutgoingApiData {
  sesi_konseling_id: number;
  q1_topik_sesuai: LaisegAnswer;
  q1_lainnya: string | null;
  q2_pemahaman_baru: LaisegAnswer;
  q2_lainnya: string | null;
  q3_merasa_lebih_baik: LaisegAnswer;
  q3_lainnya: string | null;
  q4_rencana_tindakan: LaisegAnswer;
  q4_lainnya: string | null;
  q5_berkaitan_masalah: LaisegAnswer;
  q5_lainnya: string | null;
  q6_manfaat_layanan: LaisegAnswer;
  q6_lainnya: string | null;
  q7_layanan_sudah_baik: LaisegAnswer;
  q7_lainnya: string | null;
}

interface FormValue {
  sesi_konseling_id: number;
  q1_topik_sesuai: LaisegAnswer;
  q1_lainnya: string | null;
  q2_pemahaman_baru: LaisegAnswer;
  q2_lainnya: string | null;
  q3_merasa_lebih_baik: LaisegAnswer;
  q3_lainnya: string | null;
  q4_rencana_tindakan: LaisegAnswer;
  q4_lainnya: string | null;
  q5_berkaitan_masalah: LaisegAnswer;
  q5_lainnya: string | null;
  q6_manfaat_layanan: LaisegAnswer;
  q6_lainnya: string | null;
  q7_layanan_sudah_baik: LaisegAnswer;
  q7_lainnya: string | null;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Laiseg extends Model {
  constructor(
    public id: number,
    public q1_topik_sesuai: LaisegAnswer | null,
    public q1_lainnya: string | null,
    public q2_pemahaman_baru: LaisegAnswer | null,
    public q2_lainnya: string | null,
    public q3_merasa_lebih_baik: LaisegAnswer | null,
    public q3_lainnya: string | null,
    public q4_rencana_tindakan: LaisegAnswer | null,
    public q4_lainnya: string | null,
    public q5_berkaitan_masalah: LaisegAnswer | null,
    public q5_lainnya: string | null,
    public q6_manfaat_layanan: LaisegAnswer | null,
    public q6_lainnya: string | null,
    public q7_layanan_sudah_baik: LaisegAnswer | null,
    public q7_lainnya: string | null,
    public sesi_konseling: {
      id: number;
      tiket: {
        id: number;
        ticket_number: string;
        desc: string;
        status: 'pending' | 'approved' | 'rejected';
        service_type: 'guidance' | 'counseling';
        type: 'social' | 'personal' | 'academic' | 'career';
        urgent: 'urgent' | 'moderately_urgent' | 'not_urgent';
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
      };
      konselor: {
        id: number;
        is_active: boolean;
        user: {
          id: number;
          name: string;
          email: string;
        };
      };
      hari_layanan: {
        id: number;
        day_name: string;
      };
      start_time: string;
      end_time: string;
      counseling_date: string;
      place: string;
      status: 'scheduled' | 'completed' | 'rescheduled' | 'cancelled';
    }
  ) {
    super();
  }
  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Laiseg> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Laiseg>;
    return new Laiseg(
      apiData.id,
      apiData.q1_topik_sesuai,
      apiData.q1_lainnya,
      apiData.q2_pemahaman_baru,
      apiData.q2_lainnya,
      apiData.q3_merasa_lebih_baik,
      apiData.q3_lainnya,
      apiData.q4_rencana_tindakan,
      apiData.q4_lainnya,
      apiData.q5_berkaitan_masalah,
      apiData.q5_lainnya,
      apiData.q6_manfaat_layanan,
      apiData.q6_lainnya,
      apiData.q7_layanan_sudah_baik,
      apiData.q7_lainnya,
      {
        id: apiData.sesi_konseling.id,
        tiket: {
          id: apiData.sesi_konseling.tiket.id,
          ticket_number: apiData.sesi_konseling.tiket.nomor_tiket,
          desc: apiData.sesi_konseling.tiket.deskripsi_keluhan,
          status: apiData.sesi_konseling.tiket.status,
          service_type: apiData.sesi_konseling.tiket.jenis_layanan === 'bimbingan' ? 'guidance' : 'counseling',
          type: apiData.sesi_konseling.tiket.jenis_keluhan === 'pribadi' ? 'personal' : apiData.sesi_konseling.tiket.jenis_keluhan === 'sosial' ? 'social' : apiData.sesi_konseling.tiket.jenis_keluhan === 'akademik' ? 'academic' : 'career',
          urgent: apiData.sesi_konseling.tiket.urgensi === 'mendesak' ? 'urgent' : apiData.sesi_konseling.tiket.urgensi === 'cukup_mendesak' ? 'moderately_urgent' : 'not_urgent',

          created_at: apiData.sesi_konseling.tiket.created_at,
          konseli: {
            id: apiData.sesi_konseling.tiket.konseli.id,
            nim: apiData.sesi_konseling.tiket.konseli.nim,
            phone: apiData.sesi_konseling.tiket.konseli.phone,
            user: {
              id: apiData.sesi_konseling.tiket.konseli.user.id,
              name: apiData.sesi_konseling.tiket.konseli.user.nama,
              email: apiData.sesi_konseling.tiket.konseli.user.email
            }
          }
        },
        konselor: {
          id: apiData.sesi_konseling.konselor.id,
          is_active: apiData.sesi_konseling.konselor.is_active,
          user: {
            id: apiData.sesi_konseling.konselor.user.id,
            name: apiData.sesi_konseling.konselor.user.nama,
            email: apiData.sesi_konseling.konselor.user.email
          }
        },
        hari_layanan: {
          id: apiData.sesi_konseling.hari_layanan.id,
          day_name: apiData.sesi_konseling.hari_layanan.hari
        },
        start_time: apiData.sesi_konseling.jam_mulai,
        end_time: apiData.sesi_konseling.jam_selesai,
        counseling_date: apiData.sesi_konseling.tanggal_konseling,
        place: apiData.sesi_konseling.tempat,
        status: apiData.sesi_konseling.status === 'dijadwalkan' ? 'scheduled' : apiData.sesi_konseling.status === 'selesai' ? 'completed' : apiData.sesi_konseling.status === 'dijadwalkan_ulang' ? 'rescheduled' : 'cancelled'
      }
    ) as ReturnType<T, IncomingApiData, Laiseg>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(laiseg: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(laiseg)) return laiseg.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      sesi_konseling_id: laiseg.sesi_konseling_id,
      q1_topik_sesuai: laiseg.q1_topik_sesuai,
      q1_lainnya: laiseg.q1_topik_sesuai === 'lainnya' ? laiseg.q1_lainnya : null,
      q2_pemahaman_baru: laiseg.q2_pemahaman_baru,
      q2_lainnya: laiseg.q2_pemahaman_baru === 'lainnya' ? laiseg.q2_lainnya : null,
      q3_merasa_lebih_baik: laiseg.q3_merasa_lebih_baik,
      q3_lainnya: laiseg.q3_merasa_lebih_baik === 'lainnya' ? laiseg.q3_lainnya : null,
      q4_rencana_tindakan: laiseg.q4_rencana_tindakan,
      q4_lainnya: laiseg.q4_rencana_tindakan === 'lainnya' ? laiseg.q4_lainnya : null,
      q5_berkaitan_masalah: laiseg.q5_berkaitan_masalah,
      q5_lainnya: laiseg.q5_berkaitan_masalah === 'lainnya' ? laiseg.q5_lainnya : null,
      q6_manfaat_layanan: laiseg.q6_manfaat_layanan,
      q6_lainnya: laiseg.q6_manfaat_layanan === 'lainnya' ? laiseg.q6_lainnya : null,
      q7_layanan_sudah_baik: laiseg.q7_layanan_sudah_baik,
      q7_lainnya: laiseg.q7_layanan_sudah_baik === 'lainnya' ? laiseg.q7_lainnya : null,
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}
