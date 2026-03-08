"use client";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { FoodItem, Recipe } from "@/types";
import { fetchFoods, updateFood, deleteFood } from "@/app/api/foodApi";
import { fetchRecipes } from "@/app/api/recipeApi";
import RecipeCard from "@/components/RecipeCard";
import InventoryPanel from "@/components/InventoryPanel";
import BackButton from "@/components/BackButton";
import { useAuth } from "@/contexts/AuthContext";
import EditRecipeModal from "@/components/EditRecipeModal";

export default function ShowRecipe() {
  const { user: currentUser } = useAuth();
  const [inventory, setInventory] = useState<FoodItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

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

  const cookRecipe = async (recipe: Recipe) => {
    if (!confirm(`${recipe.name} を作りますか？`)) return;
    try {
      for (const item of inventory) {
        if (recipe.ingredients.includes(item.name)) {
          if (item.quantity > 1) {
            await updateFood(item.id, { quantity: item.quantity - 1 });
          } else {
            await deleteFood(item.id);
          }
        }
      }
      const latestFoods = await fetchFoods();
      setInventory(latestFoods);
      alert(`${recipe.name} 完成！在庫を更新しました。`);
    } catch (error) {
      console.error("Failed to cook recipe:", error);
      alert("在庫の更新に失敗しました。");
    }
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
  };

  const closeEditModal = () => {
    setEditingRecipe(null);
  };

  const handleRecipeUpdated = async () => {
    // レシピが更新されたら一覧を再取得
    try {
      const loadedRecipes = await fetchRecipes();
      setRecipes(loadedRecipes);
      closeEditModal();
    } catch (e) {
      console.error("Failed to reload recipes", e);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      {/* 2カラムレイアウト（PC時） */}
      <main className="flex-grow flex flex-col md:flex-row p-4 gap-6 max-w-6xl mx-auto w-full">
        
        {/* 左側：レシピ一覧 (メインコンテンツ) */}
        <div className="flex-grow space-y-6">
          <BackButton />
          <h1 className="text-2xl font-bold border-l-4 border-green-500 pl-4 mb-4">
            レシピ一覧
          </h1>

          <div className="grid gap-4">
            {recipes.map((recipe) => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                inventory={inventory} 
                cookRecipe={cookRecipe} 
                onEdit={handleEditRecipe}
                currentUser={currentUser}
              />
            ))}
          </div>
        </div>

        {/* 右側：冷蔵庫のミニパネル (サイドバー) */}
        <aside className="w-full md:w-64">
          <InventoryPanel inventory={inventory} />
        </aside>

      </main>

      <Footer />

      {/* 編集モーダル */}
      {editingRecipe && (
        <EditRecipeModal
          recipe={editingRecipe}
          onClose={closeEditModal}
          onUpdated={handleRecipeUpdated}
        />
      )}
    </div>
  );
}