import { Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import { JwtClaims } from "../models/jwt-claims.model";
import { UserInfo } from "../models/user-info.model";
import { BehaviorSubject } from "rxjs";


@Injectable({
  providedIn: "root",
})
export class SessionService {
  private storage: Storage = localStorage
  private tokenSubject = new BehaviorSubject<string | null>(null);
  token$ = this.tokenSubject.asObservable();
  token: string | null = null
  constructor() {
    this.token$.subscribe((token) => {
      this.token = token
    })
  }
  set(key: string, value: string): void {
    this.storage.setItem(key, value);
  }

  setToken(newToken: string): void {
    this.tokenSubject.next(newToken);
    this.set('token', newToken)
  }

  get(key: string): string | null {
    return this.storage.getItem(key);
  }

  clearSession(): void {
    this.storage.clear()
  }

  clearToken(): void {
    this.storage.removeItem('token')
    this.tokenSubject.next(null);
  }

  isAuthenticated(): boolean {
    return (
      this.isTokenValid(this.get('token')) &&
      this.isTokenExpired(this.get('token'))
    )
  }

  private isTokenValid(token: string | null): boolean {
    return token ? token.split('.').length === 3 : false
  }

  private isTokenExpired(token: string | null): boolean {
    try {
      const { exp } = this.getJwtClaims(token) || { exp: null }
      return !!exp && Date.now() < exp * 1000
    } catch {
      return false
    }
  }

  private getJwtClaims(token: string | null): JwtClaims | null {
    return token ? jwtDecode<JwtClaims>(token) : null
  }

  public getCurrentUser(): UserInfo | null {
    const { id, email, name, role } = this.getJwtClaims(this.token || this.get('token')) || {}
    return id && email && role ? { id, email, name, role } : null
  }
}
