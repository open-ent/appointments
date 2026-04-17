import dayjs, { Dayjs } from "dayjs";

import { HOUR, MINUTE } from "~/core/dayjs.const";
import { ITime, TimeObject } from "./types";

export class Time implements ITime {
  time: TimeObject | null;

  constructor(time: TimeObject | null) {
    this.time = time;
  }

  parseToString(): string {
    if (!this.time) {
      return "--:--";
    }

    const hour = this.time.hour.toString().padStart(2, "0");
    const minute = this.time.minute.toString().padStart(2, "0");

    return `${hour}:${minute}`;
  }

  parseToDisplayText(): string {
    if (!this.time) {
      return "--h --min";
    }

    const hour = this.time.hour.toString();
    const minute = this.time.minute.toString().padStart(2, "0");

    return `${hour}h${minute}min`;
  }

  parseToDayjs(): Dayjs {
    if (!this.time) return dayjs();

    return dayjs()
      .set(HOUR, this.time.hour)
      .set(MINUTE, this.time.minute)
      .startOf(MINUTE);
  }

  parseToDayjsOrDefault(defaultValue: Dayjs | null): Dayjs | null {
    if (!this.time) return defaultValue;

    return dayjs()
      .set(HOUR, this.time.hour)
      .set(MINUTE, this.time.minute)
      .startOf(MINUTE);
  }

  getNbMinutesFromMidnight(): number {
    if (!this.time) return 0;
    return this.time.hour * 60 + this.time.minute;
  }
}
