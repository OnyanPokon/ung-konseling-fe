import { InputType } from '@/constants';

export const formFields = () => [
  {
    label: `Nama Periode`,
    name: 'name',
    type: InputType.TEXT,
    rules: [
      {
        required: true,
        message: `Nama Periode harus diisi`
      }
    ]
  },
  {
    label: `Tanggal Mulai`,
    name: 'start_date',
    type: InputType.DATE,
    rules: [
      {
        required: true,
        message: `Tanggal Mulai harus diisi`
      }
    ]
  },
  {
    label: `Tanggal Selesai`,
    name: 'end_date',
    type: InputType.DATE,
    rules: [
      {
        required: true,
        message: `Tanggal Selesai harus diisi`
      }
    ]
  }
];
