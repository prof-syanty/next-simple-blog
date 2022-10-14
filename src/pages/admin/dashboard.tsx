import withAuth from "@hoc/with-auth";
import Link from "next/link";

function Dashboard() {
  return (
    <Link href={"/admin/posts"}>
      <a className="bg-red-500 text-black rounded-md p-2">Posts</a>
    </Link>
  );
}

export default withAuth(Dashboard);
