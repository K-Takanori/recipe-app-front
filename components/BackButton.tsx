"use client";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold text-sm transition-all group mb-4"
    >
      <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full group-hover:bg-blue-100 transition-colors">
        ←
      </span>
      <span>戻る</span>
    </button>
  );
}
