import { InputType } from '@/constants';

export const ScreeningFormFields = () => [
  {
    label: `Judul Screening`,
    name: 'title',
    type: InputType.TEXT,
    rules: [
      { required: true, message: 'Judul Screening wajib diisi' },
      { max: 255, message: 'Judul maksimal 255 karakter' }
    ]
  },
  {
    label: `Deskripsi`,
    name: 'description',
    type: InputType.LONGTEXT,
    rules: [{ required: true, message: 'Deskripsi wajib diisi' }]
  },
  {
    label: `Status Publish`,
    name: 'is_published',
    type: InputType.SELECT,
    options: [
      {
        label: 'Publish',
        value: true
      },
      {
        label: 'Draft',
        value: false
      }
    ],
    rules: [{ required: true, message: 'Status Publish wajib diisi' }]
  }
];
