export default class Tile {
  image: HTMLCanvasElement;
  collision: boolean;
  constructor(tileSize: number, image?: HTMLImageElement, collision = false) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = tileSize;
    canvas.height = tileSize;
    context.drawImage(image!, 0,0,tileSize, tileSize);


    this.image = canvas
    this.collision = collision;
  }
}