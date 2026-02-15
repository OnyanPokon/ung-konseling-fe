import api from '@/utils/api';
import Model from './Model';

export interface IncomingApiData {
  id: number;
  user: {
    id: number;
    nama: string;
    email: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OutgoingApiData {
  nama: string;
  email: string;
  password: string;
  is_active: boolean;
}

interface FormValue {
  name: string;
  email: string;
  password: string;
  is_active: boolean;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Konselors extends Model {
  constructor(
    public id: number,
    public user: {
      id: number;
      name: string;
      email: string;
    },
    public is_active: boolean,
    public created_at: string,
    public updated_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Konselors> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Konselors>;
    return new Konselors(apiData.id, { id: apiData.user.id, name: apiData.user.nama, email: apiData.user.email }, apiData.is_active, apiData.created_at, apiData.updated_at) as ReturnType<T, IncomingApiData, Konselors>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(konselors: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(konselors)) return konselors.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      nama: konselors.name,
      email: konselors.email,
      password: konselors.password,
      is_active: konselors.is_active
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.konselor = Konselors;
