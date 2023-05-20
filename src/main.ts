import "./global.scss";
import "./game.scss";
import Game from "./game";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="game"></div>
`;

new Game(document.querySelector<HTMLButtonElement>(".game")!);
