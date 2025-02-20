import { FC } from "react";

import { Autocomplete, Checkbox, Chip, TextField } from "@cgi-learning-hub/ui";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { useTranslation } from "react-i18next";

import { APPOINTMENTS } from "~/core/constants";
import { useGridModal } from "~/providers/GridModalProvider";
import { GRID_MODAL_TYPE } from "~/providers/GridModalProvider/enum";
import { chipStyle, TextFieldStyle } from "./style";

export const CustomMultiAutocomplete: FC = () => {
  const {
    publicOptions,
    inputs,
    updateGridModalInputs: { handlePublicChange },
    modalType,
  } = useGridModal();

  const selectedPublic = inputs.public;
  const { t } = useTranslation(APPOINTMENTS);

  return (
    <Autocomplete
      multiple
      options={publicOptions}
      disabled={modalType !== GRID_MODAL_TYPE.CREATION}
      disableCloseOnSelect
      getOptionLabel={(option) => option.groupName}
      isOptionEqualToValue={(option, value) => option.groupId === value.groupId}
      value={selectedPublic}
      onChange={handlePublicChange}
      renderOption={(props, option, { selected }) => {
        const optionProps = props;
        return (
          <li {...optionProps}>
            <Checkbox
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.groupName}
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
