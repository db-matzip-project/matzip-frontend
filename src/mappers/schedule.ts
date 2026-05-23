import type { ScheduleDetail, ScheduleListItem } from '../api/types';
import { mapApiRestaurant } from './restaurant';
import type { Schedule, ScheduleItem } from '../types/schedule';

export function mapScheduleListItem(item: ScheduleListItem): Schedule {
  return {
    id: String(item.id),
    title: item.title,
    date: item.travelDate,
    memo: '',
    restaurantIds: [],
    items: [],
    createdAt: item.createdAt,
    itemCount: item.itemCount,
  };
}

export function mapScheduleDetail(detail: ScheduleDetail): Schedule {
  const sortedItems = [...detail.items].sort((a, b) => a.visitOrder - b.visitOrder);
  const items: ScheduleItem[] = sortedItems.map((item) => {
    mapApiRestaurant(item.restaurant);
    return {
      itemId: item.itemId,
      restaurantId: String(item.restaurant.id),
      visitOrder: item.visitOrder,
      memo: item.memo,
    };
  });

  return {
    id: String(detail.id),
    title: detail.title,
    date: detail.travelDate,
    memo: '',
    restaurantIds: items.map((i) => i.restaurantId),
    items,
    createdAt: detail.createdAt,
  };
}
