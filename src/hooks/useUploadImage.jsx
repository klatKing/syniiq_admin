import { useMutation } from "@tanstack/react-query";
import { deleteImage, uploadImage } from "../services/fileService";

export function useUploadImage() {
  return useMutation({
    mutationFn: async (file) => (await uploadImage(file)).data.url,
  });
}

export function useDeleteImage() {
  return useMutation({
    mutationFn: async (url) => deleteImage(url),
  });
}

export function useReplaceImage() {
  const upload = useUploadImage();
  const remove = useDeleteImage();

  const replace = async (file, previousUrl) => {
    const newUrl = await upload.mutateAsync(file);
    if (previousUrl && previousUrl !== newUrl) {
      remove.mutate(previousUrl, {
        onError: (err) => {
          // Visible dans la console : vous saurez immédiatement si ça échoue
          console.error("Échec de la suppression de l'ancienne image :", previousUrl, err);
        },
      });
    }
    return newUrl;
  };

  return { replace, isUploading: upload.isPending ?? upload.isLoading };
}