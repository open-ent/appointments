export interface IExportAppointmentsModalProps {
  hasOnlyCancelled: boolean;
  isOpen: boolean;
  handleClose: () => void;
  handleExport: () => void;
}
