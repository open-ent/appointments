import {
  Avatar,
  Box,
  Button,
  Checkbox,
  IconButton,
  TableCell,
  TableRow,
} from "@cgi-learning-hub/ui";
import {
  ShareRight,
  ShareRightAction,
  ShareRightActionDisplayName,
} from "@open-ent/client";
import { useTranslation } from "react-i18next";

import { hasRight, showShareRightLine } from "./utils";
import {
  actionColumnStyle,
  avatarColumnStyle,
  avatarStyle,
  defaultAvatarStyle,
  nameColumnStyle,
  rightsColumnStyle,
  RotativeExpandMoreRoundedIcon,
} from "./style";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";

export const ShareLine = ({
  shareRight,
  showBookmark,
  toggleBookmark,
  shareRightActions,
  toggleRight,
  onDeleteRow,
}: {
  shareRight: ShareRight;
  shareRightActions: ShareRightAction[];
  showBookmark: boolean;
  toggleRight: (
    shareRight: ShareRight,
    actionName: ShareRightActionDisplayName,
  ) => void;
  toggleBookmark: () => void;
  onDeleteRow: (shareRight: ShareRight) => void;
}) => {
  const { t: tEdifice } = useTranslation();

  const getAvatar = () => {
    switch (shareRight.type) {
      case "sharebookmark":
        return <BookmarkBorderRoundedIcon />;
      case "group":
        return <GroupsRoundedIcon />;
      default:
        return (
          <Avatar src={shareRight.avatarUrl} sx={avatarStyle}>
            <PersonRoundedIcon sx={defaultAvatarStyle} />
          </Avatar>
        );
    }
  };

  return (
    showShareRightLine(shareRight, showBookmark) && (
      <TableRow
        key={shareRight.id}
        sx={{ ...(shareRight.isBookmarkMember && { bgcolor: "grey.lighter" }) }}
      >
        <TableCell sx={avatarColumnStyle}>{getAvatar()}</TableCell>
        <TableCell sx={nameColumnStyle}>
          <Box>
            {shareRight.type === "sharebookmark" && (
              <Button
                variant="text"
                color="inherit"
                endIcon={
                  <RotativeExpandMoreRoundedIcon showBookmark={showBookmark} />
                }
                onClick={toggleBookmark}
              >
                {shareRight.displayName}
              </Button>
            )}
            {shareRight.type !== "sharebookmark" && shareRight.displayName}
            {shareRight.type === "user" &&
              ` (${tEdifice(shareRight.profile || "")})`}
          </Box>
        </TableCell>
        {shareRightActions
          .filter((shareRightAction) => shareRightAction.id === "read")
          .map((shareRightAction) => (
            <TableCell
              key={shareRightAction.displayName}
              sx={rightsColumnStyle}
            >
              {!shareRight.isBookmarkMember && (
                <Checkbox
                  color="secondary"
                  checked={hasRight(shareRight, shareRightAction)}
                  onChange={() => {
                    toggleRight(shareRight, shareRightAction.id);
                  }}
                />
              )}
            </TableCell>
          ))}
        <TableCell sx={actionColumnStyle}>
          {!shareRight.isBookmarkMember && (
            <IconButton onClick={() => onDeleteRow(shareRight)}>
              <CloseRoundedIcon />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
    )
  );
};
