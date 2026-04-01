import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex h-full justify-center mt-52">
      <SignIn />
    </div>
  );
}
