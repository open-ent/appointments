import { FC, useState } from "react";

import BusinessIcon from "@mui/icons-material/Business";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import {
  buttonsBoxStyle,
  cardWrapperStyle,
  ColorDot,
  firstLineBoxStyle,
  leftBoxStyle,
  leftTextWrapperStyle,
  moreButtonBoxStyle,
  moreButtonStyle,
  nameTextStyle,
  secondLineBoxStyle,
  StateDot,
  stateStyle,
  structureIconStyle,
} from "./style";
import { GridCardProps } from "./types";
import { GRID_STATE } from "~/core/enums";
import { formatDayjsToString } from "~/core/utils/date.utils";
import { GRID_CARD_SIZE } from "~/providers/AvailabilityProvider/enum";
import { useGlobal } from "~/providers/GlobalProvider";

export const GridCard: FC<GridCardProps> = ({ grid, size }) => {
  const { t } = useTranslation("appointments");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isMultiStructure, getStructureNameById } = useGlobal();

  const handleClickedMoreButton = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={cardWrapperStyle}>
      <Box sx={leftBoxStyle}>
        <ColorDot color={grid.color} />
        <Box sx={leftTextWrapperStyle}>
          <Box sx={firstLineBoxStyle}>
            <Typography variant="h5" sx={nameTextStyle}>
              {grid.name}
            </Typography>
            {isMultiStructure && (
              <Tooltip
                title={getStructureNameById(grid.structureId)}
                placement="top"
                arrow
              >
                <BusinessIcon sx={structureIconStyle} />
              </Tooltip>
            )}
          </Box>
          <Box sx={secondLineBoxStyle}>
            <Typography variant="body1">
              {t("appointments.grid.from.date.to.date", {
                beginDate: formatDayjsToString(grid.beginDate),
                endDate: formatDayjsToString(grid.endDate),
              })}
            </Typography>
            <Box sx={stateStyle}>
              <StateDot state={grid.state} />
              <Typography variant="body1">
                {t(`appointments.grid.state.${grid.state.toLowerCase()}`)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      {size === GRID_CARD_SIZE.LARGE ? (
        !(grid.state === GRID_STATE.CLOSED) ? (
          <Box sx={buttonsBoxStyle}>
            <Button variant="outlined" startIcon={<EditIcon />}>
              {t("appointments.edit")}
            </Button>
            {grid.state === GRID_STATE.OPEN ? (
              <Button variant="outlined" startIcon={<PauseRoundedIcon />}>
                {t("appointments.suspend")}
              </Button>
            ) : (
              <Button variant="outlined" startIcon={<PlayArrowRoundedIcon />}>
                {t("appointments.resume")}
              </Button>
            )}
            <Button variant="outlined" startIcon={<DeleteRoundedIcon />}>
              {t("appointments.delete")}
            </Button>
          </Box>
        ) : (
          <Button variant="outlined" startIcon={<VisibilityRoundedIcon />}>
            {t("appointments.consult")}
          </Button>
        )
      ) : (
        <Box sx={moreButtonBoxStyle}>
          <IconButton sx={moreButtonStyle} onClick={handleClickedMoreButton}>
            <MoreVertRoundedIcon />
          </IconButton>
          <Menu
            open={!!anchorEl}
            onClose={handleCloseMenu}
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {grid.state === GRID_STATE.CLOSED ? (
              <MenuItem>
                <VisibilityRoundedIcon />
                {t("appointments.consult")}
              </MenuItem>
            ) : (
              <>
                <MenuItem>
                  <EditIcon />
                  {t("appointments.edit")}
                </MenuItem>
                <MenuItem>
                  {grid.state === GRID_STATE.OPEN ? (
                    <PauseRoundedIcon />
                  ) : (
                    <PlayArrowRoundedIcon />
                  )}
                  {grid.state === GRID_STATE.OPEN
                    ? t("appointments.suspend")
                    : t("appointments.resume")}
                </MenuItem>
                <MenuItem>
                  <DeleteRoundedIcon />
                  {t("appointments.delete")}
                </MenuItem>
              </>
            )}
          </Menu>
        </Box>
      )}
    </Box>
  );
};
