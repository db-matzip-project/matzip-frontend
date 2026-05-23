import { apiClient } from './client';
import type { PreferenceCatalogItem, UserPreferenceItem } from './types';

export async function getPreferenceCatalogApi() {
  const { data } = await apiClient.get<PreferenceCatalogItem[]>('/api/v1/preferences');
  return data;
}

export async function getMyPreferencesApi() {
  const { data } = await apiClient.get<UserPreferenceItem[]>('/api/v1/preferences/me');
  return data;
}

export async function updateMyPreferencesApi(preferenceIds: number[]) {
  const { data } = await apiClient.put<UserPreferenceItem[]>('/api/v1/preferences/me', {
    preferenceIds,
  });
  return data;
}
