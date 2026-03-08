
import { ShoppingItem } from "@/types";
import { useEffect, useState } from "react";
import { fetchIngredients } from "@/app/api/ingredientApi";

interface ShoppingMemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  shoppingList: ShoppingItem[];
  onAddShoppingItem: (name: string) => void;
  onMoveToInventory: (item: ShoppingItem) => void;
}

export default function ShoppingMemoModal({
  isOpen,
  onClose,
  shoppingList,
  onAddShoppingItem,
  onMoveToInventory,
}: ShoppingMemoModalProps) {
  const [foods, setFoods] = useState<string[]>([]);
  const [newShoppingName, setNewShoppingName] = useState("");

  useEffect(() => {
    if (isOpen && foods.length === 0) {
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
    }
  }, [isOpen]);

  const handleAdd = () => {
    if (!newShoppingName.trim()) return;
    onAddShoppingItem(newShoppingName);
    setNewShoppingName("");
  };

  if (!isOpen) return null;

  return (
    <div 
      // 背景（オーバーレイ）部分
      onClick={onClose} 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div 
        // メモ帳（中身）部分
        onClick={(e) => e.stopPropagation()} 
        className="bg-yellow-50 w-full max-w-md p-8 rounded-sm shadow-2xl border-2 border-yellow-200 relative animate-in zoom-in-95 duration-200"
        style={{ backgroundImage: 'radial-gradient(#e5e7eb 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}
      >
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-yellow-700 hover:bg-yellow-200 p-2 rounded-full"
        >
          ✕ 閉じる
        </button>

        <h2 className="text-2xl font-bold text-yellow-900 mb-6 border-b-2 border-yellow-300 pb-2">お買い物メモ</h2>
        
        <div className="flex gap-2 mb-6 relative">
          <input
            list="shopping-foods-list"
            id="shopping-choice"
            name="shopping-choice"
            placeholder="何を買う？"
            value={newShoppingName}
            onChange={(e) => setNewShoppingName(e.target.value)}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) {
                return;
              }
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd();
              }
            }}
            className="flex-grow bg-transparent border-b border-yellow-400 outline-none p-2 text-lg text-yellow-900 placeholder:text-yellow-300"
            autoFocus
          />
          <datalist id="shopping-foods-list">
            {foods.map((food, index) => (
              <option key={index} value={food} />
            ))}
          </datalist>
          <button 
            onClick={handleAdd}
            className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded font-bold hover:bg-yellow-500 shadow-sm whitespace-nowrap"
          >
            追加
          </button>
        </div>

        <ul className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
          {shoppingList.map(item => (
            <li key={item.id} className="flex justify-between items-center border-b border-yellow-200 pb-2 italic text-lg text-gray-700">
              <span>・ {item.name}</span>
              <button 
                onClick={() => onMoveToInventory(item)}
                className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-sm hover:bg-green-600 transition"
              >
                買った！
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
