export default class Tile {
  image: HTMLImageElement | null;
  collision: boolean;
  constructor(image?: HTMLImageElement, collision = false) {
    this.image = image || null;
    this.collision = collision;
  }
}