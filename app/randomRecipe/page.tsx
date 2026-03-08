"use client";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { FoodItem, Recipe } from "@/types";
import { fetchFoods } from "@/app/api/foodApi";
import { fetchRecipes } from "@/app/api/recipeApi";

export default function RandomRecipePage() {
  const [inventory, setInventory] = useState<FoodItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const loadFoodsAndRecipes = async () => {
      try {
        const [foods, loadedRecipes] = await Promise.all([
          fetchFoods(),
          fetchRecipes()
        ]);
        setInventory(foods);
        setRecipes(loadedRecipes);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    loadFoodsAndRecipes();
  }, []);

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // 冷蔵庫にある食材で作れるレシピを抽出
  const cookableRecipes = recipes.filter((recipe) =>
    recipe.ingredients.every((ingName) =>
      inventory.some((item) => item.name === ingName && item.quantity > 0)
    )
  );

  // ランダムに1つ選ぶ
  const pickRandom = () => {
    if (cookableRecipes.length === 0) {
      setSelectedRecipe(null);
      return;
    }
    const randomIndex = Math.floor(Math.random() * cookableRecipes.length);
    setSelectedRecipe(cookableRecipes[randomIndex]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow p-4 max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-bold border-l-4 border-blue-500 pl-4 mb-6">
          🎲 ランダムレシピ
        </h1>

        {/* 冷蔵庫の中身サマリー */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 mb-6">
          <h2 className="font-bold text-blue-700 mb-2">🧊 冷蔵庫の食材</h2>
          <div className="flex flex-wrap gap-2">
            {inventory.map((item) => (
              <span
                key={item.id}
                className="bg-white text-sm px-3 py-1 rounded-full border border-blue-200 text-blue-800"
              >
                {item.name}（{item.quantity}個）
              </span>
            ))}
          </div>
        </div>

        {/* 作れるレシピ数 */}
        <div className="mb-6 text-center">
          <p className="text-gray-600 mb-4">
            作れるレシピ：
            <span className="font-bold text-lg text-green-600">
              {cookableRecipes.length}件
            </span>
            <span className="text-sm text-gray-400 ml-1">
              ／全{recipes.length}件
            </span>
          </p>

          <button
            onClick={pickRandom}
            disabled={cookableRecipes.length === 0}
            className={`px-8 py-3 rounded-lg font-bold text-lg transition shadow-md ${
              cookableRecipes.length > 0
                ? "bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg active:scale-95"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            🎲 ランダムに選ぶ
          </button>
        </div>

        {/* 選ばれたレシピの表示 */}
        {selectedRecipe && (
          <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-green-400 animate-bounce-once">
            <div className="text-center mb-4">
              <p className="text-sm text-green-600 font-bold mb-1">
                🎉 今日のレシピはこれ！
              </p>
              <h2 className="text-3xl font-bold text-gray-800">
                {selectedRecipe.name}
              </h2>
            </div>
            <div className="border-t pt-4">
              <h3 className="text-sm font-bold text-gray-500 mb-2">
                必要な食材
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedRecipe.ingredients.map((ing) => {
                  const inStock = inventory.some(
                    (item) => item.name === ing && item.quantity > 0
                  );
                  return (
                    <span
                      key={ing}
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${
                        inStock
                          ? "bg-green-50 border-green-300 text-green-700"
                          : "bg-red-50 border-red-300 text-red-700"
                      }`}
                    >
                      {inStock ? "✅" : "❌"} {ing}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 作れるレシピが0件のとき */}
        {cookableRecipes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400 text-lg">
              😢 今ある食材で作れるレシピがありません
            </p>
            <p className="text-gray-400 text-sm mt-2">
              食材を追加するか、新しいレシピを登録してみてください
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
