"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { API_BASE_URL, getRequestOptions } from "@/app/api/authHelper";

interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me/`, getRequestOptions());
      if (res.ok) {
        const userData = await res.json();
        // サーバーが { isAuthenticated: false } を返した場合は未ログイン扱い
        if (userData.isAuthenticated === false) {
          setUser(null);
        } else {
          setUser(userData);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    refreshUser();
  }, []);

  useEffect(() => {
    // マウント後かつ読み込み完了後に未ログインならリダイレクト
    if (isMounted && !isLoading && !user && pathname !== "/login") {
      router.replace("/login");
    }
  }, [isMounted, isLoading, user, pathname, router]);

  const login = (userData: User) => {
    setUser(userData);
    router.replace("/");
  };

  const logout = async () => {
    try {
      // サーバー側のCookieを確実に削除させる
      await fetch(`${API_BASE_URL}/auth/logout/`, getRequestOptions("POST"));
    } catch (err) {
      console.error("Logout API failed, proceeding with local logout", err);
    } finally {
      setUser(null);
      router.replace("/login");
    }
  };

  // -------------------------------------------------------------------------
  // Strict Sequential Guard Strategy:
  // 1. マウント前 (SSR & 初回ハイドレーション) は一貫してスピナーのみを返す。
  // 2. マウント後、認証状態に応じて「ログイン画面」「スピナー」「コンテンツ」を出し分ける。
  // これにより、ハイドレーションエラーを物理的に排除し、未認証時のデータ取得（APIエラー）も防ぐ。
  // -------------------------------------------------------------------------

  // 公開ページ判定 (末尾スラッシュの有無にかかわらず判定)
  const isLoginPage = pathname === "/login" || pathname === "/login/";

  // フェーズ1: 未マウント時（サーバー出力とクライアント初回出力を一致させる）
  if (!isMounted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold animate-pulse">セキュリティ確認中...</p>
      </div>
    );
  }

  // フェーズ2: マウント完了後
  
  // ログインページは常に表示
  if (isLoginPage) {
    return (
      <AuthContext.Provider value={{ user, login, logout, isLoading, refreshUser }}>
        {children}
      </AuthContext.Provider>
    );
  }

  // 保護ページで読み込み中、または未ログイン時
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold animate-pulse">認証を確認中...</p>
      </div>
    );
  }

  // 認証済みの場合のみ実コンテンツをレンダリング
  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
