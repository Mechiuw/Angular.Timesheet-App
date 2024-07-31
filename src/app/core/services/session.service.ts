import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SessionService {
  constructor(private readonly storage: Storage = sessionStorage) {}
  set(key: string, value: string): void {
    this.storage.setItem(key, value);
  }

  get(key: string): string | null {
    return this.storage.getItem(key);
  }

  isAuthenticated(): boolean {
    return this.isTokenValid(this.get("token"));
  }

  isTokenValid(token: string | null): boolean {
    return token ? token.split(".").length === 3 : false;
  }

  // getCllaim(): string | null {
    
  // }
}
