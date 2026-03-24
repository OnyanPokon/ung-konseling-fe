import Model from './Model';

export interface IncomingApiData {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface OutgoingApiData {
  name: string;
  start_date: string;
  end_date: string;
}

interface FormValue {
  name: string;
  start_date: string | any; // allow any for moment/dayjs objects if antd uses them
  end_date: string | any;
}

type ReturnType<S, From, To> = S extends From[] ? To[] : To;

export default class Periods extends Model {
  constructor(
    public id: number,
    public name: string,
    public start_date: string,
    public end_date: string,
    public created_at: string,
    public updated_at: string
  ) {
    super();
  }

  public static fromApiData<T extends IncomingApiData | IncomingApiData[]>(apiData: T): ReturnType<T, IncomingApiData, Periods> {
    if (Array.isArray(apiData)) return apiData.map((object) => this.fromApiData(object)) as ReturnType<T, IncomingApiData, Periods>;
    return new Periods(apiData.id, apiData.name, apiData.start_date, apiData.end_date, apiData.created_at, apiData.updated_at) as ReturnType<T, IncomingApiData, Periods>;
  }

  public static toApiData<T extends FormValue | FormValue[]>(periods: T): ReturnType<T, FormValue, OutgoingApiData> {
    if (Array.isArray(periods)) return periods.map((object) => this.toApiData(object)) as ReturnType<T, FormValue, OutgoingApiData>;

    // Ant Design DatePicker returns dayjs/moment objects, so we need to format them if they exist
    const formatIfDate = (dateVal: any) => {
      if (!dateVal) return dateVal;
      if (typeof dateVal === 'string') return dateVal;
      if (typeof dateVal.format === 'function') return dateVal.format('YYYY-MM-DD');
      return dateVal;
    };

    const apiData: OutgoingApiData = {
      name: periods.name,
      start_date: formatIfDate(periods.start_date),
      end_date: formatIfDate(periods.end_date)
    };

    return apiData as ReturnType<T, FormValue, OutgoingApiData>;
  }
}

Model.children.periode = Periods;
