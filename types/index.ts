export interface Game {
  name: string;
  creator: Creator;
  price: number | null;
  desc: string;
  universeId: number;
  placeId: number;
  image: string;
  
  sourceName: string;
  sourceDescription: string;
  allowedGearGenres: string[];
  allowedGearCategories: string[];
  isGenreEnforced: boolean;
  copyingAllowed: boolean;
  playing: number;
  visits: number;
  maxPlayers: number;
  created: string;
  updated: string;
  studioAccessToApisAllowed: boolean;
  createVipServersAllowed: boolean;
  universeAvatarType: string;
  genre: string;
  genre_l1: string;
  genre_l2: string;
  isAllGenre: boolean;
  isFavoritedByUser: boolean;
  favoritedCount: game.favoritedCount;
}         

export interface Creator {
  id: number;
  name: string;
  type: string;
  isRNVAccount: boolean;
  hasVerifiedBadge: boolean;
}
