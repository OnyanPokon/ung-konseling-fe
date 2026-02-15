import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = () => [
  {
    label: `Nama ${Modul.KONSELIS}`,
    name: 'name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.KONSELIS} harus diisi`
      }
    ]
  },
  {
    label: `Email ${Modul.KONSELIS}`,
    name: 'email',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.KONSELIS} harus diisi`
      },
      {
        type: 'email',
        message: 'Format email tidak valid'
      }
    ]
  },
  {
    label: `NIM ${Modul.KONSELIS}`,
    name: 'nim',
    type: InputType.TEXT,
    rules: [
      { required: true, message: 'NIM wajib diisi' },
      { pattern: /^[0-9]{9}$/, message: 'NIM harus 9 digit angka' }
    ]
  },
  {
    label: 'Nomor Telepon',
    name: 'phone',
    type: InputType.TEXT,
    rules: [
      { required: true, message: 'Nomor telepon wajib diisi' },
      {
        pattern: /^(08|628)[0-9]{8,11}$/,
        message: 'Nomor telepon tidak valid (contoh: 081234567890)'
      }
    ]
  }
];
