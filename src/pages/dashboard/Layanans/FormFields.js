import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const HariLayananFormFields = () => [
  {
    label: `Nama ${Modul.HARI_LAYANAN}`,
    name: 'day_name',
    type: InputType.SELECT,
    options: [
      { label: 'Senin', value: 'senin' },
      { label: 'Selasa', value: 'selasa' },
      { label: 'Rabu', value: 'rabu' },
      { label: 'Kamis', value: 'kamis' },
      { label: 'Jumat', value: 'jumat' },
      { label: 'Sabtu', value: 'sabtu' },
      { label: 'Minggu', value: 'minggu' }
    ],
    rules: [{ required: true, message: 'Nama hari wajib dipilih' }]
  }
];

export const JadwalKonselorFormFields = ({ options }) => [
  {
    label: `Pilih ${Modul.KONSELOR}`,
    name: 'konselor_id',
    type: InputType.SELECT,
    options: options.konselors.map((konselor) => ({ label: konselor.user.name, value: konselor.id })),
    rules: [{ required: true, message: 'Konselor wajib dipilih' }]
  },
  {
    label: `Pilih ${Modul.HARI_LAYANAN}`,
    name: 'hari_layanan_id',
    type: InputType.SELECT,
    options: options.hariLayanans.map((hariLayanan) => ({ label: hariLayanan.day_name, value: hariLayanan.id })),
    rules: [{ required: true, message: 'Hari layanan wajib dipilih' }]
  }
];
