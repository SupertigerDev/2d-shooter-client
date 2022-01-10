import Game from "../common/Game";
import { Sprite } from "./Sprite";

interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class SpriteManager {
  spritePath: string;
  x: number;
  y: number;
  scale: number;
  sprites: Sprite[];
  spriteSheet: null | HTMLCanvasElement;
  game: Game;
  currentSprite: number;
  lastFrame: number;
  constructor(game: Game, spritePath: string, x: number, y: number, scale = 1) {
    this.game = game;
    this.spritePath = spritePath;
    this.spriteSheet = null;
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.sprites = [];
    this.currentSprite = 0;
    this.loadSpriteSheet();

    this.lastFrame = performance.now();
  }
  private async loadSpriteSheet() {
    this.spriteSheet = await loadSpriteSheet(this.spritePath, this.scale);
  }
  loadSprites(positions: Position[]) {
    if (!this.spriteSheet) return;
    for (let index = 0; index < positions.length; index++) {
      const position = positions[index];
      this.sprites.push(new Sprite(this.spriteSheet, -(position.x * this.scale), -(position.y * this.scale), position.width * this.scale, position.height * this.scale))
    }
  }
  gameLoop(delta: number) {
    if (!this.spriteSheet) return;
    if (!this.sprites.length) return;

    this.update(delta);
    this.draw()
  }
  update(delta: number) {
    if (this.sprites.length === 1) return;
    if (performance.now() - this.lastFrame < 100) return;
    this.lastFrame = performance.now()
    this.currentSprite++;
    if (this.currentSprite === this.sprites.length) {
      this.currentSprite = 0;
    }
  }
  draw() {
    const sprite = this.sprites[this.currentSprite];
    this.game.context.drawImage(sprite.image, this.x - (sprite.width/2), this.y - (sprite.height/2));
  }
}


function loadSpriteSheet(path: string, scale = 1): Promise<HTMLCanvasElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      context.drawImage(img, 0,0, canvas.width, canvas.height);
      resolve(canvas);
    };
    img.src = path;
  })
}
