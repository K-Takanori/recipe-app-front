import Link from "next/link";

export default function Footer() {
    return (
      <footer className="bg-white border-t border-gray-100 py-8 mt-12 shadow-inner">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-6">
            <Link href="/" className="text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors">ホーム</Link>
            <Link href="/refrigerator" className="text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors">冷蔵庫</Link>
            <Link href="/showRecipe" className="text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors">レシピ集</Link>
            <Link href="/mealPlanner" className="text-indigo-500 hover:text-indigo-700 text-sm font-bold transition-colors">📅 献立</Link>
            <Link href="/suggestRecipe" className="text-gray-500 hover:text-green-600 text-sm font-bold transition-colors">何作れる？</Link>
          </div>
          <div className="border-t border-gray-50 pt-6">
            <p className="text-gray-400 text-center text-xs tracking-widest uppercase">© 2026 レシピ管理アプリ - taxapopo</p>
          </div>
        </div>
      </footer>
    );
  }
