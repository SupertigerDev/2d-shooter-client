import Game from "../Game";
import Player from "./Player";


export default class SoldierPlayer extends Player {
  constructor(x: number, y: number, game: Game, self = false) {
    super(x, y, game, self);
    this.name = "Soldier"
    if (this.game.latestHeroProperties) {
      const changes = this.game.latestHeroProperties[this.name.toLowerCase()];
      if (changes) {
        for (let key in changes) {
          (this as any)[key] = changes[key]
        }
      }
    }
  }
}