import { UserCardInfos } from "~/services/api/CommunicationService/types";

export interface UserCardProps {
  infos: UserCardInfos;
}

export interface WrapperUserCardProps {
  isAvailable: boolean;
}

export interface StatusColorProps {
  isAvailable: boolean;
}
