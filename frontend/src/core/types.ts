import { DAY } from "./enums";
import { Time } from "./models/Time";

export interface Slot {
  id: number;
  begin: Time;
  end: Time;
}

export type WeekSlotsModel = Record<DAY, Slot[]>;
