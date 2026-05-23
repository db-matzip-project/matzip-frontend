import type { ApiUser, UserPreferenceItem } from '../api/types';
import type { PublicUser } from '../types/user';

export function mapApiUser(
  api: ApiUser,
  preferenceCodes: string[] = [],
): PublicUser {
  return {
    id: String(api.id),
    name: api.name,
    username: api.loginId,
    phone: api.phone,
    nickname: api.nickname,
    age: api.age,
    preferences: preferenceCodes,
  };
}

export function preferenceCodesFromApi(items: UserPreferenceItem[]): string[] {
  return items.map((p) => p.code);
}
