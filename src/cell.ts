import { Constraint } from './game-old';



export default class Cell {
  value: number;
  index: number;
  // checked: boolean;
  element: Element;
  solved: boolean;
  constraints: Constraint[];

  constructor(index: number, parentElement: Element) {
    const values = [1, 2, 3, 4, 2, 6, 7, 7, 9, 3, 2];
    const solvedIndexes:number[] = [];


    // this.value = Math.floor(Math.random() * 9 + 1);
    // this.solved = false;
    this.value = values[index];
    this.solved = solvedIndexes.includes(index);

    this.index = index;
    this.constraints = [];

    this.element = document.createElement('div');


    this.element.setAttribute('data-index', this.index.toString());
    this.element.classList.add('cell');
    this.element.classList.add('initial-frame');

    parentElement.appendChild(this.element);

    // window.requestAnimationFrame(() => {
      setTimeout(() => {

        // in plaats van dit, een animation delay doen. Want chrome.
        this.element.classList.remove('initial-frame');
      }, 100);
    // });



    // anime({
    // 	targets: this.element,
    // 	left: '240px',
    // 	easing: 'easeInOutQuad'
    // });
    this.render();
  }

  render() {
    this.element.innerHTML = this.value.toString();
  }

  pulse() {
    this.element.addEventListener('animationend', () => {
      this.element.classList.remove('pulse');
    })
    this.element.classList.add('pulse');
    // setTimeout(() => {
    // 	this.element.classList.remove('pulse');
    // }, 300);
  }

  solve() {
    this.solved = true;
    this.element.classList.add('solved');
  }

  toggleSelect() {
    this.element.classList.toggle('selected');
  }
}
