"use client";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { FoodItem, ShoppingItem } from "@/types";
import ShoppingMemoButton from "@/components/refrigerator/ShoppingMemoButton";
import ShoppingMemoModal from "@/components/refrigerator/ShoppingMemoModal";
import DirectAddForm from "@/components/refrigerator/DirectAddForm";
import RefrigeratorList from "@/components/refrigerator/RefrigeratorList";
import { fetchFoods, addFood, updateFood, deleteFood } from "@/app/api/foodApi";
import { fetchShoppingItems, addShoppingItem as addShoppingItemApi, deleteShoppingItem } from "@/app/api/shoppingApi";
import BackButton from "@/components/BackButton";

export default function RefrigeratorPage() {
  // --- 状態管理 (State) ---
  const [inventory, setInventory] = useState<FoodItem[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  
  const [isShoppingModalOpen, setIsShoppingModalOpen] = useState(false);

  // --- 初期データ取得 ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const [foods, shoppingItems] = await Promise.all([
          fetchFoods(),
          fetchShoppingItems()
        ]);
        setInventory(foods);
        setShoppingList(shoppingItems);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    loadData();
  }, []);

  // --- 関数 (Functions) ---
  
  // 個数の増減
  const updateQuantity = async (id: number, delta: number) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + delta);
    try {
      const updatedItem = await updateFood(id, { quantity: newQuantity });
      setInventory(inventory.map(i => i.id === id ? updatedItem : i));
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  // 買い物リストから冷蔵庫へ移動
  const moveToInventory = async (item: ShoppingItem) => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    try {
      // 冷蔵庫に追加
      const addedItem = await addFood({
        name: item.name,
        quantity: 1,
        expiryDate: nextWeek.toISOString().split("T")[0],
      });
      setInventory([...inventory, addedItem]);
      
      // 買い物リストから削除 (バックエンド)
      await deleteShoppingItem(item.id);
      setShoppingList(shoppingList.filter((i) => i.id !== item.id));
    } catch (error) {
      console.error("Failed to move to inventory:", error);
    }
  };

  const updateExpiryDate = async (id: number, newDate: string) => {
    try {
      const updatedItem = await updateFood(id, { expiryDate: newDate });
      setInventory(inventory.map(item => 
        item.id === id ? updatedItem : item
      ));
    } catch (error) {
      console.error("Failed to update expiry date:", error);
    }
  };

  const addShoppingItem = async (name: string) => {
    try {
      const newItem = await addShoppingItemApi(name);
      setShoppingList([...shoppingList, newItem]);
    } catch (error) {
      console.error("Failed to add shopping item:", error);
    }
  };

  const addToInventory = async (item: Omit<FoodItem, "id">) => {
    try {
      const addedItem = await addFood(item);
      setInventory([...inventory, addedItem]);
    } catch (error) {
      console.error("Failed to add to inventory:", error);
    }
  };

  const deleteFromInventory = async (id: number) => {
    try {
      await deleteFood(id);
      setInventory(inventory.filter(i => i.id !== id));
    } catch (error) {
      console.error("Failed to delete from inventory:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow p-4 max-w-2xl mx-auto w-full space-y-8">
        <BackButton />
        
        {/* --- 買い物メモを開くボタン --- */}
        <ShoppingMemoButton 
          shoppingList={shoppingList} 
          onClick={() => setIsShoppingModalOpen(true)} 
        />

        {/* --- お買い物メモ モーダル --- */}
        <ShoppingMemoModal
          isOpen={isShoppingModalOpen}
          onClose={() => setIsShoppingModalOpen(false)}
          shoppingList={shoppingList}
          onAddShoppingItem={addShoppingItem}
          onMoveToInventory={moveToInventory}
        />

        {/* 2. 直接在庫を追加セクション */}
        <DirectAddForm onAdd={addToInventory} />

        {/* 3. 在庫リストセクション */}
        <RefrigeratorList
          inventory={inventory}
          onUpdateQuantity={updateQuantity}
          onUpdateExpiry={updateExpiryDate}
          onDelete={deleteFromInventory}
        />

      </main>
      <Footer />
    </div>
  );
}