import "./global.scss";
import "./game.scss";
// import { setupCounter } from "./counter";
import Game from "./game";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="game"></div>
`;

new Game(document.querySelector<HTMLButtonElement>(".game")!);

// setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
