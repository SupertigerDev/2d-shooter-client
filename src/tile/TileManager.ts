import Game from "../Game";
import getMap from "../maps/FirstMap";
import { Map } from "../maps/Map";
export default class TileManager {
  game: Game;
  follow: any;
  lastFollowX: any;
  lastFollowY: any;
  map: Map | null
  context: CanvasRenderingContext2D;

  constructor(game: Game, follow: any) {
    this.game = game;
    this.context = this.game.context;
    // must have x and y coordinates
    this.follow = follow;

    this.lastFollowX = this.follow.x;
    this.lastFollowY = this.follow.y;
    this.map = null;
    this.loadMap();


  }
  async loadMap() {
    this.map = await getMap(this.game);
    this.draw();
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

          this.context.drawImage(this.map.tiles[texture].image!,screenX , screenY);
        }
      }
    }
  }
}