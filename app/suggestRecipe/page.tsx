"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchFoods } from "@/app/api/foodApi";
import { fetchRecipes } from "@/app/api/recipeApi";
import { addShoppingItem } from "@/app/api/shoppingApi";
import { Recipe } from "@/types";
import BackButton from "@/components/BackButton";

interface SuggestedRecipe extends Recipe {
  matchRate: number;
  availableIngredients: string[];
  missingIngredients: string[];
}

export default function SuggestRecipePage() {
  const [suggestedRecipes, setSuggestedRecipes] = useState<SuggestedRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [inventory, recipes] = await Promise.all([
          fetchFoods(),
          fetchRecipes()
        ]);

        const inventoryNames = new Set(inventory.map(f => f.name));

        const suggestions: SuggestedRecipe[] = recipes.map(recipe => {
          const available = recipe.ingredients.filter(ing => inventoryNames.has(ing));
          const missing = recipe.ingredients.filter(ing => !inventoryNames.has(ing));
          const rate = recipe.ingredients.length > 0 
            ? Math.round((available.length / recipe.ingredients.length) * 100) 
            : 0;

          return {
            ...recipe,
            matchRate: rate,
            availableIngredients: available,
            missingIngredients: missing,
          };
        });

        // 提案率が高い順にソート
        suggestions.sort((a, b) => b.matchRate - a.matchRate);
        setSuggestedRecipes(suggestions);
      } catch (error) {
        console.error("Failed to load suggestions:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddToShoppingList = async (ingredient: string) => {
    try {
      await addShoppingItem(ingredient);
      alert(`${ingredient} をお買い物リストに追加しました！`);
    } catch (error) {
      console.error("Failed to add to shopping list:", error);
      alert("追加に失敗しました");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow p-4 max-w-3xl mx-auto w-full">
        <BackButton />
        <h1 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-green-500 pl-3">
          冷蔵庫からのおすすめレシピ
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-10 w-10 border-4 border-green-500 rounded-full border-t-transparent"></div>
          </div>
        ) : suggestedRecipes.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">レシピがまだ登録されていません。</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestedRecipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col overflow-hidden group">
                <div className="p-6 flex-grow">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                    <h2 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">{recipe.name}</h2>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      recipe.matchRate === 100 ? "bg-green-100 text-green-700" : 
                      recipe.matchRate > 50 ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      一致率 {recipe.matchRate}%
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-50 pb-1">揃っている食材</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {recipe.availableIngredients.length > 0 ? (
                          recipe.availableIngredients.map((ing, i) => (
                            <span key={i} className="text-xs text-green-700 bg-green-50/50 px-2 py-1 rounded border border-green-100 shadow-sm">
                              {ing}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-300 italic">なし</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-50 pb-1">足りない食材</h3>
                      <div className="flex flex-wrap gap-2">
                        {recipe.missingIngredients.length > 0 ? (
                          recipe.missingIngredients.map((ing, i) => (
                            <div key={i} className="flex items-center gap-1">
                              <span className="text-xs text-red-500 bg-red-50/50 px-2 py-1 rounded border border-red-100 shadow-sm">
                                {ing}
                              </span>
                              <button 
                                onClick={() => handleAddToShoppingList(ing)}
                                className="bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-600 transition shadow-sm active:scale-90"
                                title="お買い物リストに追加"
                              >
                                <span className="text-sm font-bold">＋</span>
                              </button>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full">すべて揃っています！✨</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
