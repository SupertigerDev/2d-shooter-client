import Game from "./Game";
import Player from "./players/Player";

export class HUD {
  game: Game;
  context: CanvasRenderingContext2D;
  player: Player

  constructor(game: Game) {
    this.game = game;
    this.player = game.player;
    this.context = this.game.context;
  }
  gameLoop(delta: number) {
    this.draw(delta);
  }
  draw(delta: number) {
    this.drawDebug(delta);
    this.drawPlayerDetails();
  }
  drawDebug(delta: number) {
    this.context.font = '18px serif';
    this.context.fillStyle = "black"
    const fps = Math.round(1000/delta)
    const playerX = Math.round(this.player.worldX);
    const playerY = Math.round(this.player.worldY);
    const angle = Math.round((this.player.angle * (180/Math.PI)))
    this.context.fillText("FPS: " + fps, 5,18);
    this.context.fillText("X: " + playerX + " Y: " + playerY , 5,18 * 2);
    this.context.fillText("Angle: " + angle, 5, 18 * 3);
  }
  drawPlayerDetails() {
    const name = this.player.name;
    const health = this.player.health;
    const maxHealth = this.player.maxHealth;
    
    const healthBarWidth = 150;
    const healthBarHeight = 25;
    // draw health bar
    this.context.fillStyle = "gray";
    this.context.fillRect(15, this.game.height - healthBarHeight - 15, healthBarWidth, healthBarHeight)
    
    this.context.fillStyle = "white";
    const healthRemainingWidth = health / maxHealth * healthBarWidth;
    this.context.fillRect(15, this.game.height - healthBarHeight - 15, healthRemainingWidth, 25)
    
    const displayHealth = `${health}/${maxHealth}`;
    const healthTextWidth = this.context.measureText(displayHealth).width;
    this.context.fillText(displayHealth, 15 + healthBarWidth - healthTextWidth, this.game.height - healthBarHeight - 20)
    this.context.fillText(name, 15, this.game.height - healthBarHeight - 20)

  }
}