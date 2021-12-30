import Tile from "../tile/Tile";

export interface Map {
  id: string;
  name: string;
  description: string;
  tiles: Tile[];
  layout: number[][];
  payloadRoute: Array<{x: number, y: number}>
}