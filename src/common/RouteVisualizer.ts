import Game from "./Game";
import TileManager from "../tile/TileManager";

export class RouteVisualizer {
  game: Game;
  context: CanvasRenderingContext2D;
  tileManager: TileManager

  constructor(game: Game) {
    this.game = game;
    this.tileManager = game.tileManager;
    this.context = this.game.context;
  }
  gameLoop(delta: number) {
    this.draw()
  }
  draw() {
    const payloadRoute = this.tileManager.map?.payloadRoute;
    if (!payloadRoute) return;
    const tileSize = this.game.tileSize;
    const lineWidth = 20;
    
    this.context.strokeStyle = "blue";
    this.context.lineWidth = lineWidth;
    
    for (let index = 0; index < payloadRoute.length; index++) {
      const firstPos = payloadRoute[index];
      const secondPos = payloadRoute[index + 1];
      if (!secondPos) continue;

      const firstPosX = (firstPos.x * tileSize) - (tileSize / 2) - this.game.player.worldX + this.game.player.screenX
      const firstPosY = (firstPos.y * tileSize) - (tileSize / 2)  - this.game.player.worldY + this.game.player.screenY;

      const secondPosX = (secondPos.x * tileSize) - (tileSize / 2) - this.game.player.worldX + this.game.player.screenX
      const secondPosY = (secondPos.y * tileSize) - (tileSize / 2) - this.game.player.worldY + this.game.player.screenY;


      this.context.beginPath();
      this.context.moveTo(firstPosX, firstPosY);
      this.context.lineTo(secondPosX, secondPosY );
      this.context.stroke();
      
    }
  }
}