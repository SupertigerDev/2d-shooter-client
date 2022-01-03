import Game from "../common/Game";
import Player from "./Player";


export default class SoldierPlayer extends Player {
  lastGunFired: number;
  gunFireRate: number;
  constructor(username: string, id: string,x: number, y: number, game: Game, self = false) {
    super(username, id, x, y, game, self);
    this.name = "Soldier"

    this.gunFireRate = 100;
    this.lastGunFired = -1;
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

