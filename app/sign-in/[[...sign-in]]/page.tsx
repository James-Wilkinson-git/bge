import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex h-screen">
      <div className="mx-auto my-10">
        <SignIn />
      </div>
    </div>
  );
}
