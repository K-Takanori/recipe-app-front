
import { FoodItem } from "@/types";
import { useEffect, useState } from "react";
import { fetchIngredients } from "@/app/api/ingredientApi";
import SearchableSelect from "@/components/SearchableSelect";

interface DirectAddFormProps {
  onAdd: (item: Omit<FoodItem, "id">) => void;
}

export default function DirectAddForm({ onAdd }: DirectAddFormProps) {
  const [foods, setFoods] = useState<string[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemExpiry, setNewItemExpiry] = useState("");

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

  const handleAdd = () => {
    if (!newItemName || !newItemExpiry) return;
    onAdd({
      name: newItemName,
      quantity: newItemQuantity,
      expiryDate: newItemExpiry,
    });
    setNewItemName("");
    setNewItemExpiry("");
    setNewItemQuantity(1);
  };

  return (
    <section className="bg-white p-4 rounded-lg shadow-md border-t-4 border-blue-500">
      <h2 className="font-bold text-gray-700 mb-3">直接在庫を追加</h2>
      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="col-span-1 sm:col-span-1">
            <SearchableSelect
              options={foods}
              value={newItemName}
              onChange={setNewItemName}
              placeholder="食材名を検索・入力"
            />
          </div>
          <input 
            type="date" 
            value={newItemExpiry} 
            onChange={e => setNewItemExpiry(e.target.value)} 
            className="border p-2 rounded" 
          />
          <input 
            type="number" 
            min="1" 
            value={newItemQuantity} 
            onChange={e => setNewItemQuantity(Number(e.target.value))} 
            className="border p-2 rounded" 
          />
        </div>
        <button 
          onClick={handleAdd}
          className="w-full bg-blue-500 text-white py-2 rounded font-bold hover:bg-blue-600 transition"
        >
          冷蔵庫へ追加
        </button>
      </div>
    </section>
  );
}
