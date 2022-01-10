import Game from "../common/Game";
import { HeroNames } from "../constants/HERO_NAMES";
import { Keyboard } from "../interfaces/Keyboard";
import { Mouse } from "../interfaces/Mouse";
import { SpriteManager } from "../sprite/SpriteManager";
import SoldierPlayer from "./SoldierPlayer";



export default class Player {
  name: string;
  spawn: boolean;
  walkSpeed: number;

  worldX: number;
  worldY: number;
  spriteManager: undefined | SpriteManager;


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
  currentMouseDirection: string;

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

    
    this.dx = 0;
    this.dy = 0;
    this.mouse = this.game.mouse;
    this.keyboard = this.game.keyboard;

    this.angle = 0;
    this.currentMouseDirection = "up"
    this.size = 50;
    // last moving direction
    this.vertical = 0;
    this.horizontal = 0;
  }
  get screenX () {
    return this.game.width / 2;
  }
  get screenY () {
    return this.game.height / 2;
  }

  static HeroPick(hero: HeroNames) {
    switch (hero) {
      case HeroNames.soldier: return SoldierPlayer
      default:
        throw Error("Invalid Hero")
    }
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
    this.draw(deltaTime);
    this.update(deltaTime);
  }
  private update(deltaTime: number) {
    if (!this.mouse) return;
    if (!this.self) return;
    if (!this.spawn) return;

    const oldAngle = this.angle;
    this.angle = Math.atan2((this.mouse.y) - this.screenY, this.mouse.x - this.screenX);

    this.setMouseDirection() 
    this.setKeyboardDirection()
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
  setMouseDirection() {
    const degrees = this.angle * (180/Math.PI);
    const before = this.currentMouseDirection;
    if (degrees >= -140 && degrees <= -40) this.currentMouseDirection = "up"
    else if (degrees >= -40 && degrees <= 40) this.currentMouseDirection = "right"
    else if (degrees >= 40 && degrees <= 140) this.currentMouseDirection = "down"
    else this.currentMouseDirection = "left"
    if (before !== this.currentMouseDirection) {
      this.mouseDirectionChanged()
    }
  }
  mouseDirectionChanged() {

  }
  walk(deltaTime: number) {
    this.dy = this.vertical * this.walkSpeed * deltaTime;
    this.dx = this.horizontal * this.walkSpeed* deltaTime;

  }
  private setKeyboardDirection() {
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
  private draw(delta: number) {
    const followingPlayer = this.game.tileManager.follow;
    const {screenX, screenY} = this.game.tileManager.worldToScreen(
      this.worldX,
      this.worldY
    )
    
    if (this.worldX + this.game.tileSize > followingPlayer.worldX - followingPlayer.screenX &&
      this.worldX - this.game.tileSize < followingPlayer.worldX + followingPlayer.screenX &&
      this.worldY + this.game.tileSize > followingPlayer.worldY - followingPlayer.screenY &&
      this.worldY - this.game.tileSize < followingPlayer.worldY + followingPlayer.screenY) {


        if (this.spriteManager) {
          this.spriteManager.x = screenX;
          this.spriteManager.y = screenY;
          this.spriteManager.gameLoop(delta)
        }
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

    let healthBarScreenPos = this.game.tileManager.worldToScreen(
      this.worldX,
      this.worldY
    )

    healthBarScreenPos.screenX -= (healthBarWidth / 2);
    healthBarScreenPos.screenY -= 50;

    // draw health bar
    this.context.fillStyle = "rgba(255,255,255,0.4)";
    this.context.fillRect(healthBarScreenPos.screenX, healthBarScreenPos.screenY, healthBarWidth, healthBarHeight)
    
    this.context.fillStyle = this.isEnemy() ? this.game.enemyColor : this.game.friendlyColor;
    const healthRemainingWidth = health / maxHealth * healthBarWidth;
    this.context.fillRect(healthBarScreenPos.screenX, healthBarScreenPos.screenY, healthRemainingWidth, healthBarHeight)
    

    const nameTextWidth = this.context.measureText(name).width;

    this.context.fillStyle = "white";
    this.context.fillText(name, healthBarScreenPos.screenX + (healthBarWidth /2) - (nameTextWidth / 2), healthBarScreenPos.screenY - 5)

  }

}