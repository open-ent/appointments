import {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { GRID_TYPE } from "./enum";
import {
  AvailabilityProviderContextProps,
  AvailabilityProviderProps,
  GridList,
  GridPages,
  GridTypeLength,
} from "./types";
import { initialGrids, initialGridsLength, initialPages } from "./utils";
import { useGlobal } from "../GlobalProvider";
import { GRID_PER_PAGE } from "~/core/constants";
import { GRID_STATE } from "~/core/enums";
import { useGetMyGridsQuery } from "~/services/api/GridService";

const AvailabilityProviderContext =
  createContext<AvailabilityProviderContextProps | null>(null);

export const useAvailability = () => {
  const context = useContext(AvailabilityProviderContext);
  if (!context) {
    throw new Error(
      "useAvailability must be used within a AvailabilityProvider",
    );
  }
  return context;
};

export const AvailabilityProvider: FC<AvailabilityProviderProps> = ({
  children,
}) => {
  const { hasManageRight } = useGlobal();
  const [gridPages, setGridPages] = useState<GridPages>(initialPages);
  const [grids, setGrids] = useState<GridList>(initialGrids);
  const [gridsLength, setGridsLength] =
    useState<GridTypeLength>(initialGridsLength);

  const { data: myInProgressData, isLoading: isLoadingInProgress } =
    useGetMyGridsQuery(
      {
        states: [GRID_STATE.OPEN, GRID_STATE.SUSPENDED],
        page: gridPages[GRID_TYPE.IN_PROGRESS],
        limit: GRID_PER_PAGE,
      },
      { skip: !hasManageRight },
    );

  const { data: myClosedData, isLoading: isLoadingClosed } = useGetMyGridsQuery(
    {
      states: [GRID_STATE.CLOSED],
      page: gridPages[GRID_TYPE.CLOSED],
      limit: GRID_PER_PAGE,
    },
    { skip: !hasManageRight },
  );

  const handleChangePage = (gridType: GRID_TYPE, newPage: number) => {
    setGridPages({
      ...gridPages,
      [gridType]: newPage,
    });
  };

  useEffect(() => {
    const myInProgressGrids = myInProgressData?.grids;
    const myInProgressGridsLength = myInProgressData?.total;

    if (myInProgressGrids) {
      setGrids((prevGrids) => ({
        ...prevGrids,
        [GRID_TYPE.IN_PROGRESS]: myInProgressGrids,
      }));
    }

    if (myInProgressGridsLength) {
      setGridsLength((prevGridsLength) => ({
        ...prevGridsLength,
        [GRID_TYPE.IN_PROGRESS]: myInProgressGridsLength,
      }));
    }
  }, [myInProgressData]);

  useEffect(() => {
    const myClosedGrids = myClosedData?.grids;
    const myClosedGridsLength = myClosedData?.total;

    if (myClosedGrids) {
      setGrids((prevGrids) => ({
        ...prevGrids,
        [GRID_TYPE.CLOSED]: myClosedGrids,
      }));
    }

    if (myClosedGridsLength) {
      setGridsLength((prevGridsLength) => ({
        ...prevGridsLength,
        [GRID_TYPE.CLOSED]: myClosedGridsLength,
      }));
    }
  }, [myClosedData]);

  const isLoading = isLoadingInProgress || isLoadingClosed;

  const value = useMemo<AvailabilityProviderContextProps>(
    () => ({
      gridPages,
      gridTypeLengths: gridsLength,
      currentGridList: grids,
      isLoading,
      handleChangePage,
    }),
    [gridPages, gridsLength, grids, isLoadingInProgress, isLoadingClosed],
  );

  return (
    <AvailabilityProviderContext.Provider value={value}>
      {children}
    </AvailabilityProviderContext.Provider>
  );
};
