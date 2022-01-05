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

      const firstScreenPos = this.tileManager.worldToScreen(
        (firstPos.x * tileSize) - (tileSize / 2),
        (firstPos.y * tileSize) - (tileSize / 2)
      )
      const secondScreenPos = this.tileManager.worldToScreen(
        (secondPos.x * tileSize) - (tileSize / 2),
        (secondPos.y * tileSize) - (tileSize / 2)
      )




      this.context.beginPath();
      this.context.moveTo(firstScreenPos.screenX, firstScreenPos.screenY);
      this.context.lineTo(secondScreenPos.screenX, secondScreenPos.screenY );
      this.context.stroke();
      
    }
  }
}