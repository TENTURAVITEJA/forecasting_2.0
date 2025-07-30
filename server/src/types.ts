
export type Frequency = 'D' | 'W' | 'M';

export interface Row {
  date: Date;
  value: number;
}

export interface ForecastRequest {
  dateCol: string;
  valueCol: string;
  frequency: Frequency;
  horizon: number;
}
