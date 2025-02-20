import { FC, useEffect, useState } from "react";

import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@cgi-learning-hub/ui";
import BusinessIcon from "@mui/icons-material/Business";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { useTranslation } from "react-i18next";

import { APPOINTMENTS, DISPLAY_DATE_FORMAT } from "~/core/constants";
import { CONFIRM_MODAL_TYPE, GRID_STATE } from "~/core/enums";
import { useAvailability } from "~/providers/AvailabilityProvider";
import { GRID_CARD_SIZE } from "~/providers/AvailabilityProvider/enum";
import { useGlobal } from "~/providers/GlobalProvider";
import { GRID_MODAL_TYPE } from "~/providers/GridModalProvider/enum";
import {
  buttonsBoxStyle,
  cardWrapperStyle,
  ColorDot,
  firstLineBoxStyle,
  leftBoxStyle,
  leftTextWrapperStyle,
  moreButtonBoxStyle,
  moreButtonStyle,
  secondLineBoxStyle,
  StateDot,
  stateStyle,
  structureIconStyle,
} from "./style";
import { GridCardProps } from "./types";

export const GridCard: FC<GridCardProps> = ({ grid, size }) => {
  const { t } = useTranslation(APPOINTMENTS);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isMultiStructure, getStructureNameById } = useGlobal();
  const { handleOpenDialogModal, handleOpenGridModal } = useAvailability();

  const handleClickedMoreButton = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenConfirmModal = (type: CONFIRM_MODAL_TYPE) => {
    handleOpenDialogModal(grid.id, type);
    handleCloseMenu();
  };

  const handleOpenEditModal = () => {
    handleOpenGridModal(GRID_MODAL_TYPE.EDIT, grid.id);
    handleCloseMenu();
  };

  const handleOpenConsultModal = () => {
    handleOpenGridModal(GRID_MODAL_TYPE.CONSULTATION, grid.id);
    handleCloseMenu();
  };

  useEffect(() => {
    if (size === GRID_CARD_SIZE.LARGE) handleCloseMenu();
  }, [size]);

  return (
    <Box sx={cardWrapperStyle}>
      <Box sx={leftBoxStyle}>
        <ColorDot color={grid.color} />
        <Box sx={leftTextWrapperStyle}>
          <Box sx={firstLineBoxStyle}>
            <Typography
              variant="body1"
              overflow="hidden"
              textOverflow="ellipsis"
              noWrap
              fontSize="1.6rem"
              color="text.primary"
            >
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
            <Typography
              variant="body2"
              fontSize="1.4rem"
              color="text.secondary"
            >
              {t("appointments.grid.from.date.to.date", {
                beginDate: grid.beginDate.format(DISPLAY_DATE_FORMAT),
                endDate: grid.endDate.format(DISPLAY_DATE_FORMAT),
              })}
            </Typography>
            <Box sx={stateStyle}>
              <StateDot state={grid.state} />
              <Typography
                variant="body2"
                fontSize="1.4rem"
                color="text.secondary"
              >
                {t(`appointments.grid.state.${grid.state.toLowerCase()}`)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      {size === GRID_CARD_SIZE.LARGE ? (
        !(grid.state === GRID_STATE.CLOSED) ? (
          <Box sx={buttonsBoxStyle}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => handleOpenGridModal(GRID_MODAL_TYPE.EDIT, grid.id)}
            >
              {t("appointments.edit")}
            </Button>
            {grid.state === GRID_STATE.OPEN ? (
              <Button
                variant="outlined"
                startIcon={<PauseRoundedIcon />}
                onClick={() =>
                  handleOpenConfirmModal(CONFIRM_MODAL_TYPE.SUSPEND_GRID)
                }
              >
                {t("appointments.suspend")}
              </Button>
            ) : (
              <Button
                variant="outlined"
                startIcon={<PlayArrowRoundedIcon />}
                onClick={() =>
                  handleOpenConfirmModal(CONFIRM_MODAL_TYPE.RESTORE_GRID)
                }
              >
                {t("appointments.resume")}
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<DeleteRoundedIcon />}
              onClick={() =>
                handleOpenConfirmModal(CONFIRM_MODAL_TYPE.DELETE_GRID)
              }
            >
              {t("appointments.delete")}
            </Button>
          </Box>
        ) : (
          <Button
            variant="outlined"
            startIcon={<VisibilityRoundedIcon />}
            onClick={handleOpenConsultModal}
          >
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
              <MenuItem onClick={handleOpenConsultModal}>
                <VisibilityRoundedIcon />
                {t("appointments.consult")}
              </MenuItem>
            ) : (
              <>
                <MenuItem onClick={handleOpenEditModal}>
                  <EditIcon />
                  {t("appointments.edit")}
                </MenuItem>
                {grid.state === GRID_STATE.OPEN ? (
                  <MenuItem
                    onClick={() =>
                      handleOpenConfirmModal(CONFIRM_MODAL_TYPE.SUSPEND_GRID)
                    }
                  >
                    <PauseRoundedIcon />
                    {t("appointments.suspend")}
                  </MenuItem>
                ) : (
                  <MenuItem
                    onClick={() =>
                      handleOpenConfirmModal(CONFIRM_MODAL_TYPE.RESTORE_GRID)
                    }
                  >
                    <PlayArrowRoundedIcon />
                    {t("appointments.resume")}
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() =>
                    handleOpenConfirmModal(CONFIRM_MODAL_TYPE.DELETE_GRID)
                  }
                >
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
