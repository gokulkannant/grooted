import { apiUrl } from "@/utils/constants";

let invalidated = false;

export class TokenManager {
  static invalidate() {
    invalidated = true;
  }

  static isInvalidated() {
    return invalidated;
  }

  static revive() {
    invalidated = false;
  }

  static async refresh(refreshToken: string) {
    const response = await fetch(`${apiUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!response.ok) throw new Error("Unable to refresh session");
    const data = (await response.json()) as {
      accessToken: string;
      refreshToken: string;
    };
    this.revive();
    return data;
  }
}
