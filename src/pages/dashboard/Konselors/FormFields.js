import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = () => [
  {
    label: `NIP ${Modul.KONSELOR}`,
    name: 'nip',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `NIP ${Modul.KONSELOR} harus diisi`
      }
    ]
  },
  {
    label: `Nama ${Modul.KONSELOR}`,
    name: 'name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.KONSELOR} harus diisi`
      }
    ]
  },
  {
    label: `Jenis Kelamin ${Modul.KONSELOR}`,
    name: 'gender',
    type: InputType.SELECT,
    options: [
      { label: 'Laki-laki', value: 'L' },
      { label: 'Perempuan', value: 'P' }
    ],
    rules: [
      {
        required: true,
        message: `Nama ${Modul.KONSELOR} harus diisi`
      }
    ]
  },
  {
    label: `Kontak ${Modul.KONSELOR}`,
    name: 'phone',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Kontak ${Modul.KONSELOR} harus diisi`
      },
      {
        pattern: /^(?:\+62|08)[0-9]{8,13}$/,
        message: 'Gunakan format nomor Indonesia yang valid (08xxxx atau +62xxxx)'
      }
    ]
  },
  {
    label: `Foto Profil ${Modul.KONSELOR}`,
    name: 'profile_picture',
    type: InputType.UPLOAD,
    max: 1,
    beforeUpload: () => {
      return false;
    },
    getFileList: (data) => {
      return [
        {
          url: data?.profile_picture,
          name: data?.name
        }
      ];
    },
    accept: ['.jpg', '.jpeg', '.png', '.webp'],
    rules: [
      {
        required: true,
        message: `Foto Profil ${Modul.KONSELOR} harus diisi`
      }
    ]
  },
  {
    label: `Email ${Modul.KONSELOR}`,
    name: 'email',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama ${Modul.KONSELOR} harus diisi`
      },
      {
        type: 'email',
        message: 'Format email tidak valid'
      }
    ]
  },

  {
    label: `Status ${Modul.KONSELOR}`,
    name: 'is_active',
    type: InputType.SELECT,
    options: [
      { label: 'Aktif', value: true },
      { label: 'Non Aktif', value: false }
    ],
    rules: [{ required: true, message: 'Status wajib dipilih' }]
  }
];
