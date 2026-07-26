import type { DevUtilityId } from "./registry";

export interface DevUtilityPreferences {
  favorites: DevUtilityId[];
  recent: DevUtilityId[];
}

export interface ToggleFavoriteResponse {
  utilityId: DevUtilityId;
  isFavorite: boolean;
}

export interface TrackRecentResponse {
  utilityId: DevUtilityId;
  recent: DevUtilityId[];
}
