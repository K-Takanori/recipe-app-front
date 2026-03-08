"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { Ingredient } from "@/types";
import { fetchIngredients, createIngredient, deleteIngredient } from "@/app/api/ingredientApi";

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredientName, setNewIngredientName] = useState("");
  const [newIngredientCategory, setNewIngredientCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- アクセス制御とデータ取得 ---
  useEffect(() => {
    if (!isLoading && user && !user.is_staff) {
      // 管理者でない場合はトップページへリダイレクト
      router.replace("/");
      return;
    }

    if (user?.is_staff) {
      loadIngredients();
    }
  }, [user, isLoading, router]);

  const loadIngredients = async () => {
    try {
      const data = await fetchIngredients();
      setIngredients(data);
    } catch (err) {
      console.error("Failed to load ingredients", err);
      setError("食材データの取得に失敗しました。");
    }
  };

  // --- ハンドラー ---
  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngredientName.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const newItem = await createIngredient(
        newIngredientName.trim(), 
        newIngredientCategory.trim() || null
      );
      setIngredients([...ingredients, newItem]);
      setNewIngredientName("");
      setNewIngredientCategory("");
    } catch (err) {
      console.error("Failed to add ingredient", err);
      setError("食材の追加に失敗しました。名前が重複している可能性があります。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteIngredient = async (id: number) => {
    if (!window.confirm("この食材を削除してもよろしいですか？")) return;
    
    try {
      await deleteIngredient(id);
      setIngredients(ingredients.filter(ing => ing.id !== id));
    } catch (err) {
      console.error("Failed to delete ingredient", err);
      setError("食材の削除に失敗しました。");
    }
  };

  // ローディング中またはリダイレクト処理中
  if (isLoading || !user || !user.is_staff) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow p-4 max-w-3xl mx-auto w-full space-y-8">
        <BackButton />

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <span className="text-3xl">⚙️</span>
            <div>
              <h1 className="font-bold text-2xl text-gray-800">管理者設定</h1>
              <p className="text-gray-500 text-sm">システム共通の食材マスターデータを管理します。</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100 flex items-center gap-2">
              <span>⚠️</span>
              {error}
            </div>
          )}

          {/* 新規追加フォーム */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-8">
            <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="text-indigo-500">➕</span> 食材の新規登録
            </h2>
            <form onSubmit={handleAddIngredient} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="食材名 (例: にんじん)"
                value={newIngredientName}
                onChange={(e) => setNewIngredientName(e.target.value)}
                className="flex-grow border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                placeholder="カテゴリ (任意)"
                value={newIngredientCategory}
                onChange={(e) => setNewIngredientCategory(e.target.value)}
                className="w-full sm:w-1/3 border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={isSubmitting || !newIngredientName.trim()}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50 whitespace-nowrap"
              >
                {isSubmitting ? "登録中..." : "登録する"}
              </button>
            </form>
          </div>

          {/* 食材リスト */}
          <div>
            <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span>📋</span> 登録済み食材リスト ({ingredients.length}件)
            </h2>
            
            <div className="bg-white border rounded-xl overflow-hidden max-h-[500px] overflow-y-auto">
              {ingredients.length === 0 ? (
                <div className="p-8 text-center text-gray-500">食材が登録されていません。</div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {ingredients.slice().reverse().map(ing => (
                    <li key={ing.id} className="p-4 hover:bg-gray-50 flex justify-between items-center transition">
                      <div>
                        <span className="font-bold text-gray-800 text-lg mr-3">{ing.name}</span>
                        {ing.category && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full border">
                            {ing.category}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteIngredient(ing.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition"
                        title="この食材を削除"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
        </section>
      </main>
      <Footer />
    </div>
  );
}
