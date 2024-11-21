import { FC } from "react";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { colorStyle, CustomSelect, firstLineStyle, nameStyle } from "./style";
import { pageGridModalStyle } from "../GridModal/style";
import { ColorPicker } from "~/components/ColorPicker";
import { CustomMultiAutocomplete } from "~/components/CustomMultiAutocomplete";
import { MAX_STRING_LENGTH } from "~/core/constants";
import { useGlobalProvider } from "~/providers/GlobalProvider";
import { useGridModalProvider } from "~/providers/GridModalProvider";
import { flexStartBoxStyle } from "~/styles/boxStyles";

export const FirstPageGridModal: FC = () => {
  const { t } = useTranslation("appointments");
  const { isMultiStructure } = useGlobalProvider();
  const {
    inputs,
    errorInputs,
    structureOptions,
    updateGridModalInputs: {
      handleNameChange,
      handleStructureChange,
      handleLocationChange,
      handleIsVisioChange,
      handleVisioLinkChange,
      handlePublicCommentChange,
    },
    blurGridModalInputs: { handleNameBlur, handleVisioLinkBlur },
  } = useGridModalProvider();

  return (
    <Box sx={pageGridModalStyle}>
      <Box sx={firstLineStyle}>
        <TextField
          id="grid-name"
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
        />
        <Box sx={colorStyle}>
          <Typography>{t("appointments.grid.color") + " * "}</Typography>
          <ColorPicker />
        </Box>
      </Box>
      <FormControl sx={{ width: "100%" }}>
        <InputLabel id="demo-simple-select-label">
          {t("appointments.grid.structure") + " * "}
        </InputLabel>
        <CustomSelect
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label={t("appointments.grid.structure")}
          value={inputs.structure.id}
          onChange={handleStructureChange}
          disabled={!isMultiStructure}
          isDisabled={!isMultiStructure}
        >
          {structureOptions.map((structure: { id: string; name: string }) => (
            <MenuItem key={structure.id} value={structure.id}>
              {structure.name}
            </MenuItem>
          ))}
        </CustomSelect>
      </FormControl>
      <TextField
        id="grid-location"
        label={t("appointments.grid.location")}
        variant="outlined"
        value={inputs.location}
        onChange={handleLocationChange}
      />
      <CustomMultiAutocomplete />
      <Box sx={flexStartBoxStyle}>
        <Typography>{t("appointments.grid.videoconference")}</Typography>
        <Switch checked={inputs.isVisio} onChange={handleIsVisioChange} />
      </Box>
      {inputs.isVisio && (
        <TextField
          id="grid-visio-link"
          label={t("appointments.grid.videoconference.link") + " *"}
          variant="outlined"
          value={inputs.visioLink}
          onChange={handleVisioLinkChange}
          onBlur={handleVisioLinkBlur}
          error={!!errorInputs.visioLink.length}
          helperText={t(errorInputs.visioLink)}
        />
      )}
      <TextField
        id="grid-public-comment"
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
      />
    </Box>
  );
};
