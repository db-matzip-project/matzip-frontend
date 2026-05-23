export type PublicUser = {
  id: string;
  name: string;
  /** 로그인 아이디 (API loginId) */
  username: string;
  phone: string;
  nickname?: string;
  age?: number;
  /** 취향 코드 배열 (API preference code) */
  preferences: string[];
};
