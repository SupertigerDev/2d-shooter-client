import Game from "../common/Game";

interface Options {
  path: string;
  scale: number;
}
export class Sprite {
  x: number;
  y: number;
  width: number;
  height: number;
  image: HTMLCanvasElement;


  constructor(image: HTMLCanvasElement, x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = this.width;
    canvas.height = this.height;
    
    // context.fillStyle = "red"
    // context.fillRect(0, 0, width, height)
    context.drawImage(image, this.x, this.y);

    this.image = canvas;
  }

}