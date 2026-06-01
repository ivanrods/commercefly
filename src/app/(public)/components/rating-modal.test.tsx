import { render, screen } from "@/tests/test-utils";
import userEvent from "@testing-library/user-event";
import RatingModal from "./rating-modal";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockMutate = vi.fn();

vi.mock("@/hooks/use-rating", () => ({
  useProductRating: () => ({ data: { userRating: 0 }, isLoading: false }),
  useSubmitRating: () => ({ mutate: mockMutate, isPending: false }),
}));

describe("RatingModal", () => {
  beforeEach(() => {
    mockMutate.mockClear();
  });

  it("renders the aval button", () => {
    render(<RatingModal productId="prod-1" productName="Camiseta" />);
    expect(
      screen.getByRole("button", { name: /Avaliar/i }),
    ).toBeInTheDocument();
  });

  it("opens drawer with stars on aval click", async () => {
    const user = userEvent.setup();
    render(<RatingModal productId="prod-1" productName="Camiseta" />);
    await user.click(screen.getByText(/Avaliar/i));
    expect(screen.getByText("Camiseta")).toBeInTheDocument();
    expect(screen.getByText("Enviar avaliação")).toBeInTheDocument();
  });
});
