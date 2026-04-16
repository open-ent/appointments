import { NumberField } from "@base-ui/react/number-field";
import { FormControlProps, FormHelperTextProps, InputAdornmentProps, OutlinedInputProps } from "@mui/material";
import { ReactNode } from "react";

export interface INumberFieldProps extends NumberField.Root.Props {
  label?: ReactNode;
  size?: 'small' | 'medium';
  help?: string;
  error?: boolean;
  slotProps?: {
    root?: FormControlProps,
    input?: {
      root?: OutlinedInputProps,
      adornment?: InputAdornmentProps,
    }
    help?: FormHelperTextProps,
  };
}