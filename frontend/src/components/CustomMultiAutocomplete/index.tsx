import { FC } from "react";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { Autocomplete, Checkbox, Chip, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

import { chipStyle, TextFieldStyle } from "./style";
import { useGridModalProvider } from "~/providers/GridModalProvider";

export const CustomMultiAutocomplete: FC = () => {
  const {
    publicOptions,
    inputs,
    updateGridModalInputs: { handlePublicChange },
  } = useGridModalProvider();

  const selectedPublic = inputs.public;
  const { t } = useTranslation("appointments");

  return (
    <Autocomplete
      multiple
      options={publicOptions}
      disableCloseOnSelect
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      value={selectedPublic}
      onChange={handlePublicChange}
      renderOption={(props, option, { selected }) => {
        const optionProps = props;
        return (
          <li key={uuidv4()} {...optionProps}>
            <Checkbox
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.name}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          sx={TextFieldStyle}
          {...params}
          label={t("appointments.grid.public") + " *"}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                {!selectedPublic.length && (
                  <Chip
                    variant="filled"
                    label={t("appointments.everyone")}
                    sx={chipStyle}
                  />
                )}
                {params.InputProps.startAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};
