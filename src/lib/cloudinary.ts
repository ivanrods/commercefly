export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
};

// Função para upload direto (client-side)
export async function uploadToCloudinary(file: File): Promise<string> {
  if (!CLOUDINARY_CONFIG.cloudName || !CLOUDINARY_CONFIG.uploadPreset) {
    throw new Error(
      "Cloudinary não está configurado. Verifique as variáveis de ambiente.",
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
  formData.append("folder", "commercefly/products");

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erro no Cloudinary: ${error.error?.message}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    throw new Error(
      `Falha ao fazer upload da imagem: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
    );
  }
}

// Validar tamanho do arquivo (máx 5MB)
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  if (file.size > MAX_SIZE) {
    return { valid: false, error: "Arquivo deve ter no máximo 5MB" };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: "Formato deve ser JPEG, PNG, WebP ou GIF" };
  }

  return { valid: true };
}
