import { describe, expect, it } from "vitest";
import { validateImageFile } from "./cloudinary";

describe("validateImageFile", () => {
  it("accepts a valid image", () => {
    const file = new File(["test"], "photo.jpg", { type: "image/jpeg" });
    expect(validateImageFile(file)).toEqual({ valid: true });
  });

  it("rejects files over 5MB", () => {
    const file = new File([new ArrayBuffer(6 * 1024 * 1024)], "big.jpg", {
      type: "image/jpeg",
    });
    expect(validateImageFile(file)).toEqual({
      valid: false,
      error: "Arquivo deve ter no máximo 5MB",
    });
  });

  it("rejects invalid file types", () => {
    const file = new File(["test"], "doc.txt", { type: "text/plain" });
    expect(validateImageFile(file)).toEqual({
      valid: false,
      error: "Formato deve ser JPEG, PNG, WebP ou GIF",
    });
  });

  it("accepts PNG, WebP and GIF", () => {
    const png = new File(["test"], "a.png", { type: "image/png" });
    const webp = new File(["test"], "a.webp", { type: "image/webp" });
    const gif = new File(["test"], "a.gif", { type: "image/gif" });
    expect(validateImageFile(png)).toEqual({ valid: true });
    expect(validateImageFile(webp)).toEqual({ valid: true });
    expect(validateImageFile(gif)).toEqual({ valid: true });
  });
});
