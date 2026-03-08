"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { fetchRecipes } from "@/app/api/recipeApi";
import { fetchMealPlans, setMealPlan, deleteMealPlan, MealPlan } from "@/app/api/mealplanApi";
import { addShoppingItem } from "@/app/api/shoppingApi";
import { Recipe } from "@/types";

// --- ユーティリティ: 今週の月〜日を取得 ---
function getWeekDays(baseDate: Date): Date[] {
  const day = baseDate.getDay(); // 0=日, 1=月 ...
  const monday = new Date(baseDate);
  // 日曜日の場合は-6、それ以外は月曜日に合わせる
  monday.setDate(baseDate.getDate() - ((day === 0 ? 7 : day) - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function toDateStr(d: Date): string {
  return d.toISOString().split("T")[0];
}

const WEEKDAY_LABELS = ["月", "火", "水", "木", "金", "土", "日"];

export default function MealPlannerPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // モーダル状態
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // 週の更新
  useEffect(() => {
    const base = new Date();
    base.setDate(base.getDate() + weekOffset * 7);
    const days = getWeekDays(base);
    setWeekDays(days);
  }, [weekOffset]);

  // データ取得
  useEffect(() => {
    if (weekDays.length === 0) return;
    const start = toDateStr(weekDays[0]);
    const end = toDateStr(weekDays[6]);

    const loadData = async () => {
      setLoading(true);
      try {
        const [plans, recs] = await Promise.all([
          fetchMealPlans(start, end),
          fetchRecipes(),
        ]);
        setMealPlans(plans);
        setRecipes(recs);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [weekDays]);

  const getMealForDate = (dateStr: string) =>
    mealPlans.find((p) => p.date === dateStr) ?? null;

  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setIsModalOpen(true);
  };

  const handleSelectRecipe = async (recipe: Recipe) => {
    if (!selectedDate) return;
    setSaving(true);
    try {
      const plan = await setMealPlan(selectedDate, recipe.id);

      // 既存のお買い物に追加されていない食材だけ追加 (重複なし)
      for (const ing of recipe.ingredients) {
        try { await addShoppingItem(ing); } catch { /* 既存の場合は無視 */ }
      }

      setMealPlans((prev) => {
        const filtered = prev.filter((p) => p.date !== selectedDate);
        return [...filtered, plan];
      });
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMeal = async (plan: MealPlan) => {
    try {
      await deleteMealPlan(plan.id);
      setMealPlans((prev) => prev.filter((p) => p.id !== plan.id));
    } catch (e) {
      console.error(e);
    }
  };

  const today = toDateStr(new Date());

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      <main className="flex-grow p-4 max-w-5xl mx-auto w-full">
        <BackButton />

        {/* ヘッダーセクション */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">📅 献立カレンダー</h1>
            <p className="text-gray-500 text-sm mt-1">レシピを登録すると食材が自動でお買い物リストへ追加されます</p>
          </div>
          {/* 週ナビゲーション */}
          <div className="flex items-center gap-3 bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-2">
            <button
              onClick={() => setWeekOffset((o) => o - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 font-bold transition"
            >‹</button>
            <span className="text-sm font-bold text-gray-700 min-w-[120px] text-center">
              {weekDays.length > 0
                ? `${weekDays[0].getMonth() + 1}/${weekDays[0].getDate()} 〜 ${weekDays[6].getMonth() + 1}/${weekDays[6].getDate()}`
                : ""}
            </span>
            <button
              onClick={() => setWeekOffset((o) => o + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 font-bold transition"
            >›</button>
            {weekOffset !== 0 && (
              <button
                onClick={() => setWeekOffset(0)}
                className="text-xs text-blue-500 hover:text-blue-700 font-bold ml-1"
              >今週</button>
            )}
          </div>
        </div>

        {/* カレンダーグリッド */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-10 w-10 border-4 border-indigo-500 rounded-full border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {weekDays.map((day, idx) => {
              const dateStr = toDateStr(day);
              const meal = getMealForDate(dateStr);
              const isToday = dateStr === today;
              const isPast = dateStr < today;

              return (
                <div
                  key={dateStr}
                  className={`relative rounded-2xl border-2 transition-all flex flex-col min-h-[160px] overflow-hidden shadow-sm hover:shadow-md
                    ${isToday ? "border-indigo-400 shadow-indigo-100" : "border-gray-100"}
                    ${isPast && !isToday ? "opacity-70" : ""}
                    ${meal ? "bg-white" : "bg-white/60"}
                  `}
                >
                  {/* 日付ヘッダー */}
                  <div className={`px-3 pt-2 pb-1 flex justify-between items-center
                    ${isToday ? "bg-indigo-500 text-white" : "bg-gray-50 text-gray-600"}
                    ${idx === 5 ? "!text-blue-600" : ""}
                    ${idx === 6 ? "!text-red-500" : ""}
                    ${isToday && idx === 5 ? "!bg-blue-500" : ""}
                    ${isToday && idx === 6 ? "!bg-red-500" : ""}
                  `}>
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {WEEKDAY_LABELS[idx]}
                    </span>
                    <span className={`text-lg font-black leading-none ${isToday ? "text-white" : ""}`}>
                      {day.getDate()}
                    </span>
                  </div>

                  {/* レシピエリア */}
                  <div className="flex-grow p-2 flex flex-col justify-center">
                    {meal?.recipe ? (
                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-tight">
                          🍽️ {meal.recipe.name}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          食材 {meal.recipe.ingredients.length}品
                        </p>
                        <div className="flex gap-1 flex-wrap">
                          {meal.recipe.ingredients.slice(0, 3).map((ing, i) => (
                            <span key={i} className="text-[9px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded border border-green-100">
                              {ing}
                            </span>
                          ))}
                          {meal.recipe.ingredients.length > 3 && (
                            <span className="text-[9px] text-gray-400">+{meal.recipe.ingredients.length - 3}</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDayClick(dateStr)}
                        className="w-full h-full flex flex-col items-center justify-center gap-1 text-gray-300 hover:text-indigo-400 transition group"
                      >
                        <span className="text-2xl group-hover:scale-110 transition">＋</span>
                        <span className="text-[10px] font-bold">献立を登録</span>
                      </button>
                    )}
                  </div>

                  {/* アクションボタン（登録済みの場合） */}
                  {meal && (
                    <div className="flex border-t border-gray-50">
                      <button
                        onClick={() => handleDayClick(dateStr)}
                        className="flex-1 text-[10px] text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 py-1.5 font-bold transition"
                      >変更</button>
                      <button
                        onClick={() => handleRemoveMeal(meal)}
                        className="flex-1 text-[10px] text-gray-400 hover:text-red-500 hover:bg-red-50 py-1.5 font-bold transition border-l border-gray-50"
                      >削除</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 凡例 */}
        <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500"></div>今日</div>
          <div className="flex items-center gap-2"><span className="text-blue-500 font-bold">土</span>土曜日</div>
          <div className="flex items-center gap-2"><span className="text-red-500 font-bold">日</span>日曜日</div>
        </div>
      </main>

      {/* --- レシピ選択モーダル --- */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-50">
              <h2 className="text-xl font-black text-gray-800">レシピを選択</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {selectedDate} の献立
              </p>
            </div>

            <div className="overflow-y-auto flex-grow p-4 space-y-2">
              {recipes.length === 0 ? (
                <p className="text-center text-gray-400 py-8">レシピが登録されていません</p>
              ) : (
                recipes.map((recipe) => (
                  <button
                    key={recipe.id}
                    onClick={() => handleSelectRecipe(recipe)}
                    disabled={saving}
                    className="w-full text-left p-4 rounded-2xl border-2 border-gray-100 hover:border-indigo-300 hover:bg-indigo-50/30 transition group flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-gray-800 group-hover:text-indigo-600 transition">{recipe.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        食材: {recipe.ingredients.join("・")}
                      </p>
                    </div>
                    <span className="text-indigo-300 group-hover:text-indigo-500 text-xl transition">›</span>
                  </button>
                ))
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-50">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-3 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
