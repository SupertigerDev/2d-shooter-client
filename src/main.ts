import "./style.css"
import Game from "./Game";



const game = new Game();

// events
document.addEventListener("mousemove", event => {
  game.mouse.x = event.clientX;
  game.mouse.y = event.clientY;
})
document.addEventListener("keydown", event => {
  const key = event.key.toLowerCase();

  if ((game.keyboard as any)[key] !== undefined) {
    (game.keyboard as any)[key] = true;
  }
})
document.addEventListener("keyup", event => {
  const key = event.key.toLowerCase();
  if ((game.keyboard as any)[key] !== undefined) {
    (game.keyboard as any)[key] = false;
  }
})


