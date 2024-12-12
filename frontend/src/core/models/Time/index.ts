import dayjs, { Dayjs } from "dayjs";

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
      return dayjs().locale("fr");
    }

    return dayjs()
      .locale("fr")
      .set("hour", this.time.hour)
      .set("minute", this.time.minute)
      .startOf("minute");
  }
}
