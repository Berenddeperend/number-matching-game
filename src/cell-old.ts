import { Constraint } from "./game-old";

export default class CellOld {
  index: number;
  value: number;
  solved: boolean;
  constraints: Constraint[];
  element: HTMLDivElement;

  constructor(index: number) {
    const values = [1, 2, 3, 4, 2, 6, 7, 7, 9, 4, 3];
    const solvedIndexes = [4];

    this.constraints = [];
    this.index = index;
    this.value = values[index];
    this.solved = solvedIndexes.includes(index);

    this.element = document.createElement("div");
    this.element.classList.add("cell");
    if (this.solved) {
      this.element.classList.add("solved");
    }
    this.element.innerText = `${this.value}`;
    document.querySelector(".grid")?.appendChild(this.element);
  }
}
