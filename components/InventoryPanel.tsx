import { FoodItem } from "@/types";

interface InventoryPanelProps {
  inventory: FoodItem[];
}

export default function InventoryPanel({ inventory }: InventoryPanelProps) {
  return (
    <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-100 sticky top-4 shadow-md">
      <h2 className="font-bold text-blue-700 mb-4 flex items-center gap-2">
        <span>🧊</span> 現在の冷蔵庫
      </h2>
      <div className="space-y-2">
        {inventory.length > 0 ? (
          inventory.map(item => (
            <div key={item.id} className="flex justify-between items-center bg-white p-2 rounded border border-blue-100 text-sm shadow-sm">
              <span className="font-medium text-gray-700">{item.name}</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold text-xs">
                {item.quantity}個
              </span>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-400 italic">空っぽです</p>
        )}
      </div>
      <p className="mt-4 text-[10px] text-blue-400 text-center">
        ※料理するとここから自動で減ります
      </p>
    </div>
  );
}
