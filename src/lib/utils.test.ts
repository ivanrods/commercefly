import { cn } from "./utils";
import { describe, expect, it } from "vitest";

describe("cn", () => {
  it("combines class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("merges tailwind classes", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden")).toBe("base");
  });
});
