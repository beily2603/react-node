import { upload } from "../create-reference/storage";

export const uploadFile = async (file: File | null) => {
    if (file) {
    const fromData = new FormData();
    fromData.append('file', file);
    return upload(file);
    }
  };