"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL, getRequestOptions } from "@/app/api/authHelper";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 外部URL(8000)ではなく、自身のプロキシURL(/api/proxy)を叩く
      // 常に末尾のスラッシュを明示的に含める（Djangoの規約に合わせる）
      const res = await fetch(`${API_BASE_URL}/auth/login/`, getRequestOptions('POST', { 
        username, 
        password 
      }));

      // JSONとしてパースを試みるが、失敗した場合はレスポンスコードで判定
      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (res.ok) {
        login(data.user);
      } else {
        // エラー内容があれば表示、なければステータスコードから推測
        const errorMsg = data?.error || data?.detail || `エラーが発生しました (Status: ${res.status})`;
        setError(errorMsg);
      }
    } catch (err) {
      setError("サーバーに接続できません。バックエンドが起動しているか確認してください。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-md border border-white/50 backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <span className="text-4xl">🍳</span>
          </div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">おかえりなさい</h1>
          <p className="text-gray-500 mt-2">レシピ管理アプリにログイン</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 animate-shake whitespace-pre-wrap">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">ユーザー名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white p-4 rounded-2xl outline-none transition-all text-gray-800 font-bold"
              placeholder="admin"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white p-4 rounded-2xl outline-none transition-all text-gray-800 font-bold"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all active:scale-95 ${
              loading 
                ? "bg-gray-300 cursor-not-allowed" 
                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
            }`}
          >
            {loading ? "認証中..." : "ログイン"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 font-bold">
            アカウントをお持ちでない場合は、管理者に問い合わせてください。
          </p>
        </div>
      </div>
    </div>
  );
}
