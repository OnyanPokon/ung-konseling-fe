import { InputType } from '@/constants';
import Modul from '@/constants/Modul';

export const AssessmentFormFields = ({ options }) => [
  {
    label: `Pilih ${Modul.PERIOD}`,
    name: 'period_id',
    type: InputType.SELECT,
    options: options.periods.map((period) => ({ label: period.name, value: period.id })),
    rules: [{ required: true, message: 'Periode wajib dipilih' }]
  },
  {
    label: `Judul Assessment`,
    name: 'title',
    type: InputType.TEXT,
    rules: [
      { required: true, message: 'Judul Assessment wajib diisi' },
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
