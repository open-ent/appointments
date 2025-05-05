import { FC, useEffect, useState } from "react";

import {
  Autocomplete,
  Checkbox,
  Divider,
  TextField,
} from "@cgi-learning-hub/ui";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { useTranslation } from "react-i18next";

import { APPOINTMENTS } from "~/core/constants";
import { useGridModal } from "~/providers/GridModalProvider";
import { GRID_MODAL_TYPE } from "~/providers/GridModalProvider/enum";
import { Public } from "~/services/api/CommunicationService/types";
import { SelectPossibility } from "./enums";
import { TextFieldStyle } from "./style";
import { getOptionLabel, isOptionEqualToValue } from "./utils";

export const CustomMultiAutocomplete: FC = () => {
  const {
    publicOptions,
    inputs: { public: selectedPublic },
    updateGridModalInputs: { handlePublicChange },
    blurGridModalInputs: { handlePublicBlur },
    errorInputs: { public: publicError },
    modalType,
  } = useGridModal();

  const { t } = useTranslation(APPOINTMENTS);

  const selectAllLabel = t("appointments.select.all");
  const deselectAllLabel = t("appointments.deselect.all");

  const [showSelectAll, setShowSelectAll] = useState(true); // if false show deselect all

  useEffect(() => {
    setShowSelectAll(publicOptions.length !== selectedPublic.length);
  }, [publicOptions, selectedPublic]);

  const handleSelectAll = () => {
    handlePublicChange(publicOptions);
    setShowSelectAll(false);
  };
  const handleDeselectAll = () => {
    handlePublicChange([]);
    setShowSelectAll(true);
  };

  const selectAllFakeGroup: Public = {
    groupId: SelectPossibility.SELECT_ALL,
    groupName: selectAllLabel,
  };
  const deselectAllFakeGroup: Public = {
    groupId: SelectPossibility.DESELECT_ALL,
    groupName: deselectAllLabel,
  };

  const options = [
    showSelectAll ? selectAllFakeGroup : deselectAllFakeGroup,
    ...publicOptions,
  ];

  return (
    <Autocomplete
      multiple
      options={options}
      disabled={modalType !== GRID_MODAL_TYPE.CREATION}
      disableCloseOnSelect
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      value={selectedPublic}
      limitTags={3}
      onChange={(_, value) => handlePublicChange(value)}
      onBlur={handlePublicBlur}
      renderOption={(props, option, { selected }) => {
        const optionProps = props;
        if (
          Object.values(SelectPossibility).includes(
            option.groupId as SelectPossibility,
          )
        ) {
          const selectOption = option.groupId as SelectPossibility;

          return (
            <>
              <li
                {...props}
                onClick={
                  selectOption === SelectPossibility.SELECT_ALL
                    ? handleSelectAll
                    : handleDeselectAll
                }
                key={option.groupId}
              >
                {showSelectAll ? selectAllLabel : deselectAllLabel}
              </li>
              <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
            </>
          );
        }
        return (
          <li {...optionProps} key={option.groupId}>
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
          error={!!publicError}
          helperText={t(publicError)}
        />
      )}
    />
  );
};
