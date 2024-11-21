import { FC } from "react";

import { CustomSVGProps } from "./types";

export const NoAvatar: FC<CustomSVGProps> = ({ fill }) => (
  <svg
    version="1.1"
    id="Calque_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 625 625"
    xmlSpace="preserve"
  >
    <title>no-avatar</title>
    <g id="no-avatar">
      <path
        fill={fill ? fill : "#0C3848"}
        d="M312.5,416.9c85.5,0,256.5,42,256.5,127.5v80.5H56v-80.5C56,458.9,227,416.9,312.5,416.9z M312.5,352.4
        c-70.4,0.1-127.4-56.9-127.5-127.3c0-0.1,0-0.1,0-0.2c0-70.5,57-129,127.5-129S440,154.4,440,224.9
        c0.1,70.4-56.9,127.4-127.3,127.5C312.6,352.4,312.6,352.4,312.5,352.4z"
      />
    </g>
  </svg>
);
