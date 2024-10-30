import { DAY } from "./enums";

export interface TimeObject {
  hour: number;
  minute: number;
}

export type Time = TimeObject | null;

export interface Slot {
  id: string;
  begin: Time;
  end: Time;
}

export type WeekSlotsModel = {
  [key in DAY]: Slot[];
};
