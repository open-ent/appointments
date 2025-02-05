import { FC, useEffect, useMemo, useRef, useState } from "react";

import { Loader } from "@cgi-learning-hub/ui";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { DialogModal } from "~/components/DialogModal";
import { AvailabilityEmptyState } from "~/components/SVG/AvailabilityEmptyState";
import { useAvailability } from "~/providers/AvailabilityProvider";
import {
  GRID_CARD_SIZE,
  GRID_TYPE,
} from "~/providers/AvailabilityProvider/enum";
import { useGridModal } from "~/providers/GridModalProvider";
import { GRID_MODAL_TYPE } from "~/providers/GridModalProvider/enum";
import { PURPLE } from "~/styles/color.constants";
import { GridList } from "../GridList";
import { GridModal } from "../GridModal";
import {
  availabilityContainerStyle,
  emptyStateStyle,
  emptyStateSvgStyle,
  headerStyle,
} from "./style";
import { APPOINTMENTS } from "~/core/constants";

export const MyAvailability: FC = () => {
  const { t } = useTranslation(APPOINTMENTS);

  const [gridCardSize, setGridCardSize] = useState<GRID_CARD_SIZE>(
    GRID_CARD_SIZE.LARGE,
  );

  const { gridTypeLengths, isLoading, dialogModalProps } = useAvailability();
  const { handleDisplayGridModal } = useGridModal();

  const isAllGridListEmpty = useMemo(
    () =>
      !gridTypeLengths[GRID_TYPE.IN_PROGRESS] &&
      !gridTypeLengths[GRID_TYPE.CLOSED],
    [gridTypeLengths],
  );

  const boxRef = useRef<HTMLDivElement | null>(null);

  const sizeWidth = 882;

  useEffect(() => {
    const updateGridCardSize = () => {
      if (boxRef.current) {
        const boxWidth = boxRef.current.offsetWidth;
        setGridCardSize(
          boxWidth < sizeWidth ? GRID_CARD_SIZE.SMALL : GRID_CARD_SIZE.LARGE,
        );
      }
    };
    const observer = new ResizeObserver(updateGridCardSize);
    if (boxRef.current) {
      observer.observe(boxRef.current);
    }
    updateGridCardSize();
    return () => {
      if (boxRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(boxRef.current);
      }
    };
  }, []);

  return (
    <>
      <DialogModal {...dialogModalProps} />
      <GridModal />
      <Box ref={boxRef} sx={availabilityContainerStyle}>
        <Box sx={headerStyle}>
          <Typography variant="h2">
            {t("appointments.my.availability")}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={() => handleDisplayGridModal(GRID_MODAL_TYPE.CREATION)}
          >
            {t("appointments.create.grid")}
          </Button>
        </Box>
        {isLoading ? (
          <Loader />
        ) : isAllGridListEmpty ? (
          <>
            <Typography sx={emptyStateStyle}>
              {t("appointments.grid.empty.state")}
            </Typography>
            <Box sx={emptyStateSvgStyle}>
              <AvailabilityEmptyState fill={PURPLE} />
            </Box>
          </>
        ) : (
          <>
            <GridList
              gridType={GRID_TYPE.IN_PROGRESS}
              cardSize={gridCardSize}
            />
            <GridList gridType={GRID_TYPE.CLOSED} cardSize={gridCardSize} />
          </>
        )}
      </Box>
    </>
  );
};
