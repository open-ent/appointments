import { useUser } from "@open-ent/react";
import { FC } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ShareResourceModal } from "~/common/ShareModal/ShareResourceModal";

import { APPOINTMENTS } from "~/core/constants";
import { TagName } from "~/core/enums";
import { t } from "~/i18n";
import { useAvailability } from "~/providers/AvailabilityProvider";
import { useGlobal } from "~/providers/GlobalProvider";
import { ModalType } from "~/providers/GlobalProvider/enum";
import { gridApi } from "~/services/api/GridService";

export const ShareGridModal: FC = () => {
  const { user } = useUser();
  const {
    toggleModal,
    displayModals: { showShareGridModal },
  } = useGlobal();
  const { selectedGridId: gridId } = useAvailability();
  const dispatcher = useDispatch();

  const shareOptions = {
    resourceId: gridId?.toString() ?? "",
    resourceCreatorId: user?.userId ?? "",
    resourceRights: [`creator:${user?.userId ?? ""}`],
  };

  const handleShareSuccess = () => {
    toast.success(t("appointments.toast.share.success"));
    dispatcher(gridApi.util.invalidateTags([TagName.GRIDS]));
    toggleModal(ModalType.SHARE_GRID);
  };

  if (!showShareGridModal) return null;

  return (
    <ShareResourceModal
      appCode={APPOINTMENTS}
      isOpen={showShareGridModal}
      shareOptions={shareOptions}
      onCancel={() => toggleModal(ModalType.SHARE_GRID)}
      onSuccess={handleShareSuccess}
    />
  );
};
