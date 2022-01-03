import "./style.css"
import Game from "./common/Game";

main();

function main() {
  // if (!localStorage["username"]) {
    let username = prompt("Enter a username", localStorage["username"] || "");

    if (!username) {
      return;
    }
  
    localStorage["username"] = username;
  // }

  const game = new Game(localStorage["username"]);

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
    if (event.key === "Tab") {
      event.preventDefault()
    }
  })
  document.addEventListener("keyup", event => {
    const key = event.key.toLowerCase();
    if ((game.keyboard as any)[key] !== undefined) {
      (game.keyboard as any)[key] = false;
    }
  })

  document.addEventListener("mousedown", event => {
    game.mouse.lmb = true;
  })
  document.addEventListener("mouseup", event => {
    game.mouse.lmb = false;
  })


}
