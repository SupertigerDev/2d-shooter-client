import { HeroNames } from "../constants/HERO_NAMES";
import Player from "../players/Player";
import Game from "./Game";


export enum ReplayActionType {
  //[SPAWN_PLAYER, playerJSON]
  SPAWN_PLAYER = 1,
  //[LEAVE_PLAYER, id]
  LEAVE_PLAYER = 2,
  //[SPAWN_PAYLOAD, x, y]
  SPAWN_PAYLOAD = 3,
  //[MOVEMENT, playerId, deltaX, deltaY]
  MOVEMENT = 4,
  //[ROTATION, playerId, rotation]
  ROTATION = 5,
  //[ROTATE_AND_MOVE, playerId, deltaX, deltaY, rotation]
  ROTATE_AND_MOVE = 6,
  //[PLAYER_DAMAGED, playerId, newHealth]
  PLAYER_DAMAGED = 7,
  //[PLAYER_KILLED, playerId, killerId]
  PLAYER_KILLED = 8,
  //[PAYLOAD_MOVE_X, x]
  PAYLOAD_MOVE_X = 9,
  //[PAYLOAD_MOVE_X, y]
  PAYLOAD_MOVE_Y = 10
}
interface PlayerData {
  id: string;
  username: string;
  heroId: HeroNames,
  x: number;
  y: number;
  health: number;
  angle: number;
  team: number;
}

export class KillCam {
  game: Game;
  actions: null | Array<[ReplayActionType, ...any][]>;
  players: {[key: string]: Player};
  tick: number;
  lastTick:  number;
  currentAction: number;
  followId: null | string;
  constructor(game: Game) {
    this.game = game;
    this.actions = null;
    
    this.tick = 15;
    this.lastTick = -1;
    this.currentAction = 0;

    this.followId = null;
    this.players = {};
  }
  loadActions(data: {startPositions: {players: PlayerData[]}, actions: Array<[ReplayActionType, ...any][]>}, followId: string) {
    this.actions = data.actions;
    const players = data.startPositions.players
    this.followId = followId;
    for (let playerId in players) {
      const jsonPlayer = players[playerId];
      this.spawnPlayer(jsonPlayer)
    }
    
  }
  spawnPlayer(jsonPlayer: PlayerData) {
    const HeroPlayer = Player.HeroPick(jsonPlayer.heroId);

    const player = new HeroPlayer(jsonPlayer.username, jsonPlayer.id, jsonPlayer.x, jsonPlayer.y, this.game, false);
    player.angle = jsonPlayer.angle;
    player.health = jsonPlayer.health;
    player.team = jsonPlayer.team;
    player.spawnPlayer();

    if (player.id === this.followId) {
      this.game.tileManager.cameraFollow(player);
    }

    this.players[player.id] = player;
  }
  gameLoop(delta: number) {
    if (this.actions === null) return;

    for (let playerId in this.players) {
      this.players[playerId].gameLoop(delta);
    }

    const runTick = performance.now() >= this.lastTick + this.tick
    if (!runTick) return;
    this.lastTick = performance.now()

    if (this.actions.length === this.currentAction) {
      return;
    }


    const actions = this.actions[this.currentAction];
    for (let i = 0; i < actions.length; i++) {
      const [type, ...data] = actions[i];

      if (type === ReplayActionType.SPAWN_PLAYER) {
        const jsonPlayer = data[0];
        this.spawnPlayer(jsonPlayer)
      }

      if (type === ReplayActionType.MOVEMENT) {
        const player = this.players[data[0]];
        player.worldX += data[1]
        player.worldY += data[2]
      }

      if (type === ReplayActionType.ROTATION) {
        const player = this.players[data[0]];
        player.angle = data[1]
      }
      if (type === ReplayActionType.ROTATE_AND_MOVE) {
        const player = this.players[data[0]];
        player.worldX += data[1]
        player.worldY += data[2]
        player.angle = data[3]
      }
      if (type === ReplayActionType.PLAYER_DAMAGED) {
        const player = this.players[data[0]];
        player.health = data[1]
      }
    }

    this.currentAction++;   


  }

}