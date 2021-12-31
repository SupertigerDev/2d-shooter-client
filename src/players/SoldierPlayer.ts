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
    if (leftMouseDown) {
      this.drawBeam()
    }
  }

  drawBeam() {

    
    const x = Math.cos(this.angle)
    const y = Math.sin(this.angle)

    let lineX = this.worldX
    let lineY = this.worldY

    for (let index = 0; index < 100; index++) {

      lineX += x * 4;
      lineY += y * 4;

      const tile = this.game.tileManager.getTileAtCords(Math.floor(lineX/this.game.tileSize), Math.floor(lineY/this.game.tileSize))



      if(tile?.collision) {
        break
      } 

      const screenX = lineX - this.worldX + this.game.player.screenX;
      const screenY = lineY - this.worldY + this.game.player.screenY;

      this.context.fillStyle = "red";
      this.context.fillRect(screenX, screenY, 4, 4);
      
    }



  }
}