import { Keyboard } from "./interfaces/Keyboard";
import { Mouse } from "./interfaces/Mouse";
import TileManager from "./tile/TileManager";
import SoldierPlayer from "./players/SoldierPlayer";


export default class Game {
  lastTime: number | null;
  width: number;
  height: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  player: SoldierPlayer;
  player2: SoldierPlayer;
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
  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d')!;
    this.tileSize = 50

    this.maxScreenColumn = 15;
    this.maxScreenRow = 9;
  
    // i guess we dont need these for now?
    this.maxWorldColumn = 50;
    this.maxWorldRow = 50;
    this.worldWidth = this.tileSize * this.maxWorldColumn;
    this.worldHeight = this.tileSize * this.maxWorldRow;

    this.width = this.maxScreenColumn * this.tileSize;
    this.height = this.maxScreenRow * this.tileSize;
    

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
    
    this.player = new SoldierPlayer(100, 400, this, true)
    this.player.spawnPlayer()
    this.player2 = new SoldierPlayer(200, 400, this)
    this.player2.spawnPlayer()
    this.tileManager = new TileManager(this, this.player);
    
    
    
    
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
    this.player.gameLoop(delta);
    this.player2.gameLoop(delta);

    
    
    this.lastTime = time;
    requestAnimationFrame(this.gameLoop.bind(this));
  }
}