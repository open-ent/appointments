import { useWorkspaceFile } from "@edifice.io/react";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { APPOINTMENTS, MAX_TOTAL_FILE_SIZE_PER_GRID_O } from "~/core/constants";
import { Document } from "~/services/api/GridService/types";
import { MyCustomFile } from "./types";
import { createMyCustomFile } from "./utils";

export const useFiles = () => {
  const { t } = useTranslation(APPOINTMENTS);
  const [files, setFiles] = useState<MyCustomFile[]>([]);
  const [totalFilesSize, setTotalFilesSize] = useState<number>(0);
  const { create } = useWorkspaceFile();

  const handleAddFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const newFiles = Array.from(event.target.files).map((file) =>
      createMyCustomFile(file),
    );
    const newFilesSize = newFiles.reduce((acc, file) => acc + file.size, 0);
    if (totalFilesSize + newFilesSize > MAX_TOTAL_FILE_SIZE_PER_GRID_O) {
      toast.error(t("appointments.total.size.files.exceeded"));
      return;
    }
    setTotalFilesSize(totalFilesSize + newFilesSize);
    return setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDeleteFile = (file: MyCustomFile) => {
    setFiles((prev) => prev.filter((f) => f.id !== file.id));
    return setTotalFilesSize(totalFilesSize - file.file.size);
  };

  const saveInWorkspace = async () => {
    const updatedFiles = await Promise.all(
      files.map(async (file) => {
        if (file.workspaceId) return file;
        const workspaceDocument = await create(file.file, {
          visibility: "protected",
          application: APPOINTMENTS,
        });
        return { ...file, workspaceId: workspaceDocument._id ?? "" };
      }),
    );
    return updatedFiles;
  };

  const initFiles = (documents: Document[]) => {
    const createFileFromDocument = (document: Document) => {
      const blob = new Blob([new Uint8Array(document.size)]);
      return new File([blob], document.name);
    };
    const newFiles = documents.map((document) => ({
      id: document.id,
      file: createFileFromDocument(document),
      workspaceId: document.id,
      name: document.name,
      size: document.size,
      ownerName: document.ownerName,
      isDeletable: true,
    })) as MyCustomFile[];
    setFiles(newFiles);
    return setTotalFilesSize(
      newFiles.reduce((acc, file) => acc + file.file.size, 0),
    );
  };

  const resetFiles = () => {
    setFiles([]);
    setTotalFilesSize(0);
    return;
  };

  return {
    files,
    totalFilesSize,
    initFiles,
    handleAddFile,
    handleDeleteFile,
    saveInWorkspace,
    resetFiles,
  };
};
