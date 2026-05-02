import { useState, useCallback } from "react";
import { uploadToCloudinary, validateImageFile } from "@/lib/cloudinary";

interface UploadProgress {
  isLoading: boolean;
  error: string | null;
  progress: number;
}

interface FileUploadProgress {
  [fileKey: string]: {
    progress: number;
    error: string | null;
  };
}

export function useImageUpload() {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    isLoading: false,
    error: null,
    progress: 0,
  });

  const [fileProgress, setFileProgress] = useState<FileUploadProgress>({});

  const uploadImage = useCallback(
    async (file: File): Promise<string | null> => {
      const fileKey = `${file.name}-${file.size}`;

      setUploadProgress({ isLoading: true, error: null, progress: 0 });
      setFileProgress((prev) => ({
        ...prev,
        [fileKey]: { progress: 0, error: null },
      }));

      try {
        // Validar arquivo
        const validation = validateImageFile(file);
        if (!validation.valid) {
          const errorMsg = validation.error || "Arquivo inválido";
          setUploadProgress({ isLoading: false, error: errorMsg, progress: 0 });
          setFileProgress((prev) => ({
            ...prev,
            [fileKey]: { progress: 0, error: errorMsg },
          }));
          return null;
        }

        setFileProgress((prev) => ({
          ...prev,
          [fileKey]: { progress: 30, error: null },
        }));

        // Upload para Cloudinary
        const imageUrl = await uploadToCloudinary(file);

        setUploadProgress({ isLoading: false, error: null, progress: 100 });
        setFileProgress((prev) => ({
          ...prev,
          [fileKey]: { progress: 100, error: null },
        }));

        // Limpar progresso após sucesso
        setTimeout(() => {
          setFileProgress((prev) => {
            const newProgress = { ...prev };
            delete newProgress[fileKey];
            return newProgress;
          });
        }, 1000);

        return imageUrl;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao fazer upload";
        setUploadProgress({
          isLoading: false,
          error: errorMessage,
          progress: 0,
        });
        setFileProgress((prev) => ({
          ...prev,
          [fileKey]: { progress: 0, error: errorMessage },
        }));
        return null;
      }
    },
    [],
  );

  const uploadMultipleImages = useCallback(
    async (files: File[]): Promise<string[]> => {
      setUploadProgress({ isLoading: true, error: null, progress: 0 });

      const uploadPromises = files.map((file) => uploadImage(file));
      const results = await Promise.all(uploadPromises);

      const successfulUrls = results.filter(
        (url): url is string => url !== null,
      );

      setUploadProgress({
        isLoading: false,
        error:
          successfulUrls.length === 0 ? "Nenhuma imagem foi enviada" : null,
        progress: 100,
      });

      return successfulUrls;
    },
    [uploadImage],
  );

  const clearError = useCallback(() => {
    setUploadProgress((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    uploadImage,
    uploadMultipleImages,
    uploadProgress,
    fileProgress,
    clearError,
    isLoading: uploadProgress.isLoading,
    error: uploadProgress.error,
  };
}
