export interface Game {
  name: string;
  creatorName: string;
  price: number | null;
  desc: string;
  image: string;
  imageToken: string;
  universeId: number;
  placeId: number;
  totalUpVotes: number;
  totalDownVotes: number;
}
