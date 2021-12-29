import Game from "./Game";
import TileManager from "./tile/TileManager";

export class Payload {
  game: Game;
  context: CanvasRenderingContext2D;
  tileManager: TileManager
  payloadSpawned: boolean;
  worldX: number;
  worldY: number;
  constructor(game: Game) {
    this.game = game;
    this.tileManager = game.tileManager;
    this.context = this.game.context;
    this.payloadSpawned = false;

    this.worldX = 0;
    this.worldY = 0;
  }
  spawnPayload() {
    if (this.payloadSpawned) return;
    this.payloadSpawned = true;
    this.worldX = this.tileManager.map?.payloadRoute[0].x!
    this.worldY = this.tileManager.map?.payloadRoute[0].y!
  }
  gameLoop(delta: number) {
    this.update();
    this.draw();

  }
  update() {
    if (this.tileManager.map) {
      this.spawnPayload();
    }
  }
  draw() {
    if (!this.tileManager.map) return;

    const width = 150;
    const height = 100;

    const screenX = (this.worldX * this.game.tileSize - width  + ( this.game.tileSize /2)) - this.game.player.worldX + this.game.player.screenX;
    const screenY = (this.worldY * this.game.tileSize - height + ( this.game.tileSize /2)) - this.game.player.worldY + this.game.player.screenY;

    this.context.fillStyle = "lightgray";
    this.context.fillRect(screenX, screenY, width, height)
  }
}   