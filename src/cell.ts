export default class Cell {
  value: number;
  index: number; // can change when rows get cleared
  id: number;
  element: Element;
  solved: boolean;

  constructor(index: number, id: number, parentElement: Element) {
    this.value = Math.floor(Math.random() * 9 + 1);
    this.solved = false;
    this.index = index;
    this.id = id;
    this.element = document.createElement("div");
    this.element.setAttribute("data-index", this.index.toString());
    this.element.setAttribute("data-id", this.id.toString());
    this.element.classList.add("cell");
    this.element.classList.add("initial-frame");

    parentElement.appendChild(this.element);

    // window.requestAnimationFrame(() => {
    setTimeout(() => {
      // in plaats van dit, een animation delay doen. Want chrome.
      this.element.classList.remove("initial-frame");
    }, 100);
    // });

    this.render();
  }

  render() {
    this.element.innerHTML = this.value.toString();
  }

  pulse() {
    this.element.addEventListener(
      "animationend",
      () => {
        this.element.classList.remove("pulse");
      },
      { once: true }
    );
    this.element.classList.add("pulse");
  }

  solve() {
    this.solved = true;
    this.element.classList.add("solved");
  }

  toggleSelect() {
    this.element.classList.toggle("selected");
  }
}
