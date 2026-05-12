import Model from './Model';

export interface IncomingApiData {
  id: number;
  topik_pembahasan: string;
  pemahaman_baru: string;
  perasaan_setelah_layanan: string;
  rencana_setelah_layanan: string;
  apakah_terkait_masalah: string;
  keuntungan_jika_ya: string;
  keuntungan_jika_tidak: string;
  saran_pesan: string;
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
  topik_pembahasan: string;
  pemahaman_baru: string;
  perasaan_setelah_layanan: string;
  rencana_setelah_layanan: string;
  apakah_terkait_masalah: boolean;
  keuntungan_jika_ya: string;
  keuntungan_jika_tidak: string;
  saran_pesan: string;
}

interface FormValue {
  sesi_konseling_id: number;
  discussion_topic: string;
  new_understanding: string;
  feelings_after_service: string;
  plan_after_service: string;
  related_to_problem: boolean;
  benefits_if_yes: string;
  benefits_if_no: string;
  suggestion_and_messages: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Laiseg extends Model {
  constructor(
    public id: number,
    public discussion_topic: string,
    public new_understanding: string,
    public feelings_after_service: string,
    public plan_after_service: string,
    public related_to_problem: string,
    public benefits_if_yes: string,
    public benefits_if_no: string,
    public suggestions_and_messages: string,
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
      apiData.topik_pembahasan,
      apiData.pemahaman_baru,
      apiData.perasaan_setelah_layanan,
      apiData.rencana_setelah_layanan,
      apiData.apakah_terkait_masalah,
      apiData.keuntungan_jika_ya,
      apiData.keuntungan_jika_tidak,
      apiData.saran_pesan,
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
      topik_pembahasan: laiseg.discussion_topic,
      pemahaman_baru: laiseg.new_understanding,
      perasaan_setelah_layanan: laiseg.feelings_after_service,
      rencana_setelah_layanan: laiseg.plan_after_service,
      apakah_terkait_masalah: laiseg.related_to_problem,
      keuntungan_jika_ya: laiseg.benefits_if_yes,
      keuntungan_jika_tidak: laiseg.benefits_if_no,
      saran_pesan: laiseg.suggestion_and_messages
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}
