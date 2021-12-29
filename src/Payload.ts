import Game from "./Game";
import TileManager from "./tile/TileManager";

export class Payload {
  game: Game;
  context: CanvasRenderingContext2D;
  tileManager: TileManager
  payloadSpawned: boolean;
  x: number;
  y: number;
  height: number;
  width: number;
  pushing: boolean;
  constructor(game: Game) {
    this.game = game;
    this.tileManager = game.tileManager;
    this.context = this.game.context;
    this.payloadSpawned = false;

    this.width = 150;
    this.height = 100;

    this.x = 0;
    this.y = 0;
    this.pushing = false;
  }
  spawnPayload() {
    if (this.payloadSpawned) return;
    this.payloadSpawned = true;
    this.x = this.tileManager.map?.payloadRoute[0].x!
    this.y = this.tileManager.map?.payloadRoute[0].y!
  }
  gameLoop(delta: number) {
    this.update();
    this.draw();

  }
  update() {
    if (!this.tileManager.map) return;
    this.spawnPayload();     
    this.pushPayload()
  }
  pushPayload() {
    const player = this.game.player;

    const worldX = this.x * this.game.tileSize - (this.width /2) + (player.size / 2)
    const worldY = this.y * this.game.tileSize - (this.height/2) + (player.size / 2)

    const xRadius = 150;
    const yRadius = 120;
    // check if player is near the payload
    const xDistance = Math.abs(player.worldX - worldX);
    const yDistance = Math.abs(player.worldY - worldY);

    this.pushing = false;
    if (xDistance <= xRadius && yDistance <= yRadius) {
      this.pushing = true;
    }
  }
  draw() {
    if (!this.tileManager.map) return;


    const worldX = this.x * this.game.tileSize
    const worldY = this.y * this.game.tileSize

    const screenX = (worldX - this.width  + (this.game.tileSize /2)) - this.game.player.worldX + this.game.player.screenX;
    const screenY = (worldY - this.height + (this.game.tileSize /2)) - this.game.player.worldY + this.game.player.screenY;

    this.context.fillStyle = "lightgray";
    if (this.pushing) {
      this.context.fillStyle = "red";

    }
    this.context.fillRect(screenX, screenY, this.width, this.height)
  }
}   