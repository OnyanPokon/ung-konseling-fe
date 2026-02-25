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
    ],
    size: 'large'
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
    ],
    size: 'large'
  },
  {
    label: `NIM ${Modul.KONSELIS}`,
    name: 'nim',
    type: InputType.TEXT,
    rules: [
      { required: true, message: 'NIM wajib diisi' },
      { pattern: /^[0-9]{9}$/, message: 'NIM harus 9 digit angka' }
    ],
    size: 'large'
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
    ],
    size: 'large'
  }
];

export const additionalDataFormFields = () => [
  {
    label: `Domisili ${Modul.KONSELIS}`,
    name: 'domicile',
    type: InputType.TEXT,
    rules: [
      { required: true, message: `Domisili ${Modul.KONSELIS} harus diisi` },
      { min: 3, message: 'Domisili minimal 3 karakter' },
      { max: 100, message: 'Domisili maksimal 100 karakter' },
      {
        validator: (_, value) => {
          if (!value || value.trim() !== '') {
            return Promise.resolve();
          }
          return Promise.reject(new Error('Domisili tidak boleh kosong'));
        }
      }
    ],
    size: 'large'
  },

  {
    label: `Jurusan/Unit Kerja ${Modul.KONSELIS}`,
    name: 'major',
    type: InputType.TEXT,
    rules: [
      { required: true, message: `Jurusan ${Modul.KONSELIS} harus diisi` },
      { min: 2, message: 'Minimal 2 karakter' },
      { max: 100, message: 'Maksimal 100 karakter' },
      {
        pattern: /^[A-Za-z\s.,-]+$/,
        message: 'Jurusan hanya boleh huruf dan spasi'
      }
    ],
    size: 'large'
  },

  {
    label: `Umur ${Modul.KONSELIS}`,
    name: 'age',
    type: InputType.NUMBER,
    rules: [
      { required: true, message: `Umur ${Modul.KONSELIS} harus diisi` },
      {
        type: 'number',
        min: 19,
        max: 50,
        message: 'Umur harus antara 19 - 50 tahun'
      }
    ],
    size: 'large',
    extra: {
      className: 'w-full'
    }
  },

  {
    label: `Jenis Kelamin ${Modul.KONSELIS}`,
    name: 'gender',
    type: InputType.SELECT,
    rules: [
      { required: true, message: `Jenis Kelamin ${Modul.KONSELIS} harus diisi` },
      {
        enum: ['Laki-laki', 'Perempuan'],
        message: 'Jenis Kelamin tidak valid'
      }
    ],
    size: 'large',
    options: [
      { label: 'Laki-laki', value: 'L' },
      { label: 'Perempuan', value: 'P' }
    ]
  }
];
