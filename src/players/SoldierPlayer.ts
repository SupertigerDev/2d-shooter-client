import Game from "../common/Game";
import { SpriteManager } from "../sprite/SpriteManager";
import Player from "./Player";


function loadSprite(column: number, row: number) {
  return {x: 64 * row, y: 64 * column, width: 64, height: 64}
}


function loadSprites(index: number, length: number, skipFirst= false) {
  let sprites: any = [];

  for (let i = 0; i < length; i++) {
    if (i === 0 && skipFirst) continue;
    sprites.push(loadSprite(index, i))
  }
  return sprites;
}

const upIdle = loadSprite(8,0)
const walkingUp = loadSprites(8,9,true);

const downIdle = loadSprite(10,0)
const walkingDown = loadSprites(10,9,true);

const rightIdle = loadSprite(11,0)
const walkingRight = loadSprites(11,9,true);

const leftIdle = loadSprite(9,0)
const walkingLeft = loadSprites(9,9,true);


export default class SoldierPlayer extends Player {
  lastGunFired: number;
  gunFireRate: number;
  constructor(username: string, id: string,x: number, y: number, game: Game, self = false) {
    super(username, id, x, y, game, self);
    this.name = "Soldier"

    this.gunFireRate = 100;
    this.lastGunFired = -1;
    this.spriteManager = new SpriteManager(this.game, "/players/soldier/playerSprite.png", 200, 200, 1);

    setTimeout(() => {
      console.log("loaded")
      this.spriteManager?.loadSprites([leftIdle])
    }, 500);
  }
  mouseDirectionChanged() {
    super.mouseDirectionChanged()
    if (!this.spriteManager) return;
    switch (this.currentMouseDirection) {
      case "left":
        this.spriteManager.loadSprites([leftIdle])
        break;
      case "right":
        this.spriteManager.loadSprites([rightIdle])
        break;
      case "up":
        this.spriteManager.loadSprites([upIdle])
        break;
      
      case "down":
        this.spriteManager.loadSprites([downIdle])
        break;
      
        default:
          break;
      }
  }
  emitFireGun() {
    this.game.socketManager.socket.emit("playerShoot");
  }
  gameLoop(delta: number) {
    super.gameLoop(delta);
    // this.drawBeam();
    if (!this.self) return;
    const leftMouseDown = this.game.mouse.lmb;
    if (leftMouseDown) {
      const canFire = performance.now() >= this.lastGunFired + this.gunFireRate
      if (canFire) {
        this.lastGunFired = performance.now()
       this.emitFireGun();
      }
    }
  }

  
  drawBeam() {
    
    const tileSize = this.game.tileSize;
    
    const xAngle = Math.cos(this.angle)
    const yAngle = Math.sin(this.angle)

    let lineX = this.worldX
    let lineY = this.worldY

    for (let index = 0; index < 100; index++) {

      lineX += xAngle * 8;
      lineY += yAngle * 8;

      const tile = this.game.tileManager.getTileAtCords(Math.floor(lineX / tileSize), Math.floor(lineY / tileSize))

      if(tile?.collision) break

      for (let playerId in this.game.players) {
        const player = this.game.players[playerId];

        const corners = getPlayerCorners(player.worldX, player.worldY, player.angle, player.size);
        if (pointInPoly(corners, lineX, lineY)) {
          return;
        }
      }


      const screenX = lineX - this.worldX + this.game.player.screenX;
      const screenY = lineY - this.worldY + this.game.player.screenY;

      this.context.fillStyle = "red";
      this.context.fillRect(screenX, screenY, 8, 8);
      
    }



  }
}

function getPlayerCorners(playerX: number, playerY: number, angle: number, size: number) {
  const topLeft = GetPointRotated(playerX,playerY, angle, -size/2, -size/2)

  const topRight = GetPointRotated(playerX,playerY, angle, size/2, -size/2)

  const BottomLeft = GetPointRotated(playerX,playerY, angle, -size/2, size/2)

  const BottomRight = GetPointRotated(playerX,playerY, angle, size/2, size/2)
  return [topLeft, topRight, BottomRight, BottomLeft]
}

function GetPointRotated(X: number, Y: number, R: number, Xos: number, Yos: number){
  // Xos, Yos // the coordinates of your center point of rect
  // R      // the angle you wish to rotate
  
  //The rotated position of this corner in world coordinates    
  var rotatedX = X + (Xos  * Math.cos(R)) - (Yos * Math.sin(R))
  var rotatedY = Y + (Xos  * Math.sin(R)) + (Yos * Math.cos(R))
  
  return {x: rotatedX, y: rotatedY}
}

function pointInPoly(vertices: any, testX: number, testY: number) {
  let collision = false;

  const verticesLength = vertices.length;

  for (let i = 0, j = verticesLength - 1; i < verticesLength; j = i++) {
    if (((vertices[i].y > testY) != (vertices[j].y > testY)) &&
         (testX < (vertices[j].x - vertices[i].x) * (testY - vertices[i].y) / (vertices[j].y - vertices[i].y) + vertices[i].x))
      collision = !collision;
  }
  return collision;
}

