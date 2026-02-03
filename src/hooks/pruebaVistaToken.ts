import { jwtDecode } from "jwt-decode";

export interface TokenInfo {
  sub: string;
  name: string;
  iat: number;
}

export const useToken = () => {
  const token = "__TOKEN__";
  
  try {
    const decoded = jwtDecode<TokenInfo>(token);
    return decoded;
  } catch (e) {
    return null;
  }
};
