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
      x: number;
      y: number;
    }

    this.socket.on("playerList", (playerList: PlayerData[]) => {
      playerList.forEach(data => {
        const player = new SoldierPlayer(data.x, data.y, this.game, false);
        this.game.players[data.id] = player;
        player.spawnPlayer();
      })
    })

    this.socket.on("spawnPlayer", (data: PlayerData) => {
      const isMe = data.id === this.socket.id;
      const player = new SoldierPlayer(data.x, data.y, this.game, isMe);
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
  }
  emitMove(x: number, y: number) {
    this.socket.volatile.emit("playerMove", [x, y]);
  }
  emitMoveAndRotation(x: number, y: number, angle: number) {
    this.socket.volatile.emit("playerMoveAndRotate", [x, y, angle]);
  }
  emitRotation(angle: number) {
    this.socket.volatile.emit("playerRotate", angle);
  }
}