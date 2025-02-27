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

  parseToDayjs(): Dayjs {
    if (!this.time) {
      return dayjs();
    }

    return dayjs()
      .set(HOUR, this.time.hour)
      .set(MINUTE, this.time.minute)
      .startOf(MINUTE);
  }
}
