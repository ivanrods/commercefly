import { renderHook, act } from "@testing-library/react";
import { useImageUpload } from "./use-image-upload";

vi.mock("@/lib/cloudinary", () => ({
  validateImageFile: vi.fn(),
  uploadToCloudinary: vi.fn(),
}));

import { validateImageFile, uploadToCloudinary } from "@/lib/cloudinary";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("useImageUpload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns initial state", () => {
    const { result } = renderHook(() => useImageUpload());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.uploadProgress).toEqual({
      isLoading: false,
      error: null,
      progress: 0,
    });
    expect(result.current.fileProgress).toEqual({});
  });

  it("uploads a file successfully", async () => {
    vi.mocked(validateImageFile).mockReturnValue({ valid: true });
    vi.mocked(uploadToCloudinary).mockResolvedValue(
      "https://example.com/img.jpg",
    );

    const { result } = renderHook(() => useImageUpload());
    const file = new File(["test"], "test.png", { type: "image/png" });

    let url: string | null = null;
    await act(async () => {
      url = await result.current.uploadImage(file);
    });

    expect(url).toBe("https://example.com/img.jpg");
    expect(validateImageFile).toHaveBeenCalledWith(file);
    expect(uploadToCloudinary).toHaveBeenCalledWith(file);
  });

  it("returns null when validation fails", async () => {
    vi.mocked(validateImageFile).mockReturnValue({
      valid: false,
      error: "Arquivo inválido",
    });

    const { result } = renderHook(() => useImageUpload());
    const file = new File(["test"], "test.txt", { type: "text/plain" });

    let url: string | null = null;
    await act(async () => {
      url = await result.current.uploadImage(file);
    });

    expect(url).toBeNull();
    expect(result.current.error).toBe("Arquivo inválido");
  });
});
