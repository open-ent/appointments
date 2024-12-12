import dayjs from "dayjs";

import { MyGrids, MyGridsResponse } from "./types";

export const transformResponseToMyGridsResponse = (
  response: MyGridsResponse,
): MyGrids => {
  const myGrids: MyGrids = {
    total: response.total,
    grids: response.minimalCreatorGrids.map((grid) => ({
      ...grid,
      beginDate: dayjs(grid.begin_date),
      endDate: dayjs(grid.end_date),
    })),
  };
  return myGrids;
};
