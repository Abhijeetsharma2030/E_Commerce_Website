import { Badge } from "@/components/ui/badge";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export default async function AdminUsersPage() {
  await connectDB();
  const users = await User.find().select("-password").sort({ createdAt: -1 }).lean();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-medium text-neutral-900">All Users ({users.length})</h1>

      <div className="overflow-hidden rounded-xl border border-neutral-200">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {users.map((user) => (
              <tr key={user._id.toString()}>
                <td className="px-4 py-3 font-medium text-neutral-900">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-4 py-3 text-neutral-600">{user.username}</td>
                <td className="px-4 py-3 text-neutral-600">{user.email}</td>
                <td className="px-4 py-3">
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {new Date(user.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
