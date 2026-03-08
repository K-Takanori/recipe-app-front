"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { API_BASE_URL, getRequestOptions } from "@/app/api/authHelper";
import { deleteUser } from "@/app/api/userApi";

interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
}

export default function UserManagementPage() {
  const { user, isLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // 新規ユーザー用フォーム
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newIsStaff, setNewIsStaff] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user || !user.is_staff) {
        setError("このページにアクセスする権限がありません。");
        setLoading(false);
        return;
      }
      fetchUsers();
    }
  }, [user, isLoading]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/users/`, getRequestOptions());
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        setError("ユーザーリストの取得に失敗しました。");
      }
    } catch {
      setError("ネットワークエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    setFormSuccess("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register/`, getRequestOptions('POST', {
        username: newUsername,
        password: newPassword,
        is_staff: newIsStaff,
      }));

      const data = await res.json();

      if (res.ok) {
        setFormSuccess("ユーザーを作成しました！");
        setNewUsername("");
        setNewPassword("");
        setNewIsStaff(false);
        fetchUsers(); // リスト更新
      } else {
        // パスワードバリデーションエラーなどは配列で返ってくる可能性があるため処理
        const errorMsg = Array.isArray(data.error) ? data.error.join("\n") : (data.error || "作成に失敗しました。");
        setFormError(errorMsg);
      }
    } catch {
      setFormError("接続エラーが発生しました。");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (targetUserId: number) => {
    if (targetUserId === 1) {
      alert("保護された管理者(ID:1)は削除できません。");
      return;
    }
    // 自分自身の削除警告
    if (targetUserId === user?.id) {
      if (!window.confirm("警告: あなた自身のアカウントを削除しようとしています。本当に削除してよろしいですか？")) return;
    } else {
      if (!window.confirm("このユーザーを完全に削除してもよろしいですか？（この操作は取り消せません）")) return;
    }

    try {
      await deleteUser(targetUserId);
      setUsers(users.filter(u => u.id !== targetUserId));
    } catch (err: any) {
      console.error("Failed to delete user", err);
      // alert or set error
      setFormError(err.message || "ユーザーの削除に失敗しました。");
    }
  };

  if (isLoading || loading) return <div className="p-8 text-center font-bold">読み込み中...</div>;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="p-6 max-w-4xl mx-auto">
          <div className="bg-red-50 text-red-600 p-6 rounded-3xl border border-red-100 font-bold">
            {error}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Header />
      <main className="flex-grow p-4 sm:p-8 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">ユーザー管理</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側: 新規作成フォーム */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-2xl">👤</span> 新規ユーザー作成
              </h2>

              <form onSubmit={handleCreateUser} className="space-y-4">
                {formError && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100 italic whitespace-pre-wrap">
                    {formError}
                  </div>
                )}
                {formSuccess && (
                  <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-xs font-bold border border-green-100 italic">
                    {formSuccess}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">ユーザー名</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white p-3 rounded-2xl outline-none transition-all font-bold text-sm"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">パスワード</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white p-3 rounded-2xl outline-none transition-all font-bold text-sm"
                    required
                  />
                </div>

                <div className="flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    id="is_staff"
                    checked={newIsStaff}
                    onChange={(e) => setNewIsStaff(e.target.checked)}
                    className="w-5 h-5 accent-indigo-600 rounded-lg"
                  />
                  <label htmlFor="is_staff" className="text-sm font-bold text-gray-600 cursor-pointer">
                    管理者権限を付与
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all active:scale-95 ${
                    submitting ? "bg-gray-300" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
                  }`}
                >
                  {submitting ? "作成中..." : "ユーザーを作成"}
                </button>
              </form>
            </div>
          </div>

          {/* 右側: ユーザー一覧 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <h2 className="text-xl font-bold text-gray-800">登録済みユーザー</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">ID</th>
                      <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">ユーザー名</th>
                      <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">権限</th>
                      <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-gray-400">#{u.id}</td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-800">{u.username}</span>
                          <div className="text-[10px] text-gray-400">{u.email || "メール未設定"}</div>
                        </td>
                        <td className="px-6 py-4">
                          {u.is_staff ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-50 text-purple-600 border border-purple-100">
                              ADMIN
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-50 text-blue-600 border border-blue-100">
                              USER
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={u.id === 1}
                            className={`p-2 rounded-full transition ${
                              u.id === 1 
                                ? "text-gray-300 cursor-not-allowed" 
                                : "text-red-500 hover:text-red-700 hover:bg-red-50"
                            }`}
                            title={u.id === 1 ? "保護された管理者は削除できません" : "このユーザーを削除"}
                          >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
