
import { FoodItem } from "@/types";

interface RefrigeratorListProps {
  inventory: FoodItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onUpdateExpiry: (id: number, date: string) => void;
  onDelete: (id: number) => void;
}

export default function RefrigeratorList({ 
  inventory, 
  onUpdateQuantity,
  onUpdateExpiry,
  onDelete 
}: RefrigeratorListProps) {
  const today = new Date().toISOString().split("T")[0];

  const getExpiryStatus = (dateStr: string) => {
    const expiry = new Date(dateStr);
    const now = new Date(today);
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "expired";
    if (diffDays <= 3) return "warning";
    return "normal";
  };

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <span>🧊</span> 冷蔵庫の中身（期限順）
      </h2>
      {[...inventory].sort((a,b) => a.expiryDate.localeCompare(b.expiryDate)).map((item) => {
        const status = getExpiryStatus(item.expiryDate);
        const cardClass = status === "expired" ? "border-red-500 bg-red-50" : status === "warning" ? "border-yellow-500 bg-yellow-50" : "border-blue-300 bg-white";
        
        return (
          <div key={item.id} className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg border-l-8 shadow-sm transition-all ${cardClass}`}>
            <div className="mb-2 sm:mb-0">
              <div className="font-bold text-lg">{item.name}</div>
                {/* --- ここを期限変更可能に修正 --- */}
                <div className="flex items-center gap-1 mt-1">
                <span className={`text-xs font-semibold ${status === "expired" ? "text-red-600" : "text-gray-500"}`}>
                  期限:
                </span>
                <input
                  type="date"
                  value={item.expiryDate}
                  onChange={(e) => onUpdateExpiry(item.id, e.target.value)}
                  className={`text-xs p-1 rounded border border-gray-200 focus:ring-1 focus:ring-blue-400 outline-none bg-transparent ${status === "expired" ? "text-red-600 font-bold" : "text-gray-600"}`}
                />
                {status === "expired" && <span className="text-[10px] text-red-600 font-bold ml-1">！</span>}
              </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              {/* 個数コントロール */}
              <div className="flex items-center border rounded bg-white shadow-sm overflow-hidden">
                <button onClick={() => onUpdateQuantity(item.id, -1)} className="px-3 py-1 bg-gray-100 hover:bg-gray-200">-</button>
                <span className="px-4 font-mono font-bold">{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.id, 1)} className="px-3 py-1 bg-gray-100 hover:bg-gray-200">+</button>
              </div>
              
              <button 
                onClick={() => onDelete(item.id)} 
                className="text-gray-400 hover:text-red-500 text-sm font-bold transition-colors"
              >
                使い切った
              </button>
            </div>
          </div>
        );
      })}
      {inventory.length === 0 && <p className="text-center text-gray-400 py-10">冷蔵庫が空っぽです 🧊</p>}
    </section>
  );
}
