import Game from "./Game";

export class HUD {
  game: Game;
  context: CanvasRenderingContext2D;

  constructor(game: Game) {
    this.game = game;
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
    const player = this.game.tileManager.follow;
    const fps = Math.round(1000/delta)
    const playerX = Math.round(player.worldX);
    const playerY = Math.round(player.worldY);
    const angle = Math.round((player.angle * (180/Math.PI)))
    
    const fullText = `FPS: ${fps} ` + `X: ${playerX} Y: ${playerY} ` + `Angle: ${angle}`;
    const textWidth = this.context.measureText(fullText).width;

    this.context.fillStyle = "rgba(0,0,0,0.5)";
    this.context.fillRect(0,0,textWidth + 10,25);

    this.context.font = '18px serif';
    this.context.fillStyle = "white"

    this.context.fillText(fullText, 5,18);

  }
  drawPlayerDetails() {
    const player = this.game.tileManager.follow;

    const name = player.username;
    const health = player.health;
    const maxHealth = player.maxHealth;
    
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