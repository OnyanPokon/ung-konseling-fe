import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const formFields = () => [
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
