import { describe, it, expect } from "vitest";
import { GET } from "../app/api/categories/route";

describe("GET /api/categories", () => {
  it("should return categories", async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });
});
