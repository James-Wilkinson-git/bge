import { auth } from "@clerk/nextjs";

export default function LibraryPage() {
  const { userId } = auth();
  return <div>User Id: {userId}</div>;
}
