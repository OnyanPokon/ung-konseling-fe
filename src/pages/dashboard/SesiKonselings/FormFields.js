import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = () => [
  {
    label: `Tempat ${Modul.SESI_KONSELINGS}`,
    name: 'place',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: `Jam berakhir ${Modul.SESI_KONSELINGS} harus diisi`
      }
    ]
  },
  {
    label: `Catatan konselor ${Modul.SESI_KONSELINGS}`,
    name: 'note',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: `Catatan konselor ${Modul.SESI_KONSELINGS} harus diisi`
      }
    ]
  }
];

export const timeFormFields = () => [
  {
    label: `Tanggal ${Modul.SESI_KONSELINGS}`,
    name: 'counseling_date',
    type: InputType.DATE,
    rules: [
      {
        required: true,
        message: `Tanggal ${Modul.SESI_KONSELINGS} harus diisi`
      }
    ]
  },
  {
    label: `Jam mulai ${Modul.SESI_KONSELINGS}`,
    name: 'start_time',
    type: InputType.TIME_PICKER,
    rules: [
      {
        required: true,
        message: `Jam mulai ${Modul.SESI_KONSELINGS} harus diisi`
      }
    ]
  },
  {
    label: `Jam berakhir ${Modul.SESI_KONSELINGS}`,
    name: 'end_time',
    type: InputType.TIME_PICKER,
    rules: [
      {
        required: true,
        message: `Jam berakhir ${Modul.SESI_KONSELINGS} harus diisi`
      }
    ]
  }
];

export const reportFormFields = () => [
  {
    label: `Jenis Layanan`,
    name: 'jenis_layanan',
    type: InputType.SELECT,
    rules: [
      {
        required: true,
        message: `Jenis layanan harus diisi`
      }
    ],
    options: [
      {
        label: 'Dasar',
        value: 'dasar'
      },
      {
        label: 'Responsif',
        value: 'responsif'
      },
      {
        label: 'Perencanaan Individual',
        value: 'perencanaan_individual'
      },
      {
        label: 'Dukungan Sistem',
        value: 'dukungan_sistem'
      }
    ]
  },
  {
    label: `Tujuan Kegiatan`,
    name: 'tujuan_kegiatan',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Tujuan kegiatan harus diisi`
      }
    ]
  },
  {
    label: `Uraian Kegiatan`,
    name: 'uraian_kegiatan',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: `Uraian kegiatan harus diisi`
      }
    ]
  },
  {
    label: `Hasil dan Dampak`,
    name: 'hasil_dampak',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: `Hasil dan dampak harus diisi`
      }
    ]
  },
  {
    label: `Rekomendasi`,
    name: 'rekomendasi',
    type: InputType.LONGTEXT,
    rules: [
      {
        required: true,
        message: `Rekomendasi harus diisi`
      }
    ]
  }
];
