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
  },
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
  }
];

export const timeFormFields = () => [
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
