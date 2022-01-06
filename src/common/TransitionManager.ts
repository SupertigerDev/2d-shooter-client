import Game from "./Game";

export class TransitionManager {
  game: Game;
  hide: boolean;
  fadeOpacity: number;
  speed: number;
  constructor(game: Game) {
    this.game = game;
    this.hide = false;

    this.speed = 0.005;

    this.fadeOpacity = 0;
  }
  gameLoop(delta: number){
    this.update(delta)
    this.draw();
  }
  public hideScreen() {
    this.hide = true;
    this.fadeOpacity = 0;
  }
  public showScreen() {
    this.hide = false;
    this.fadeOpacity = 1;
  }

  private update(delta: number) {
    if (this.hide && this.fadeOpacity !== 1) {
      this.fadeOpacity+= this.speed * delta;
    }
    if (!this.hide && this.fadeOpacity !== 0) {
      this.fadeOpacity-= this.speed * delta;
    }
  }
  private draw() {
    if (this.fadeOpacity <= 0) return;
    this.game.context.fillStyle = "rgba(0,0,0,"+ this.fadeOpacity +")"
    this.game.context.fillRect(0,0, this.game.width, this.game.height); 
  }
}