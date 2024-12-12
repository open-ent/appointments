import { Dayjs } from "dayjs";

export interface TimeObject {
  hour: number;
  minute: number;
}

export interface ITime {
  time: TimeObject | null;
  parseToString(): string;
  parseToDayjs(): Dayjs;
}
