export interface Game {
  name: string;
  creatorName: string;
  price: number;
  desc: string;
  universeId: number;
  placeId: number;
  image: string;
  stats: GameStats;
  totalUpVotes?: number;
  totalDownVotes?: number;
}

export interface GameStats {
  playing: number;
  visits: number;
  favorites: number;
  maxPlayers: number;
  created: string;
  updated: string;
  gamePasses: number;
}

