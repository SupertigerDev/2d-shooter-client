import Game from "./Game";
import Player from "../players/Player";

// stats menu
export class TabMenu {
  game: Game;
  context: CanvasRenderingContext2D;

  constructor(game: Game) {
    this.game = game;
    this.context = this.game.context;
  }
  gameLoop(delta: number) {
    this.draw(delta);
  }
  draw(delta: number) {
    const tabKeyDown = this.game.keyboard.tab;
    if (!tabKeyDown) return;

    const myTeam = this.game.player.team;
    const enemyTeam = myTeam === 1 ? 2 : 1;
    const teams = this.getTeams();

    this.context.fillStyle = "rgba(0,0,0,0.8)";
    this.context.fillRect(0,0, this.game.width, this.game.height)

    let boxWidth = 250;

    const center = this.game.width / 2 - (boxWidth/2);

    this.drawTeamPlayers(teams[myTeam - 1], this.game.friendlyColor, center -   ((boxWidth/2) + 10) , 100);
    this.drawTeamPlayers(teams[enemyTeam - 1], this.game.enemyColor, center + ((boxWidth/2) + 10) , 100);
  }

  drawTeamPlayers(players: Player[], color: string, x: number, y: number) { 
    let boxWidth = 250; 
    let boxHeight = 100;
    for (let index = 0; index < players.length; index++) {
      const player = players[index];
      this.context.fillStyle = color;
      this.context.fillRect(x, y + index * (boxHeight + 10), boxWidth, boxHeight );
      this.context.fillStyle = "white";
      
      this.context.fillText(player.username, x + 10, y  + (40 / 2 + 5) + index * (boxHeight + 10));

      const heroNameWidth = this.context.measureText("Soldier").width;

      this.context.fillStyle = "rgba(255,255,255,0.8)";
      this.context.fillText("Soldier", x + boxWidth - heroNameWidth - 10, y  + (40 / 2 + 5) + index * (boxHeight + 10));
      
      
      this.context.fillStyle = "rgba(0,0,0,0.2)";
      this.context.fillRect(x, y + index * (boxHeight + 10) + 40, boxWidth, (60));

      const health = player.health.toString();
      const healthWidth = this.context.measureText(health).width;

      const kills = (0).toString();
      const killsWidth = this.context.measureText(kills).width;

      const deaths = (0).toString();
      const deathsWidth = this.context.measureText(deaths).width;
      
      this.context.fillStyle = "rgba(255,255,255,0.8";
      this.context.fillText("Health", x + 10, y + index * (boxHeight + 10) + 65);
      this.context.fillText("Kills", x + 100, y + index * (boxHeight + 10) + 65);
      this.context.fillText("Deaths", x + 180, y + index * (boxHeight + 10) + 65);

      this.context.fillStyle = "white";
      this.context.fillText(health, x + 10 + (50 / 2) - (healthWidth/2), y + index * (boxHeight + 10) + 87);
      this.context.fillText(kills, x + 100 + (30/2) - (killsWidth/2), y + index * (boxHeight + 10) + 87);
      this.context.fillText(deaths, x + 180 + (55/2) - (deathsWidth/2), y + index * (boxHeight + 10) + 87);


    }           
  }
  getTeams() {
    let teamOne: Player[] = [];
    let teamTwo: Player[] = [];;
    if (this.game.player.team === 1) {
      teamOne.push(this.game.player);
    }
    if (this.game.player.team === 2) {
      teamTwo.push(this.game.player);
    }

    for (let playerId in this.game.players) {
      const player = this.game.players[playerId];
      if (player.team === 1) {
        teamOne.push(player);
      }
      if (player.team === 2) {
        teamTwo.push(player);
      }
    }
    return [teamOne, teamTwo];
  }


}