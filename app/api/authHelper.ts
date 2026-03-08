"use client";

/**
 * APIリクエスト用のベースURL（Djangoバックエンドへ直接通信）
 */
// export const API_BASE_URL = "http://localhost:8000/api";
export const API_BASE_URL = "/api/proxy";

/**
 * クッキーから特定の設定値を取得するヘルパー関数
 */
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

/**
 * APIリクエスト用の共通ヘッダー（クッキー送信を含む）
 */
export const getRequestOptions = (method: string = "GET", body?: any) => {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    } as Record<string, string>,
    // Cookieを送信・受信するための重要な設定
    credentials: "include",
  };

  // CSRFが必要なメソッドの場合、Cookieからトークンを読み取ってヘッダーに付加する
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase())) {
    const csrfToken = getCookie("csrftoken");
    if (csrfToken) {
      (options.headers as Record<string, string>)["X-CSRFToken"] = csrfToken;
    }
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
};

// 以前の getAuthHeaders はレガシーとして残しておくか、移行を進める
export const getAuthHeaders = () => {
  return {
    "Content-Type": "application/json",
  };
};
