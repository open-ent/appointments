import { FC } from "react";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { pageGridModalStyle } from "../GridModal/style";
import { ColorPicker } from "~/components/ColorPicker";
import { CustomMultiAutocomplete } from "~/components/CustomMultiAutocomplete";
import { useGridModalProvider } from "~/providers/GridModalProvider";
import {
  flexEndBoxStyle,
  flexStartBoxStyle,
  spaceBetweenBoxStyle,
} from "~/styles/boxStyles";

export const FirstPageGridModal: FC = () => {
  const { t } = useTranslation("appointments");

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
      <Box sx={spaceBetweenBoxStyle}>
        <TextField
          id="grid-name"
          label={
            t("appointments.grid.name") +
            " * " +
            t("appointments.grid.visible.all")
          }
          variant="outlined"
          fullWidth
          value={inputs.name}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          error={!!errorInputs.name}
          helperText={t(errorInputs.name)}
        />
        <Box sx={flexEndBoxStyle}>
          <Typography>{t("appointments.grid.color") + " * "}</Typography>
          <ColorPicker />
        </Box>
      </Box>
      <FormControl sx={{ width: "100%" }}>
        <InputLabel id="demo-simple-select-label">
          {t("appointments.grid.structure") + " * "}
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label={t("appointments.grid.structure")}
          value={inputs.structure.id}
          onChange={handleStructureChange}
        >
          {structureOptions.map((structure) => (
            <MenuItem key={structure.id} value={structure.id}>
              {structure.name}
            </MenuItem>
          ))}
        </Select>
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
      />
    </Box>
  );
};
