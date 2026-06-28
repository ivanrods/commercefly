import { describe, it, expect, afterAll, beforeAll, afterEach, vi, beforeEach } from "vitest";
import { checkout } from "../services/checkout-service";

describe("checkout-service (client-side fetch)", () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeAll(() => {
    vi.stubGlobal("window", { location: { href: "" } });
  });

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      json: async () => ({ url: "https://checkout.stripe.com/test" }),
      ok: true,
    } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("checkout chama POST /api/checkout", async () => {
    await checkout();

    expect(fetchSpy).toHaveBeenCalledWith("/api/checkout", {
      method: "POST",
    });
  });

  it("checkout redireciona para url retornada pela API", async () => {
    await checkout();

    expect(window.location.href).toBe("https://checkout.stripe.com/test");
  });

  it("checkout redireciona para url diferente quando API retorna outra url", async () => {
    fetchSpy.mockResolvedValueOnce({
      json: async () => ({ url: "https://checkout.stripe.com/outro-link" }),
      ok: true,
    } as Response);

    await checkout();

    expect(window.location.href).toBe("https://checkout.stripe.com/outro-link");
  });
});
