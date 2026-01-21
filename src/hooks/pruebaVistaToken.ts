import { jwtDecode } from "jwt-decode";

export interface TokenInfo {
  sub: string;
  name: string;
  iat: number;
}

export const useToken = () => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30";
  
  try {
    const decoded = jwtDecode<TokenInfo>(token);
    return decoded;
  } catch (e) {
    return null;
  }
};