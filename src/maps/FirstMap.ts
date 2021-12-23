import Game from "../Game";
import Tile from "../tile/Tile";


export default async function getMap(game: Game) {
  return {
    name: "First Map",
    description: "First prototype map",
    tiles: [
      new Tile(game.tileSize, await loadTexture("/FirstMapTextures/Wall.png"), true),
      new Tile(game.tileSize, await loadTexture("/FirstMapTextures/Floor.png")),
      new Tile(game.tileSize, await loadTexture("/FirstMapTextures/Grass.png")),
    ],
    layout: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

    ]
  }
}


function loadTexture(path: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = function () {
      resolve(img)
    };
    img.src = path;
  })
}