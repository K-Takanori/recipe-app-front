import { Recipe, FoodItem } from "@/types";

interface RecipeCardProps {
  recipe: Recipe;
  inventory: FoodItem[];
  cookRecipe: (recipe: Recipe) => void;
  onEdit?: (recipe: Recipe) => void;
  currentUser?: { id: number; is_staff: boolean } | null;
}

export default function RecipeCard({ recipe, inventory, cookRecipe, onEdit, currentUser }: RecipeCardProps) {
  const canCook = recipe.ingredients.every(ingName => 
    inventory.some(item => item.name === ingName && item.quantity > 0)
  );

  return (
    <div className={`p-5 rounded-xl shadow-md border-t-4 transition-all hover:shadow-lg ${
      canCook 
        ? "border-t-green-500 bg-green-50/30" 
        : "border-t-gray-200 bg-white"
    }`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-grow">
          <h2 className="text-xl font-bold text-gray-800">{recipe.name}</h2>
          <p className="text-xs text-gray-400 mt-1 mb-2 font-medium">投稿者: {recipe.username}</p>
          <div className="flex flex-wrap gap-1.5">
            {recipe.ingredients.map(ing => (
              <span key={ing} className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${
                inventory.some(i => i.name === ing) 
                  ? "border-green-200 text-green-600 bg-green-50" 
                  : "border-gray-200 text-gray-400 bg-gray-50"
              }`}>
                {ing}
              </span>
            ))}
          </div>

          {/* 追加された機能：URLと作り方 */}
          {(recipe.instructions || recipe.url) && (
            <div className="mt-4 p-3 bg-gray-50/50 rounded-lg border border-gray-100 text-sm">
              {recipe.instructions && (
                <div className="mb-2">
                  <h3 className="font-bold text-gray-700 mb-1 text-xs">📝 作り方・メモ</h3>
                  <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{recipe.instructions}</p>
                </div>
              )}
              {recipe.url && (
                <div>
                  <h3 className="font-bold text-gray-700 mb-1 text-xs">🔗 参考リンク</h3>
                  <a 
                    href={recipe.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-500 hover:text-blue-700 underline truncate block"
                  >
                    {recipe.url}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0">
          <button
            disabled={!canCook}
            onClick={() => cookRecipe(recipe)}
            className={`w-full px-6 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-all ${
              canCook 
                ? "bg-green-500 text-white hover:bg-green-600 active:scale-95" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {canCook ? "料理する" : "材料が足りません"}
          </button>

          {/* 編集ボタン (作成者本人か管理者のみ表示) */}
          {onEdit && currentUser && (currentUser.id === recipe.user || currentUser.is_staff) && (
            <button
              onClick={() => onEdit(recipe)}
              className="w-full px-6 py-2 rounded-lg font-bold text-xs shadow-sm transition-all bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              ✏️ レシピを編集
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
