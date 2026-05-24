/** POST /schedules/{id}/items/from-place 의 place 객체 */
export type SchedulePlacePayload = {
  apiId: string;
  name: string;
  category?: string;
  address?: string;
  roadAddress?: string;
  phone?: string;
  latitude: number;
  longitude: number;
};
