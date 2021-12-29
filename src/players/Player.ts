import Game from "../Game";
import { Keyboard } from "../interfaces/Keyboard";
import { Mouse } from "../interfaces/Mouse";



export default class Player {
  name: string;
  spawn: boolean;
  walkSpeed: number;

  worldX: number;
  worldY: number;

  screenX: number;
  screenY: number;

  context: CanvasRenderingContext2D;
  angle: number;
  size: number;
  mouse: Mouse | undefined
  keyboard: Keyboard | undefined;
  game: Game;
  vertical: number;
  horizontal: number;
  dx: number;
  dy: number;
  self: boolean;
  health: number;
  maxHealth: number;

  constructor(worldX: number, worldY: number, game: Game, self = false) {
    this.game = game;
    // check if im the character controller
    this.self = self;
    this.context = this.game.context;
    this.name = "Player";
    this.maxHealth = 200;
    this.health = 200;

    this.spawn = false;
    this.walkSpeed = 0.5;

    this.worldX = worldX;
    this.worldY = worldY;

    this.screenX = this.game.width / 2
    this.screenY = this.game.height / 2
    
    this.dx = 0;
    this.dy = 0;
    this.mouse = this.game.mouse;
    this.keyboard = this.game.keyboard;

    this.angle = 0;
    this.size = 50;
    // last moving direction
    this.vertical = 0;
    this.horizontal = 0;
  }
  spawnPlayer() {
    this.spawn = true;
  }
  gameLoop(deltaTime: number) {
    if (!this.spawn) return;
    this.draw();
    this.update(deltaTime);
  }
  private update(deltaTime: number) {
    if (!this.mouse) return;
    if (!this.self) return;
    this.angle = Math.atan2((this.mouse.y) - this.screenY, this.mouse.x - this.screenX);
    this.setDirection()
    this.walk(deltaTime)
    this.handleCollisions();
    this.worldX += this.dx;
    this.worldY += this.dy;
    
  }
  walk(deltaTime: number) {
    this.dy = this.vertical * this.walkSpeed * deltaTime;
    this.dx = this.horizontal * this.walkSpeed* deltaTime;

  }
  private setDirection() {
    this.vertical = 0;
    this.horizontal = 0;
    if (this.keyboard?.w) {
      this.vertical = -1;
    }
    if (this.keyboard?.s) {
      this.vertical = 1;
    }
    if (this.keyboard?.a) {
      this.horizontal = -1;
    }
    if (this.keyboard?.d) {
      this.horizontal = 1;
    }
  }

  private handleCollisions() {
    const tileManager = this.game.tileManager;
    const map = tileManager?.map?.layout;
    const tileSize = this.game.tileSize;
    if (!map) return;

    // vertical
    if (this.vertical !== 0) {
      const gridY = Math.floor((this.worldY + this.dy) / tileSize);
      const gridX = Math.floor(this.worldX / tileSize);
      if (tileManager.getTileAtCords(gridY, gridX)?.collision) this.dy = 0;
    }

    // horizontal
    if (this.horizontal !== 0) {
      const gridY = Math.floor(this.worldY / tileSize);
      const gridX = Math.floor((this.worldX + this.dx) / tileSize);
      if (tileManager.getTileAtCords(gridY, gridX)?.collision) this.dx = 0;
    }

  }
  private draw() {
    
    const screenX = this.worldX - this.game.player.worldX + this.game.player.screenX;
    const screenY = this.worldY - this.game.player.worldY + this.game.player.screenY;
    
    if (this.worldX + this.game.tileSize > this.game.player.worldX - this.game.player.screenX &&
      this.worldX - this.game.tileSize < this.game.player.worldX + this.game.player.screenX &&
      this.worldY + this.game.tileSize > this.game.player.worldY - this.game.player.screenY &&
      this.worldY - this.game.tileSize < this.game.player.worldY + this.game.player.screenY) {
        // Store the current context state (i.e. rotation, translation etc..)
        this.context.save()
    
        this.context.setTransform(1, 0, 0, 1, screenX, screenY)
    
        //Rotate the canvas around the origin
        this.context.rotate(this.angle);
        
        this.context.fillStyle = "green";
        this.context.fillRect(this.size / 2 * (-1), this.size / 2 * (-1), this.size, this.size);
    
        // Restore canvas state as saved from above
        this.context.restore();
      }

  }


}