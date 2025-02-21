import { FC, useMemo } from "react";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@cgi-learning-hub/ui";
import { useTranslation } from "react-i18next";

import { ColorPicker } from "~/components/ColorPicker";
import { CustomMultiAutocomplete } from "~/components/CustomMultiAutocomplete";
import {
  ALLOWED_DOCUMENT_EXTENSIONS,
  APPOINTMENTS,
  MAX_FILE_PER_GRID,
  MAX_STRING_LENGTH,
  MAX_TOTAL_FILE_SIZE_PER_GRID_MO,
} from "~/core/constants";
import { useGlobal } from "~/providers/GlobalProvider";
import { useGridModal } from "~/providers/GridModalProvider";
import { GRID_MODAL_TYPE } from "~/providers/GridModalProvider/enum";
import { flexStartBoxStyle, spaceBetweenBoxStyle } from "~/styles/boxStyles";
import { pageGridModalStyle } from "../GridModal/style";
import {
  addDocumentStyle,
  colorStyle,
  docsInfosStyle,
  firstLineStyle,
  nameStyle,
  selectStyle,
  VisuallyHiddenInput,
} from "./style";

import { FileList, Tooltip } from "@cgi-learning-hub/ui";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { displaySize } from "./utils";

export const FirstPageGridModal: FC = () => {
  const { t } = useTranslation(APPOINTMENTS);
  const { isMultiStructure } = useGlobal();
  const {
    inputs,
    errorInputs,
    structureOptions,
    updateGridModalInputs: {
      handleNameChange,
      handleStructureChange,
      handleLocationChange,
      handleIsVideoCallChange,
      handleVideoCallLinkChange,
      handlePublicCommentChange,
    },
    blurGridModalInputs: {
      handleNameBlur,
      handleVideoCallLinkBlur,
      handleLocationBlur,
    },
    modalType,
    files,
    totalFilesSize,
    handleAddFile,
    handleDeleteFile,
  } = useGridModal();

  const isAddDocumentDisabled = useMemo(
    () => files.length >= MAX_FILE_PER_GRID,
    [files.length],
  );

  return (
    <Box sx={pageGridModalStyle}>
      <Box sx={firstLineStyle}>
        <TextField
          label={
            t("appointments.grid.name") +
            " * " +
            t("appointments.grid.visible.all")
          }
          variant="outlined"
          sx={nameStyle}
          value={inputs.name}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          error={!!errorInputs.name}
          helperText={t(errorInputs.name)}
          disabled={modalType === GRID_MODAL_TYPE.CONSULTATION}
        />
        <Box sx={colorStyle}>
          <Typography>{t("appointments.grid.color") + " * "}</Typography>
          <ColorPicker />
        </Box>
      </Box>
      <FormControl fullWidth>
        <InputLabel sx={{ width: "fit-content" }}>
          {t("appointments.grid.structure") + " * "}
        </InputLabel>
        <Select
          label={t("appointments.grid.structure") + " * "}
          value={inputs.structure.id}
          onChange={handleStructureChange}
          sx={selectStyle}
          disabled={!isMultiStructure || modalType !== GRID_MODAL_TYPE.CREATION}
        >
          {structureOptions.map((structure: { id: string; name: string }) => (
            <MenuItem key={structure.id} value={structure.id}>
              {structure.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label={t("appointments.grid.location", {
          required: inputs.isVideoCall ? "" : "* ",
        })}
        variant="outlined"
        value={inputs.location}
        onChange={handleLocationChange}
        onBlur={handleLocationBlur}
        error={!!errorInputs.location}
        helperText={t(errorInputs.location)}
        disabled={modalType === GRID_MODAL_TYPE.CONSULTATION}
      />
      <CustomMultiAutocomplete />
      <Box sx={flexStartBoxStyle}>
        <Typography>{t("appointments.grid.videoconference")}</Typography>
        <Switch
          checked={inputs.isVideoCall}
          onChange={handleIsVideoCallChange}
          disabled={modalType !== GRID_MODAL_TYPE.CREATION}
        />
      </Box>
      {inputs.isVideoCall && (
        <TextField
          label={t("appointments.grid.videoconference.link") + " *"}
          variant="outlined"
          value={inputs.videoCallLink}
          onChange={handleVideoCallLinkChange}
          onBlur={handleVideoCallLinkBlur}
          error={!!errorInputs.videoCallLink.length}
          helperText={t(errorInputs.videoCallLink)}
          disabled={modalType === GRID_MODAL_TYPE.CONSULTATION}
        />
      )}
      <TextField
        label={
          t("appointments.grid.comment") +
          " " +
          t("appointments.grid.visible.all")
        }
        variant="outlined"
        multiline
        rows={4}
        value={inputs.publicComment}
        onChange={handlePublicCommentChange}
        helperText={
          inputs.publicComment.length === MAX_STRING_LENGTH &&
          t("appointments.grid.comment.text.helper")
        }
        error={inputs.publicComment.length === MAX_STRING_LENGTH}
        disabled={modalType === GRID_MODAL_TYPE.CONSULTATION}
      />
      <Box sx={spaceBetweenBoxStyle}>
        <Tooltip
          title={
            isAddDocumentDisabled && t("appointments.max.number.files.exceeded")
          }
          disableHoverListener={false}
        >
          <Box>
            <Button
              component="label"
              variant="outlined"
              color="secondary"
              tabIndex={-1}
              startIcon={<UploadFileIcon />}
              sx={addDocumentStyle}
              disabled={
                modalType === GRID_MODAL_TYPE.CONSULTATION ||
                isAddDocumentDisabled
              }
            >
              {t("appointments.grid.add.document")}
              <VisuallyHiddenInput
                type="file"
                accept={ALLOWED_DOCUMENT_EXTENSIONS.join(",")}
                onChange={handleAddFile}
              />
            </Button>
          </Box>
        </Tooltip>
        <Box sx={docsInfosStyle}>
          <Typography>
            {t("appointments.max.number.files", {
              maxNumber: MAX_FILE_PER_GRID,
            })}
          </Typography>
          <Typography>
            {t("appointments.total.size.files", {
              totalSize: displaySize(totalFilesSize),
              maxSize: MAX_TOTAL_FILE_SIZE_PER_GRID_MO,
            })}
          </Typography>
        </Box>
      </Box>
      <FileList files={files} onDelete={handleDeleteFile} />
    </Box>
  );
};
