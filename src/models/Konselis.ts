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
  domisili: string;
  jurusan: string;
  umur: number;
  jenis_kelamin: 'L' | 'P';
}

export interface OutgoingApiData {
  nama: string;
  email: string;
  password: string;
  nim: string;
  phone: string;
  domisili: string;
  jurusan: string;
  umur: number;
  jenis_kelamin: 'L' | 'P';
}

interface FormValue {
  name: string;
  email: string;
  password: string;
  nim: string;
  phone: string;
  domicile: string;
  major: string;
  age: number;
  gender: 'L' | 'P';
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
    },
    public domicile: string,
    public major: string,
    public age: number,
    public gender: 'L' | 'P'
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Konselis> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Konselis>;
    return new Konselis(
      apiData.id,
      apiData.phone,
      apiData.nim,
      {
        id: apiData.user.id,
        name: apiData.user.nama,
        email: apiData.user.email
      },
      apiData.domisili,
      apiData.jurusan,
      apiData.umur,
      apiData.jenis_kelamin
    ) as ReturnType<T, IncomingApiData, Konselis>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(konselis: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(konselis)) return konselis.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      nama: konselis.name,
      email: konselis.email,
      password: konselis.password,
      nim: konselis.nim,
      phone: konselis.phone,
      domisili: konselis.domicile,
      jurusan: konselis.major,
      umur: konselis.age,
      jenis_kelamin: konselis.gender
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.konseli = Konselis;
