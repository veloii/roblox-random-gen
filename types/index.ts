export interface Game {
  name: string;
  creator: Creator;
  price: number | null;
  desc: string;
  universeId: number;
  placeId: number;
  image: string;
  stats: GameStats;
  sourceName: string;
  sourceDescription: string;
  allowedGearGenres: string[];
  allowedGearCategories: string[];
  isGenreEnforced: boolean;
  copyingAllowed: boolean;
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
  totalUpVotes?: number;
  totalDownVotes?: number;
}

export interface Creator {
  id: number;
  name: string;
  type: string;
  isRNVAccount: boolean;
  hasVerifiedBadge: boolean;
}

export interface GameStats {
  playing: number;
  visits: number;
  favoritedCount: number;
  maxPlayers: number;
  gamePasses?: number;
}
