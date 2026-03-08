"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function TopPage() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      <main className="flex-grow p-6 max-w-4xl mx-auto w-full">
        <div className="mb-10 mt-4">
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">レシピ管理アプリ 🍱</h1>
          <p className="text-gray-500 mt-2">冷蔵庫・レシピ・献立をスマートに管理しましょう</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Link href="/refrigerator" className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-md border border-blue-100 hover:border-blue-300 transition-all flex items-center gap-5">
            <span className="text-4xl">🧊</span>
            <div>
              <h2 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition">冷蔵庫</h2>
              <p className="text-sm text-gray-500">在庫とお買い物リストを管理</p>
            </div>
          </Link>

          <Link href="/mealPlanner" className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-md border border-indigo-100 hover:border-indigo-300 transition-all flex items-center gap-5">
            <span className="text-4xl">📅</span>
            <div>
              <h2 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition">献立カレンダー</h2>
              <p className="text-sm text-gray-500">週間の献立を計画・管理</p>
            </div>
          </Link>

          <Link href="/showRecipe" className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-md border border-green-100 hover:border-green-300 transition-all flex items-center gap-5">
            <span className="text-4xl">📖</span>
            <div>
              <h2 className="text-lg font-bold text-gray-800 group-hover:text-green-600 transition">レシピ集</h2>
              <p className="text-sm text-gray-500">登録済みレシピを見て料理する</p>
            </div>
          </Link>

          <Link href="/suggestRecipe" className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-md border border-emerald-100 hover:border-emerald-300 transition-all flex items-center gap-5">
            <span className="text-4xl">✨</span>
            <div>
              <h2 className="text-lg font-bold text-gray-800 group-hover:text-emerald-600 transition">何作れる？</h2>
              <p className="text-sm text-gray-500">冷蔵庫の食材からレシピを提案</p>
            </div>
          </Link>

          <Link href="/addRecipe" className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-md border border-orange-100 hover:border-orange-300 transition-all flex items-center gap-5">
            <span className="text-4xl">➕</span>
            <div>
              <h2 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition">レシピ登録</h2>
              <p className="text-sm text-gray-500">新しいレシピを追加する</p>
            </div>
          </Link>
        </div>

        {/* 管理者専用メニュー（管理者の場合のみ表示） */}
        {user?.is_staff && (
          <div className="mt-12 mb-6">
            <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="text-purple-600">🛡️</span> 管理者メニュー
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Link href="/admin/users" className="group bg-purple-50 rounded-3xl p-6 shadow-sm hover:shadow-md border border-purple-200 hover:border-purple-400 transition-all flex items-center gap-5">
                <span className="text-4xl">👤</span>
                <div>
                  <h2 className="text-lg font-bold text-purple-900 group-hover:text-purple-700 transition">ユーザー管理</h2>
                  <p className="text-sm text-purple-700">ユーザー一覧と権限設定</p>
                </div>
              </Link>
              
              <Link href="/settings" className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-md border border-gray-200 hover:border-gray-400 transition-all flex items-center gap-5">
                <span className="text-4xl">⚙️</span>
                <div>
                  <h2 className="text-lg font-bold text-gray-800 group-hover:text-gray-600 transition">管理者設定</h2>
                  <p className="text-sm text-gray-500">食材マスターデータの管理</p>
                </div>
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
