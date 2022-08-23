export interface ResponseWithCookie {
    accessToken?: string;
    refreshToken?: string;
    domain: string;
    path: string;
    httpOnly: boolean;
    maxAge: number;
    sameSite: boolean | "lax" | "strict" | "none";
    secure: boolean;
}