import { HeroNames } from "../constants/HERO_NAMES";
import Player from "../players/Player";
import Game from "./Game";
import { Payload } from "./Payload";


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
  actionEnded: boolean;
  payload: Payload;
  constructor(game: Game) {
    this.game = game;
    this.actions = null;
    
    this.tick = 15;
    this.lastTick = -1;
    this.currentAction = 0;
    this.actionEnded = false;

    this.followId = null;
    this.players = {};
    this.payload = new Payload(this.game);

  }
  loadActions(data: {startPositions: {players: PlayerData[], payload: {x: number, y: number}}, actions: Array<[ReplayActionType, ...any][]>}, followId: string) {
    this.game.transitionManager.hideScreen();

    setTimeout(() => {
      this.actions = data.actions;
      const players = data.startPositions.players
      this.followId = followId;

      this.payload.spawnPayload();
      this.payload.x = data.startPositions.payload.x;
      this.payload.y = data.startPositions.payload.y;

      for (let playerId in players) {
        const jsonPlayer = players[playerId];
        this.spawnPlayer(jsonPlayer)
      }

      this.game.transitionManager.showScreen();
    }, 500);
    
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
  reset() {
    this.game.transitionManager.hideScreen();
    setTimeout(() => {
      this.actions = null;
      this.currentAction = 0;
      this.players = {};
      this.payload = new Payload(this.game);
      this.lastTick = -1;
      this.followId = null;
      this.actionEnded = false;
      this.game.tileManager.cameraFollow(this.game.player);


      this.game.transitionManager.showScreen();
    }, 500);
  }
  gameLoop(delta: number) {
    this.drawUI();
    this.update(delta);
    this.payload.gameLoop(delta);
    
  }
  drawUI() {
    if (this.actions === null) return;
    if (!this.followId) return;
    if (!this.players[this.followId]) return;
    const bgWidth = this.game.width;
    const bgHeight = 100;
    this.game.context.fillStyle = "rgba(0,0,0,0.6)";
    this.game.context.fillRect(0,0, bgWidth, bgHeight)

    this.game.context.font = "25px Arial";
    
    const mainText = "You Were Killed By:";
    const mainTextWidth = this.game.context.measureText(mainText).width
    
    const username = this.players[this.followId].username;
    const usernameWidth = this.game.context.measureText(username).width
    
    
    this.game.context.fillStyle = "white";
    this.game.context.fillText(mainText, (bgWidth/2) - (mainTextWidth/2), 40);
    this.game.context.fillStyle = "rgba(255,255,255,0.8)";
    this.game.context.fillText(username, (bgWidth/2) - (usernameWidth/2), 80);


  }
  update(delta: number) {
    if (this.actions === null) return;
    for (let playerId in this.players) {
      this.players[playerId].gameLoop(delta);
    }

    const runTick = performance.now() >= this.lastTick + this.tick
    if (!runTick) return;
    this.lastTick = performance.now()

    if (this.actions.length === this.currentAction) {
      if (!this.actionEnded) {
        this.actionEnded = true;
        this.reset();
      }
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
      if (type === ReplayActionType.PAYLOAD_MOVE_X) {
        this.payload.x = data[0];
        this.game.payload.angle = 0;
      }
      if (type === ReplayActionType.PAYLOAD_MOVE_Y) {
        this.payload.y = data[0];
        this.game.payload.angle = 90;
      }
    }

    this.currentAction++;  
  }


}