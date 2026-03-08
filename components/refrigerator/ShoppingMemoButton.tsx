
import { ShoppingItem } from "@/types";

interface ShoppingMemoButtonProps {
  shoppingList: ShoppingItem[];
  onClick: () => void;
}

export default function ShoppingMemoButton({ shoppingList, onClick }: ShoppingMemoButtonProps) {
  return (
    <div className="flex justify-center py-4">
      <button 
        onClick={onClick}
        className="group relative bg-yellow-50 border-2 border-dashed border-yellow-300 p-6 shadow-md hover:shadow-xl transition-all transform hover:-rotate-1"
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-400 text-white px-3 py-0.5 rounded shadow-sm text-xs font-bold">
          SHOPPING MEMO 📌
        </div>
        <p className="text-yellow-800 font-bold flex items-center gap-2">
          📝 お買い物リストを見る
          <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
            {shoppingList.length}
          </span>
        </p>
      </button>
    </div>
  );
}
