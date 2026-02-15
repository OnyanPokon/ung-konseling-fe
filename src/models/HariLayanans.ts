import Model from './Model';

export interface IncomingApiData {
  id: number;
  hari: string;
  created_at: string;
  updated_at: string;
}

export interface OutgoingApiData {
  hari: string;
}

interface FormValue {
  day_name: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class HariLayanans extends Model {
  constructor(
    public id: number,
    public day_name: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, HariLayanans> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, HariLayanans>;
    return new HariLayanans(apiData.id, apiData.hari) as ReturnType<T, IncomingApiData, HariLayanans>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(hariLayanans: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(hariLayanans)) return hariLayanans.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;
    const apiData: OutgoingApiData = {
      hari: hariLayanans.day_name
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.hari_layanan = HariLayanans;
