import { Keyboard } from "./interfaces/Keyboard";
import { Mouse } from "./interfaces/Mouse";
import TileManager from "./tile/TileManager";
import SoldierPlayer from "./players/SoldierPlayer";
import { RouteVisualizer } from "./RouteVisualizer";
import { HUD } from "./HUD";
import { Payload } from "./Payload";
import { SocketManager } from "./SocketManager";
import Player from "./players/Player";


export default class Game {
  lastTime: number | null;
  width: number;
  height: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  player: Player;
  mouse: Mouse
  keyboard: Keyboard
  tileManager: TileManager;
  tileSize: number;
  maxScreenColumn: number;
  maxScreenRow: number;
  maxWorldColumn: number;
  maxWorldRow: number;
  worldHeight: number;
  worldWidth: number;
  routeVisualizer: RouteVisualizer;
  hud: HUD;
  payload: Payload;
  socketManager: SocketManager;
  latestHeroProperties: any;
  players: {[key: string]: Player};
  constructor() {

    this.socketManager = new SocketManager(this);

    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d')!;
    this.tileSize = 50
    this.latestHeroProperties = null;

    this.maxScreenColumn = 15;
    this.maxScreenRow = 9;
  
    // i guess we dont need these for now?
    this.maxWorldColumn = 50;
    this.maxWorldRow = 50;
    this.worldWidth = this.tileSize * this.maxWorldColumn;
    this.worldHeight = this.tileSize * this.maxWorldRow;

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    

    this.canvas.height = this.height;
    this.canvas.width = this.width;
    
    (window as any).context = this.context;
    
    this.mouse = {x: 0, y: 0};
    this.keyboard = {
      w: false,
      a: false,
      s: false,
      d: false
    }
    
    // temporarily instantiate the player.
    this.player = new SoldierPlayer(100, 400, this, true)
    this.players = {};


    this.tileManager = new TileManager(this);
    
    this.routeVisualizer = new RouteVisualizer(this);
    this.payload = new Payload(this);

    this.hud = new HUD(this);
    
    
    this.lastTime = null;
    
    requestAnimationFrame(this.gameLoop.bind(this));
  }
  gameLoop(time: number) {
    if (!this.lastTime) {
      this.lastTime = time;
      requestAnimationFrame(this.gameLoop.bind(this));
      return;
    }
    const delta = time - this.lastTime;
    this.context.fillStyle = "#31beff";
    this.context.fillRect(0,0, this.width, this.height)

    
    
    this.tileManager.gameLoop(delta);
    this.routeVisualizer.gameLoop(delta);
    this.payload.gameLoop(delta);

    this.player.gameLoop(delta);

    for (let playerId in this.players) {
      this.players[playerId].gameLoop(delta);
    }
    
    this.hud.gameLoop(delta);

    
    
    this.lastTime = time;
    requestAnimationFrame(this.gameLoop.bind(this));
  }
}