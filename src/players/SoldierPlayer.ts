import Game from "../Game";
import Player from "./Player";


export default class SoldierPlayer extends Player {
  constructor(x: number, y: number, game: Game, self = false) {
    super(x, y, game, self);
    this.name = "Soldier"
  }
  gameLoop(delta: number) {
    super.gameLoop(delta);
    if (!this.self) return;
    const leftMouseDown = this.game.mouse.lmb;
    // if (leftMouseDown) {
      this.drawBeam()
    // }
  }

  drawBeam() {
    
    const tileSize = this.game.tileSize;
    
    const x = Math.cos(this.angle)
    const y = Math.sin(this.angle)

    let lineX = this.worldX
    let lineY = this.worldY

    for (let index = 0; index < 100; index++) {

      lineX += x * 8;
      lineY += y * 8;

      const tile = this.game.tileManager.getTileAtCords(Math.floor(lineX / tileSize), Math.floor(lineY / tileSize))

      if(tile?.collision) break

      for (let playerId in this.game.players) {
        const player = this.game.players[playerId];
        const x = player.worldX - this.size / 2
        const y = player.worldY - this.size / 2

        // check if linex and y are colliding with x and y
        if (x >= lineX - this.size && x <= lineX && 
            y >= lineY - this.size && y <= lineY) {
          return
        }


      }


      const screenX = lineX - this.worldX + this.game.player.screenX;
      const screenY = lineY - this.worldY + this.game.player.screenY;

      this.context.fillStyle = "red";
      this.context.fillRect(screenX, screenY, 8, 8);
      
    }



  }
}