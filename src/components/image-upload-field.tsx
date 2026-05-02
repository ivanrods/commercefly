import { useState } from "react";
import Image from "next/image";
import { useImageUpload } from "@/hooks/use-image-upload";
import { Field, FieldLabel } from "@/components/ui/field";
import { Loader2, X, Upload, AlertCircle, CheckCircle } from "lucide-react";

interface ImageUploadFieldProps {
  value: string[];
  onChange: (images: string[]) => void;
  error?: string;
  label?: string;
  maxImages?: number;
  disabled?: boolean;
}

export function ImageUploadField({
  value = [],
  onChange,
  error,
  label = "Imagens do Produto",
  maxImages = 5,
  disabled = false,
}: ImageUploadFieldProps) {
  const {
    uploadImage,
    isLoading,
    error: uploadError,
    clearError,
  } = useImageUpload();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());

  const canUpload = !disabled && !isLoading && value.length < maxImages;

  const handleFileSelect = async (file: File) => {
    if (value.length >= maxImages) {
      alert(`Máximo de ${maxImages} imagens permitidas`);
      return;
    }

    if (!canUpload) return;

    setUploadingFiles((prev) => new Set(prev).add(file.name));

    try {
      const url = await uploadImage(file);
      if (url) {
        onChange([...value, url]);
      }
    } finally {
      setUploadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(file.name);
        return newSet;
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (canUpload) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (!canUpload) return;

    // Processar múltiplos arquivos
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/"),
    );

    for (const file of files) {
      if (value.length >= maxImages) break;
      await handleFileSelect(file);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    for (const file of files) {
      if (value.length >= maxImages) break;
      await handleFileSelect(file);
    }

    // Limpar input
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
    if (uploadError) {
      clearError();
    }
  };

  const isUploading = uploadingFiles.size > 0 || isLoading;

  return (
    <Field>
      <FieldLabel className="flex items-center gap-2">
        {label}
        {value.length > 0 && !error && !uploadError && (
          <CheckCircle className="w-4 h-4 text-green-500" />
        )}
      </FieldLabel>

      {/* Área de Upload */}
      {value.length < maxImages && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${
            isDragging && canUpload
              ? "border-blue-500 bg-blue-50 scale-[1.02]"
              : disabled
                ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50"
                : "border-gray-300 bg-gray-50 hover:border-gray-400"
          }`}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleInputChange}
            disabled={!canUpload}
            className="hidden"
            id="image-input"
          />

          <label
            htmlFor="image-input"
            className={`flex flex-col items-center justify-center ${
              canUpload ? "cursor-pointer" : "cursor-not-allowed"
            }`}
          >
            <div className="text-center">
              {isUploading ? (
                <>
                  <div className="relative w-8 h-8 mx-auto mb-2">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Enviando {uploadingFiles.size} imagem
                    {uploadingFiles.size !== 1 ? "ns" : ""}
                    ...
                  </p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm font-medium text-gray-700">
                    Clique ou arraste arquivos aqui
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, WebP ou GIF (máx. 5MB cada)
                  </p>
                  {maxImages > 1 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Você pode enviar até {maxImages} imagens
                    </p>
                  )}
                </>
              )}
            </div>
          </label>
        </div>
      )}

      {/* Erros */}
      {(error || uploadError) && (
        <div className="flex items-start gap-2 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700 font-medium">Erro no upload</p>
            <p className="text-sm text-red-600 mt-1">{error || uploadError}</p>
          </div>
        </div>
      )}

      {/* Preview das Imagens */}
      {value.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700">
              Imagens ({value.length}/{maxImages})
            </p>
            {value.length > 1 && (
              <p className="text-xs text-gray-500">Primeira será a principal</p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {value.map((url, index) => (
              <div key={index} className="relative group">
                <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={url}
                    alt={`Imagem ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {index === 0 && (
                    <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Principal
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  disabled={disabled || isUploading}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Remover imagem"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensagem de Status */}
      {value.length === maxImages && (
        <p className="text-xs text-gray-500 mt-3">
          ✓ Limite máximo de {maxImages} imagens atingido
        </p>
      )}
      {value.length === 0 && !error && !uploadError && (
        <p className="text-xs text-gray-500 mt-3">
          Adicione pelo menos uma imagem para continuar
        </p>
      )}
    </Field>
  );
}
