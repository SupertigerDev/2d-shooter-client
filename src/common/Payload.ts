import Game from "./Game";
import TileManager from "../tile/TileManager";

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
  speed: number;
  currentRoute: number;
  angle: number;
  test: boolean;
  constructor(game: Game) {
    this.test = false;
    this.game = game;
    this.tileManager = game.tileManager;
    this.context = this.game.context;
    this.payloadSpawned = false;
    this.currentRoute = 0;

    this.width = 150;
    this.height = 100;

    this.x = 0;
    this.y = 0;
    this.angle = 0;

    this.speed = 10;
    this.pushing = false;
  }
  spawnPayload() {
    if (this.payloadSpawned) return;
    this.payloadSpawned = true;
  }
  gameLoop(delta: number) {
    this.update(delta);
    this.draw();

  }
  update(delta: number) {
    if (!this.tileManager.map) return;   
    this.pushPayload(delta)
  }
  pushPayload(delta: number) {
    if (!this.test) return;
    const player = this.game.player;

    // move the payload if im near it.
    // TODO: for now, move the payload only for the main player.
    // TODO: make payload move faster when there are move players around the payload.
    const worldX = this.x * this.game.tileSize - (this.width /2) + (player.size / 2)
    const worldY = this.y * this.game.tileSize - (this.height/2) + (player.size / 2)

    const xRadius = 150;
    const yRadius = 120;
    // check if player is near the payload
    const xDistance = Math.abs(player.worldX - worldX);
    const yDistance = Math.abs(player.worldY - worldY);

    this.pushing = false;
    if (xDistance <= xRadius && yDistance <= yRadius) {
      const nextRoutePath = this.tileManager.map?.payloadRoute[this.currentRoute + 1]!;
      const xReached = nextRoutePath.x === Math.floor(this.x);
      const yReached = nextRoutePath.y === Math.floor(this.y);
      this.pushing = true;
      if (xReached && yReached) {
        this.currentRoute++;
      }
      if (!xReached) {
        this.x+= (this.speed / this.game.tileSize) * (delta / this.game.tileSize);
        this.angle = 0;
      }
      if (!yReached) {
        this.y+= (this.speed / this.game.tileSize) * (delta / this.game.tileSize);
        this.angle = 90;
      }


    }
  }
  draw() {
    if (!this.payloadSpawned) return;

    if (!this.tileManager.map) return;


    const worldX = this.x * this.game.tileSize
    const worldY = this.y * this.game.tileSize

    const screenX = (worldX - (this.game.tileSize /2)  ) - this.game.player.worldX + this.game.player.screenX;
    const screenY = (worldY - (this.game.tileSize /2) ) - this.game.player.worldY + this.game.player.screenY;

    this.context.fillStyle = "lightgray";
    if (this.pushing) {
      this.context.fillStyle = "red";
    }
    if (this.test) {
      this.context.fillStyle = "pink";

    }
    // Store the current context state (i.e. rotation, translation etc..)
    this.context.save()

    this.context.setTransform(1, 0, 0, 1, screenX, screenY)

    //Rotate the canvas around the origin
    this.context.rotate(this.angle * Math.PI / 180);
    
    this.context.fillRect(this.width / 2 * (-1), this.height / 2 * (-1), this.width, this.height);

    // Restore canvas state as saved from above
    this.context.restore();
  }
}   