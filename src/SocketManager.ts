import Game from "./Game";
import IO, { Socket } from "socket.io-client";
import SoldierPlayer from "./players/SoldierPlayer";
export class SocketManager {
  game: Game;
  socket: Socket;

  constructor(game: Game) {
    this.game = game;
    this.socket = IO("localhost:80", {transports: ["websocket"]})

    this.socket.on("overrideHeroProperties", heroProperties => {
      this.game.latestHeroProperties = heroProperties;
    })

    interface PlayerData {
      id: string;
      username: string;
      x: number;
      y: number;
      health: number;
      angle: number;
      team: number;
    }

    this.socket.on("connect", () => {
      this.socket.emit("setUsername", this.game.username)
    })
    this.socket.on("playerList", (playerList: PlayerData[]) => {
      playerList.forEach(data => {
        const player = new SoldierPlayer(data.username, data.id, data.x, data.y, this.game, false);
        player.angle = data.angle
        player.health = data.health
        player.team = data.team
        this.game.players[data.id] = player;
        player.spawnPlayer();
      })
    })
    this.socket.on("payloadPosition", ({x, y}) => {
      this.game.payload.x = x;
      this.game.payload.y = y;
      this.game.payload.spawnPayload();
    })

    this.socket.on("spawnPlayer", (data: PlayerData) => {
      const isMe = data.id === this.socket.id;
      const player = new SoldierPlayer(data.username, data.id, data.x, data.y, this.game, isMe);
      player.team = data.team;
      if (isMe) {
        this.game.player = player;
      } else {
        this.game.players[data.id] = player;
      }
      player.spawnPlayer();
    })

    this.socket.on("playerLeave", (playerId: string) => {
      delete this.game.players[playerId];
    })

    this.socket.on("playerMove", (data) => {
      const player = this.game.players[data[0]];
      player.worldX+= data[1];
      player.worldY+= data[2];
    })

    this.socket.on("playerMoveAndRotate", (data) => {
      const player = this.game.players[data[0]];
      player.worldX+= data[1];
      player.worldY+= data[2];
      player.angle = data[3];
    })
    
    this.socket.on("playerRotate", (data) => {
      const player = this.game.players[data[0]];
      player.angle = data[1];
    })

    this.socket.on("payloadMoveX", x => {
      this.game.payload.x = x;
      this.game.payload.angle = 0;
    })
    this.socket.on("payloadMoveY", y => {
      this.game.payload.y = y;
      this.game.payload.angle = 90;
    })

    this.socket.on("playerDamaged", (data: {id: string, health: number}) => {
      if (data.id === this.socket.id) {
        // shots to myself
        this.game.player.health = data.health;
        return;
      }
      const player = this.game.players[data.id];
      if (!player) return;
      player.health = data.health;
    })
  }
  emitMove(x: number, y: number) {
    this.socket.emit("playerMove", [x, y]);
  }
  emitMoveAndRotation(x: number, y: number, angle: number) {
    this.socket.emit("playerMoveAndRotate", [x, y, angle]);
  }
  emitRotation(angle: number) {
    this.socket.emit("playerRotate", angle);
  }
}