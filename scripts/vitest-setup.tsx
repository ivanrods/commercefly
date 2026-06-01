import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

const createMockUser = () => ({
  id: "test-user-id",
  fullName: "Test User",
  primaryEmailAddress: { emailAddress: "test@example.com" },
  imageUrl: "https://img.clerk.com/test-avatar",
  emailAddresses: [{ emailAddress: "test@example.com" }],
});

vi.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    isLoaded: true,
    isSignedIn: true,
    user: createMockUser(),
  }),
  useAuth: () => ({
    userId: "test-user-id",
    isLoaded: true,
  }),
  useClerk: () => ({
    openUserProfile: vi.fn(),
    signOut: vi.fn(),
  }),
  SignedIn: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SignedOut: () => null,
  UserButton: () => null,
  ClerkProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: Record<string, unknown>) => {
    return <img src={src as string} alt={alt as string} {...props} />;
  },
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
  Toaster: () => null,
}));
