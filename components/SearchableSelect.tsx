import React, { useState, useEffect, useRef } from "react";

interface SearchableSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "検索・選択...",
  className = "",
  disabled = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 外部クリックで閉じる処理
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 選択肢が更新されたら検索欄にセット
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <input
        type="text"
        disabled={disabled}
        value={searchTerm}
        className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-8 bg-white disabled:bg-gray-100 disabled:text-gray-500"
        placeholder={placeholder}
        onClick={() => !disabled && setIsOpen(true)}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
          onChange(e.target.value); // 入力中も値を親へ送る(自由入力として扱うか検索用として扱うかは親次第)
        }}
      />
      {/* 🔽 アイコン */}
      <div 
        className="absolute right-3 top-3 text-gray-400 pointer-events-none"
      >
         ▼
      </div>

      {isOpen && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 shadow-lg max-h-60 mt-1 rounded-md overflow-auto py-1 text-sm">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-700"
                onClick={() => {
                  onChange(option);
                  setSearchTerm(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-400">見つかりません</li>
          )}
        </ul>
      )}
    </div>
  );
}
