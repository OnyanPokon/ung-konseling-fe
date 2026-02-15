import Model from './Model';

export interface IncomingApiData {
  id: number;
  phone: string;
  nim: string;
  user: {
    id: number;
    nama: string;
    email: string;
  };
}

export interface OutgoingApiData {
  nama: string;
  email: string;
  password: string;
  nim: string;
  phone: string;
}

interface FormValue {
  name: string;
  email: string;
  password: string;
  nim: string;
  phone: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Konselis extends Model {
  constructor(
    public id: number,
    public phone: string,
    public nim: string,
    public user: {
      id: number;
      name: string;
      email: string;
    }
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Konselis> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Konselis>;
    return new Konselis(apiData.id, apiData.phone, apiData.nim, {
      id: apiData.user.id,
      name: apiData.user.nama,
      email: apiData.user.email
    }) as ReturnType<T, IncomingApiData, Konselis>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(konselis: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(konselis)) return konselis.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      nama: konselis.name,
      email: konselis.email,
      password: konselis.password,
      nim: konselis.nim,
      phone: konselis.phone
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.konseli = Konselis;
