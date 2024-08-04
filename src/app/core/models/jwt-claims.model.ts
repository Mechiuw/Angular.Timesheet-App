import { UserInfo } from "./user-info.model";

interface JwtStandardClaims {
  iss?: string; // Issuer
  sub?: string; // Subject
  exp: number; // Expiration time (as a Unix timestamp)
  iat?: number; // Issued at (as a Unix timestamp)
  // Add any other standard JWT claims you might need
}

export interface JwtClaims extends JwtStandardClaims, UserInfo {}
