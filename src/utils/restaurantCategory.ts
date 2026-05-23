/** API/Kakao에서 오는 category 문자열과 UI 필터 라벨 매칭 */
const CATEGORY_ALIASES: Record<string, string[]> = {
  한식: ['한식', '한정식', '국밥', '찌개', '고기', '치킨', '분식', '족발', '보쌈'],
  일식: ['일식', '일본', '초밥', '스시', '라멘', '돈까스', '이자카야'],
  중식: ['중식', '중국', '짜장', '마라', '딤섬'],
  양식: ['양식', '이탈', '프랑', '스테이크', '파스타', '피자', '브런치'],
  채식: ['채식', '비건', '샐러드', '채식주'],
  디저트: ['디저트', '카페', '베이커리', '빵', '케이크', '커피', 'tea'],
};

export function matchesRestaurantCategory(
  apiCategory: string | null | undefined,
  filterCategory: string,
): boolean {
  if (filterCategory === '전체') return true;
  if (!apiCategory) return false;

  const haystack = apiCategory.replace(/\s/g, '').toLowerCase();
  const needle = filterCategory.replace(/\s/g, '').toLowerCase();

  if (haystack.includes(needle)) return true;

  const aliases = CATEGORY_ALIASES[filterCategory] ?? [];
  return aliases.some((alias) => haystack.includes(alias.toLowerCase()));
}
