import Model from './Model';

export interface IncomingApiData {
  id: number;
  type: string;
  data: {
    title: string;
    message: string;
  };
  read_at: string | null;
  created_at: string;
  name: string;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Notification extends Model {
  constructor(
    public id: number,
    public type: string,
    public data: {
      title: string;
      message: string;
    },
    public read_at: string | null,
    public created_at: string,
    public name: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Notification> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Notification>;
    return new Notification(
      apiData.id,
      apiData.type,
      {
        title: apiData.data.title,
        message: apiData.data.message
      },
      apiData.read_at,
      apiData.created_at,
      apiData.name
    ) as ReturnType<T, IncomingApiData, Notification>;
  }
}
