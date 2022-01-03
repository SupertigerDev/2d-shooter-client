import Game from "../common/Game";
import getMap from "../maps/FirstMap";
import { Map } from "../maps/Map";
import Tile from "./Tile";
export default class TileManager {
  game: Game;

  map: Map | null
  context: CanvasRenderingContext2D;

  constructor(game: Game) {
    this.game = game;
    this.context = this.game.context;
    // must have x and y coordinates


    this.map = null;
    this.loadMap();


  }
  async loadMap() {
    this.map = await getMap(this.game);
    this.draw();
  }
  getTileAtCords(x: number, y: number): Tile | undefined {
    const tiles = this.map?.tiles;
    const texture = this.map?.layout[y][x] || -1;
    if (texture === 0) return;
    return tiles?.[texture - 1]
  }
  gameLoop(delta: number){
    this.draw();
    this.update(delta);
  }
  update(delta: number){

  }
  draw() {
    if (!this.map) return;

    const columns = this.map.layout;
    for (let worldColumn = 0; worldColumn < columns.length; worldColumn++) {
      const rows = columns[worldColumn];
      for (let worldRow = 0; worldRow < rows.length; worldRow++) {
        const texture = rows[worldRow];
        const worldX = worldRow * this.game.tileSize;
        const worldY = worldColumn* this.game.tileSize;
        const screenX = worldX - this.game.player.worldX + this.game.player.screenX;
        const screenY = worldY - this.game.player.worldY + this.game.player.screenY;

        if (worldX + this.game.tileSize > this.game.player.worldX - this.game.player.screenX &&
            worldX - this.game.tileSize < this.game.player.worldX + this.game.player.screenX &&
            worldY + this.game.tileSize > this.game.player.worldY - this.game.player.screenY &&
            worldY - this.game.tileSize < this.game.player.worldY + this.game.player.screenY) {
          
          if (texture == 0) continue;

          this.context.drawImage(this.map.tiles[texture - 1].image!,screenX , screenY);
        }
      }
    }
  }
}