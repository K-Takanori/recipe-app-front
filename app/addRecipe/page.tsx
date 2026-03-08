"use client";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { addRecipe } from "@/app/api/recipeApi";
import { fetchIngredients } from "@/app/api/ingredientApi";
import BackButton from "@/components/BackButton";
import SearchableSelect from "@/components/SearchableSelect";

export default function AddRecipe() {
  const [foods, setFoods] = useState<string[]>([]);
  const [recipeName, setRecipeName] = useState("");
  const [recipeUrl, setRecipeUrl] = useState("");
  const [recipeInstructions, setRecipeInstructions] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    const loadIngredients = async () => {
      try {
        const ingredientsData = await fetchIngredients();
        const names = ingredientsData.map(item => item.name);
        setFoods(names);
      } catch (error) {
        console.error("Failed to load ingredients:", error);
      }
    };
    loadIngredients();
  }, []);

  const [addedFoods, setAddedFoods] = useState<string[]>([]);

  const addFood = () => {
    if (!selectedValue || !foods.includes(selectedValue)) return;
    setAddedFoods([...addedFoods, selectedValue]);
    setSelectedValue(""); // 追加したら入力をクリア
  };
  const removeFood = (foodToRemove: string) => {
    // 削除したい食材以外のものを残して、新しい配列を作成する
    setAddedFoods(addedFoods.filter((food) => food !== foodToRemove));
  };
  const handleSubmit = async () => {
    try {
      await addRecipe({
        name: recipeName,
        ingredients: addedFoods,
        url: recipeUrl || null,
        instructions: recipeInstructions || null,
      });
      alert(`${recipeName} を登録しました！`);
      inputReset();
    } catch (error) {
      console.error("Failed to add recipe:", error);
      alert("レシピの登録に失敗しました");
    }
  };
  const inputReset = () => {
    setRecipeName("");
    setRecipeUrl("");
    setRecipeInstructions("");
    setSelectedValue("");
    setAddedFoods([]);
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 max-w-2xl mx-auto w-full">
        <BackButton />
        <button
          onClick={handleSubmit}
          disabled={recipeName.trim() === "" || addedFoods.length === 0}
          className={`m-1 p-3 rounded-md font-bold transition w-1/4 min-w-[150px] ${
              recipeName.trim() === "" || addedFoods.length === 0
                  ? "bg-gray-300 cursor-not-allowed text-gray-500" // 無効時
                  : "bg-green-500 hover:bg-green-600 text-white"   // 有効時
          }`}
      >
          レシピを登録する
      </button>
        <div className="shadow-md m-2 p-2 bg-white rounded-md hover:shadow-xl hover:transition hover:-translate-y-1">
          <p>レシピ名：</p>
          <input
            type="text"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)} // 入力を反映
            className="w-full border border-gray-500 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="shadow-md m-2 p-2 bg-white rounded-md hover:shadow-xl hover:transition hover:-translate-y-1">
          <p>参考URL：</p>
          <input
            type="url"
            value={recipeUrl}
            onChange={(e) => setRecipeUrl(e.target.value)}
            placeholder="https://example.com/recipe (任意)"
            className="w-full border border-gray-500 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="shadow-md m-2 p-2 bg-white rounded-md hover:shadow-xl hover:transition hover:-translate-y-1">
          <p>作り方・メモ：</p>
          <textarea
            value={recipeInstructions}
            onChange={(e) => setRecipeInstructions(e.target.value)}
            placeholder="自由に記述できます (任意)"
            rows={4}
            className="w-full border border-gray-500 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-y"
          />
        </div>
        <div className="shadow-md m-2 p-2 bg-white rounded-md hover:shadow-xl hover:transition hover:-translate-y-1">
          <label>食材：</label>
          <div className="flex items-center mt-2">
            <div className="w-full max-w-xs">
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
              className={`px-4 py-2 ml-2 rounded-md whitespace-nowrap ${
                !selectedValue || !foods.includes(selectedValue) || addedFoods.includes(selectedValue)
                  ? "bg-gray-300 cursor-not-allowed" 
                  : "bg-blue-500 text-white hover:bg-blue-600" 
              }`}
            >
              追加
            </button>
          </div>
        </div>
        <div className="m-4">
          <h3 className="font-bold">追加された食材:</h3>
          {addedFoods.map((addedFood, index) => (
            <div key={index} className="flex justify-between items-center border-b py-2 max-w-sm">
              <span>{addedFood}</span>
              <button
                onClick={() => removeFood(addedFood)}
                className="text-red-500 hover:text-red-700 text-sm font-bold border border-red-500 px-2 py-1 rounded-md hover:bg-red-50 transition"
              >
                削除
              </button>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
