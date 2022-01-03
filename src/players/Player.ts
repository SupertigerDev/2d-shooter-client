import Game from "../common/Game";
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
  team: number;
  id: string;
  username: string;

  constructor(username: string, id: string, worldX: number, worldY: number, game: Game, self = false) {
    this.id = id;
    this.username = username;
    this.game = game;
    // check if im the character controller
    this.self = self;
    this.context = this.game.context;
    this.name = "Player";
    this.maxHealth = 200;
    this.health = 200;

    this.spawn = false;
    this.walkSpeed = 0.5;

    this.team = -1;

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
    // load latest hero changes.
    if (this.game.latestHeroProperties) {
      const changes = this.game.latestHeroProperties[this.name.toLowerCase()];
      if (changes) {
        for (let key in changes) {
          (this as any)[key] = changes[key]
        }
      }
    }
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
    if (!this.spawn) return;

    const oldAngle = this.angle;
    this.angle = Math.atan2((this.mouse.y) - this.screenY, this.mouse.x - this.screenX);

    this.setDirection()
    this.walk(deltaTime)
    this.handleCollisions();
    this.worldX += this.dx;
    this.worldY += this.dy;

    if (this.dx !== 0 || this.dy !== 0) {
      if (oldAngle !== this.angle) {
        this.game.socketManager.emitMoveAndRotation(this.worldX, this.worldY, this.angle);
      } else {
        this.game.socketManager.emitMove(this.worldX, this.worldY);
      }
    }
    
    if (this.dx === 0 && this.dy === 0) {
      if (oldAngle !== this.angle) {
        this.game.socketManager.emitRotation(this.angle)
      }
    }


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
      if (tileManager.getTileAtCords(gridX, gridY)?.collision) this.dy = 0;
    }

    // horizontal
    if (this.horizontal !== 0) {
      const gridY = Math.floor(this.worldY / tileSize);
      const gridX = Math.floor((this.worldX + this.dx) / tileSize);
      if (tileManager.getTileAtCords(gridX, gridY)?.collision) this.dx = 0;
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
        
        this.context.fillStyle = "rgba(0,0,0,0.6)";
        // this.context.fillStyle = "green";
        this.context.fillRect(this.size / 2 * (-1), this.size / 2 * (-1), this.size, this.size);
    
        // Restore canvas state as saved from above
        this.context.restore();
        this.drawPlayerInfo();
      }
  }
  isEnemy() {
    const myTeam = this.game.player.team;
    const thisTeam = this.team;
    return myTeam !== thisTeam;
  }
  drawPlayerInfo() {



    
    
    const name = this.username;
    const health = this.health;
    const maxHealth = this.maxHealth;
    
    const healthBarWidth = 70;
    const healthBarHeight = 10;


    const healthBarScreenX = this.worldX - this.game.player.worldX + this.game.player.screenX - (healthBarWidth / 2);
    const healthBarScreenY = this.worldY - this.game.player.worldY + this.game.player.screenY - 50;

    // draw health bar
    this.context.fillStyle = "gray";
    this.context.fillRect(healthBarScreenX, healthBarScreenY, healthBarWidth, healthBarHeight)
    
    this.context.fillStyle = this.isEnemy() ? "red" : "white";
    const healthRemainingWidth = health / maxHealth * healthBarWidth;
    this.context.fillRect(healthBarScreenX, healthBarScreenY, healthRemainingWidth, healthBarHeight)
    

    const nameTextWidth = this.context.measureText(name).width;


    this.context.fillText(name, healthBarScreenX + (healthBarWidth /2) - (nameTextWidth / 2), healthBarScreenY - 5)

  }

}