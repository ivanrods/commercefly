import { render, screen } from "@/tests/test-utils";
import userEvent from "@testing-library/user-event";
import LikeButton from "./like-button";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockAddLike, mockRemoveLike } = vi.hoisted(() => ({
  mockAddLike: vi.fn(),
  mockRemoveLike: vi.fn(),
}));

vi.mock("@/hooks/use-likes", () => ({
  useAddLike: () => ({ mutate: mockAddLike, isPending: false }),
  useRemoveLike: () => ({ mutate: mockRemoveLike, isPending: false }),
  useIsLiked: () => ({ data: { isLiked: false } }),
  useLikeCount: () => ({ data: { count: 7 } }),
}));

describe("LikeButton", () => {
  beforeEach(() => {
    mockAddLike.mockClear();
    mockRemoveLike.mockClear();
  });

  it("renders heart button with like count", () => {
    render(<LikeButton productId="prod-1" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("calls addLike on click when product not liked", async () => {
    const user = userEvent.setup();
    render(<LikeButton productId="prod-1" />);
    await user.click(screen.getByRole("button"));
    expect(mockAddLike).toHaveBeenCalledWith("prod-1");
  });
});
