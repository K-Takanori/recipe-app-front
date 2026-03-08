"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* 左側：ロゴ */}
        <div className="flex-shrink-0">
          <Link href="/" className="text-orange-700 text-xl md:text-2xl font-bold underline decoration-wavy decoration-emerald-500 hover:text-orange-800 transition-colors whitespace-nowrap">
            レシピ管理アプリ 🍱
          </Link>
        </div>  
        
        <div className="hidden md:flex items-center gap-4 flex-grow justify-center px-4">
          <Link href="/refrigerator" className="font-bold text-blue-800 hover:text-blue-600 transition-colors">冷蔵庫</Link>
          <Link href="/addRecipe" className="font-bold text-blue-800 hover:text-blue-600 transition-colors">レシピ登録</Link>
          <Link href="/mealPlanner" className="font-bold text-indigo-800 hover:text-indigo-600 transition-colors">📅 献立</Link>
          <Link href="/suggestRecipe" className="font-bold text-green-800 hover:text-green-600 transition-colors">何作れる？</Link>
        </div>

        {/* ユーザー情報とログアウトボタン */}
        <div className="flex-shrink-0">
          {user && (
            <div className="flex items-center gap-2">
              <div className="bg-white/30 px-2 sm:px-3 py-1 rounded-lg border border-white/20">
                <span className="text-[10px] sm:text-xs font-bold text-blue-900 line-clamp-1">
                  {user.username}{user.is_staff ? " (管理)" : ""}
                </span>
              </div>
              <button 
                onClick={logout}
                className="text-[10px] sm:text-xs font-black text-red-600 bg-red-50 px-2 sm:px-3 py-1 rounded-full border border-red-200 hover:bg-red-100 transition shadow-sm whitespace-nowrap"
              >
                ログアウト
              </button>
            </div>
          )}
        </div>
      </div>
        
      {/* スマホ用下部ナビゲーション (画面が小さい時だけ表示) */}
      <div className="md:hidden bg-white border-t border-gray-100 fixed bottom-0 w-full z-40 overflow-x-auto">
        <div className="flex items-center gap-2 p-2 min-w-max px-4 mx-auto justify-start sm:justify-center flex-nowrap">
          <Link href="/refrigerator" className="whitespace-nowrap text-xs md:text-sm font-bold text-blue-800 hover:text-blue-900 bg-blue-50/50 px-3 py-1.5 rounded-full border border-blue-200 shadow-sm">冷蔵庫</Link>
          <Link href="/addRecipe" className="whitespace-nowrap text-xs md:text-sm font-bold text-blue-800 hover:text-blue-900 bg-blue-50/50 px-3 py-1.5 rounded-full border border-blue-200 shadow-sm">レシピ登録</Link>
          <Link href="/mealPlanner" className="whitespace-nowrap text-xs md:text-sm font-bold text-indigo-800 hover:text-indigo-900 bg-indigo-100 px-3 py-1.5 rounded-full border border-indigo-200 shadow-sm">📅 献立</Link>
          <Link href="/suggestRecipe" className="whitespace-nowrap text-xs md:text-sm font-bold text-green-800 hover:text-green-900 bg-green-100 px-3 py-1.5 rounded-full border border-green-200 shadow-sm">何作れる？</Link>
        </div>
      </div>
    </header>
  );
}
