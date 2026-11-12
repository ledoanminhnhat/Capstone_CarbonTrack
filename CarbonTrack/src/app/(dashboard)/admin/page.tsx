"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdDelete } from "react-icons/md";
import { getUser } from "@/lib/auth";
import Select from "@/components/ui/Select";
import { getUsers, changeRole, deleteUser, type AdminUser } from "@/lib/admin";

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [myId, setMyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const me = getUser();
    // Chỉ ADMIN mới được vào trang này
    if (!me || me.role !== "ADMIN") {
      router.replace("/home");
      return;
    }
    setMyId(me.id);
    setChecked(true);
    load();
  }, [router]);

  const load = async () => {
    setLoading(true);
    try {
      setUsers(await getUsers());
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id: string, role: "USER" | "ADMIN") => {
    try {
      const updated = await changeRole(id, role);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to change role");
    }
  };

  const handleDelete = async (user: AdminUser) => {
    if (!confirm(`Delete user "${user.name}" and all their activities? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  if (!checked) return null;

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-[2rem] font-bold text-ink m-0">Admin · User Management</h2>
          <p className="text-muted m-0 text-[0.9rem]">{users.length} users</p>
        </div>
      </header>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="bg-white rounded-2xl shadow-card p-6">
        {loading ? (
          <p className="text-[#999] text-center py-6">Loading...</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-[#111] font-bold pb-4 border-b border-[#f0f0f0]">Name</th>
                <th className="text-left text-[#111] font-bold pb-4 border-b border-[#f0f0f0]">Email</th>
                <th className="text-left text-[#111] font-bold pb-4 border-b border-[#f0f0f0]">Role</th>
                <th className="text-left text-[#111] font-bold pb-4 border-b border-[#f0f0f0]">Activities</th>
                <th className="text-left text-[#111] font-bold pb-4 border-b border-[#f0f0f0]">Actions</th>
              </tr>
            </thead>
            <tbody className="[&>tr:last-child>td]:border-b-0">
              {users.map((u) => {
                const isSelf = u.id === myId;
                return (
                  <tr key={u.id}>
                    <td className="py-4 border-b border-[#f0f0f0] text-[#555] font-medium">
                      {u.name} {isSelf && <span className="text-[0.75rem] text-[#0ea960]">(you)</span>}
                    </td>
                    <td className="py-4 border-b border-[#f0f0f0] text-[#555]">{u.email}</td>
                    <td className="py-4 border-b border-[#f0f0f0]">
                      {isSelf ? (
                        <span className="inline-block px-3 py-1.5 rounded-lg bg-gray-100 text-muted text-sm font-semibold">
                          {u.role}
                        </span>
                      ) : (
                        <Select
                          value={u.role}
                          onChange={(v) => handleRoleChange(u.id, v as "USER" | "ADMIN")}
                          options={[
                            { label: "USER", value: "USER" },
                            { label: "ADMIN", value: "ADMIN" },
                          ]}
                          className="w-[120px]"
                        />
                      )}
                    </td>
                    <td className="py-4 border-b border-[#f0f0f0] text-[#555]">{u.activityCount}</td>
                    <td className="py-4 border-b border-[#f0f0f0]">
                      <button
                        onClick={() => handleDelete(u)}
                        disabled={isSelf}
                        className="flex items-center gap-1 text-[#c53030] hover:text-[#9b2c2c] disabled:text-[#ccc] disabled:cursor-not-allowed"
                        title={isSelf ? "You cannot delete yourself" : "Delete user"}
                      >
                        <MdDelete size={20} /> Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
