import { renderHook } from "@testing-library/react";
import { useIsMobile } from "./use-mobile";
import { describe, expect, it } from "vitest";

describe("useIsMobile", () => {
  it("returns false on desktop viewport", () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });
});
