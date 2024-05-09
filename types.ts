export interface IRow {
  timestamp: string;
  twentyfive: number;
  fifty: number;
  seventyfive: number;
  ninetyfive: number;
  ninetynine: number;
  ema50: number;
}

export interface IAverageRow {
  period: string;
  startTime: string;
  endTime: string;
  twentyfive: number;
  fifty: number;
  seventyfive: number;
  ninetyfive: number;
  ninetynine: number;
  ema50: number;
}
