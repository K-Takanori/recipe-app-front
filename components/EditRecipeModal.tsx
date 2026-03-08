import React, { useState, useEffect } from "react";
import { Recipe } from "@/types";
import { fetchIngredients } from "@/app/api/ingredientApi";
import { updateRecipe } from "@/app/api/recipeApi";
import SearchableSelect from "@/components/SearchableSelect";

interface EditRecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditRecipeModal({ recipe, onClose, onUpdated }: EditRecipeModalProps) {
  const [recipeName, setRecipeName] = useState(recipe.name);
  const [recipeUrl, setRecipeUrl] = useState(recipe.url || "");
  const [recipeInstructions, setRecipeInstructions] = useState(recipe.instructions || "");
  const [addedFoods, setAddedFoods] = useState<string[]>(recipe.ingredients);
  
  const [foods, setFoods] = useState<string[]>([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadIngredients = async () => {
      try {
        const ingredientsData = await fetchIngredients();
        setFoods(ingredientsData.map((item) => item.name));
      } catch (error) {
        console.error("Failed to load ingredients:", error);
      }
    };
    loadIngredients();
  }, []);

  const addFood = () => {
    if (!selectedValue || !foods.includes(selectedValue) || addedFoods.includes(selectedValue)) return;
    setAddedFoods([...addedFoods, selectedValue]);
    setSelectedValue("");
  };

  const removeFood = (foodToRemove: string) => {
    setAddedFoods(addedFoods.filter((food) => food !== foodToRemove));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await updateRecipe(recipe.id, {
        name: recipeName,
        ingredients: addedFoods,
        url: recipeUrl || null,
        instructions: recipeInstructions || null,
      });
      alert(`「${recipeName}」を更新しました！`);
      onUpdated();
    } catch (error) {
      console.error("Failed to update recipe:", error);
      alert("更新に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">レシピを編集</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-grow space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">レシピ名 <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">参考URL</label>
            <input
              type="url"
              value={recipeUrl}
              onChange={(e) => setRecipeUrl(e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">作り方・メモ</label>
            <textarea
              value={recipeInstructions}
              onChange={(e) => setRecipeInstructions(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-2">食材 <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <div className="flex-grow min-w-0">
                <SearchableSelect
                  options={foods}
                  value={selectedValue}
                  onChange={setSelectedValue}
                  placeholder="食材を選択してください..."
                />
              </div>
              <button
                onClick={addFood}
                disabled={!selectedValue || !foods.includes(selectedValue) || addedFoods.includes(selectedValue)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition"
              >
                追加
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {addedFoods.map((food, index) => (
                <div key={index} className="flex items-center gap-1 bg-white border border-gray-200 pl-3 pr-1 py-1 rounded-full text-sm font-medium shadow-sm">
                  {food}
                  <button
                    onClick={() => removeFood(food)}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full w-5 h-5 flex items-center justify-center transition"
                  >
                    &times;
                  </button>
                </div>
              ))}
              {addedFoods.length === 0 && <span className="text-sm text-gray-400">食材が追加されていません</span>}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg font-bold text-gray-600 hover:bg-gray-200 transition">
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || recipeName.trim() === "" || addedFoods.length === 0}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold shadow-sm hover:bg-blue-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? "保存中..." : "保存する"}
          </button>
        </div>
      </div>
    </div>
  );
}
