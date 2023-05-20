import Cell from './cell';

// export enum Constraint {
//   "left",
//   "right",
//   "bottom",
//   "last",
// }


const constraints = [
  "left",
  "right",
  "bottom",
  "last",
] as const;

const directions = ["right",
  "downRight",
  "down",
  "downLeft"] as const;


// const unavailableDirectionsFromConstraint = {
//   left: ["downLeft"],
//   right: ["downRight", "right"],
//   bottom: ["downLeft", "down", "downRight"],
//   last: ["right"],
// }



export default class Game {
  gridWidth: number;
  cells: Cell[];
  gridElement: HTMLElement;
  selectedCell: Cell | null;

  constructor(element: HTMLElement) {
    this.gridWidth = 3;
    this.gridElement = element;
    this.cells = [];
    this.selectedCell = null;
    this.initialize(element);
  }

  initialize(element: HTMLElement) {
    this.gridElement = document.createElement('div'); //todo: innerhtml
    this.gridElement.classList.add('grid');
    this.gridElement.style.gridTemplateColumns = `repeat(${this.gridWidth}, 1fr)`;
    element.appendChild(this.gridElement);

    this.addCells();

    this.attachEventListeners();

    this.getNeighborCells(this.cells[0])
  }


  private attachEventListeners() {
    (document.querySelector('.grid') as HTMLElement).addEventListener('click', (e) => {
      const target = e.target as Element;
      if (target.classList.contains('cell')) {
        const cell = this.cells.find(
          (cell) => cell.index === parseInt(target.getAttribute('data-index') as string)
        ) as Cell;

        if (!this.selectedCell) {
          this.selectedCell = cell || null;
          cell.toggleSelect();
        } else {
          const match = this.compareCells(this.selectedCell, cell);
          if (match) {
            this.selectedCell.solve();
            cell.solve();
          }
          this.selectedCell.toggleSelect();
          this.selectedCell = null;
          // this.addCells();
          // console.log(this.nextUnsolvedPair());
          this.nextUnsolvedPair().forEach((cell) => cell.pulse());
          if(!this.nextUnsolvedPair().length) {
            this.addCells();
          }
        }
      }
    });
  }

  private nextUnsolvedPair() {
    return this.cells
      .filter((cell) => !cell.solved)
      .reduce((acc: Cell[], curr) => {
        if (acc.length) return acc;

        const matchingNeighbor = this.getNeighborCells(curr)
          .filter((cell) => !cell.solved)
          .find((neighbor) => {
            return this.compareCellsByValue(curr, neighbor);
          });

        if (matchingNeighbor) acc = [curr, matchingNeighbor];

        return acc;
      }, []);
  }

  // private getLookDeltaFromDirection(direction: Direction) {
  //   switch (direction){
  //     case Direction.right:
  //       return 1;
  //     case Direction.downRight:
  //       return this.gridWidth + 1
  //     case Direction.down:
  //       return this.gridWidth;
  //     case Direction.downLeft:
  //       return this.gridWidth -1
  //   }
  // }

  private getLookDeltaFromDirection(direction: string) {
    switch (direction){
      case 'right':
        return 1;
      case 'downRight':
        return this.gridWidth + 1
      case 'down':
        return this.gridWidth;
      case 'downLeft':
        return this.gridWidth -1;
      default:
        throw new Error('this should not happen')
    }
  }
  
  private getCellConstraints(cellIndex: number) {
    const constraints = [];

    if(cellIndex % this.gridWidth === 0){
      constraints.push('left')
    }
    if(cellIndex % this.gridWidth === this.gridWidth - 1){
      constraints.push('right')
    } 
    if (cellIndex >= this.cells.length - this.gridWidth) {
      constraints.push('bottom')
    }
    if(cellIndex === this.cells.length - 1) {
      constraints.push('last')
    }
    return constraints as ("left" | "right" | "bottom" | "last")[];
  }

  private getAllowedDirectionsFromConstraints(constraints: ('left' | 'right' | 'bottom' | 'last')[]) {
    //geef directions die nog wel mogen op basis van een of meerdere constraints.

    const impossibleDirectionsForConstraint = {
      left: ["downLeft"],
      right: ["downRight", "right"],
      bottom: ["downLeft", "down", "downRight"],
      last: ["right", 'down', 'downRight', 'downLeft'],
    }

    const impossibleDirections = Array.from(new Set(constraints.map(constraint => impossibleDirectionsForConstraint[constraint]).flat()));

    return directions.filter(direction => !impossibleDirections.includes(direction))

  }

  private getNeighborCells(cell: Cell) {
    const cellIndex = cell.index;

    const ownConstraints = this.getCellConstraints(cellIndex);
    const possibleDirections = this.getAllowedDirectionsFromConstraints(ownConstraints);

    const output = possibleDirections.reduce((neighbourCells: Cell[], direction ) => {
      const lookDelta = this.getLookDeltaFromDirection(direction);
      // console.log(direction, lookDelta)

      const findNeighbourCellRecursive = (cell: Cell, delta: number) => {
        const neighbourCell = this.cells[cell.index + delta];

        if(!neighbourCell.solved) {
          console.log('got one for ' + direction + ', ' + neighbourCell.value)
          neighbourCells.push(neighbourCell);
        } else {
          const constraints = this.getCellConstraints(neighbourCell.index)
          
          if(this.getAllowedDirectionsFromConstraints(constraints).includes(direction)) {
            findNeighbourCellRecursive(neighbourCell, delta);
          }
        }
      }

      findNeighbourCellRecursive(cell, lookDelta);

      return neighbourCells;
    }, [])

    console.log("-> output", output);
    return output;
  }

  private addCells() {
    const elementsCount = this.gridWidth * 3.5;
    // const initialAnimationDuration = 400;

    for (let i = 0; i < Math.floor(elementsCount); i++) {
      // setTimeout(() => {
        this.cells.push(
          new Cell(this.cells.length, document.querySelector('.grid') as HTMLElement)
        );
      // }, (i * initialAnimationDuration) / elementsCount);
    }
  }

  private compareCells(cellA: Cell, cellB: Cell) {
    return this.compareCellsByValue(cellA, cellB) && this.compareCellsByPosition(cellA, cellB);
  }

  private compareCellsByPosition(cellA: Cell, cellB: Cell) {
    const sortedCells = [cellA, cellB].sort((a, b) => a.index - b.index);

    //only check right, down, and diagonal down. Todo: make recursive
    const neighborCells = this.getNeighborCells(sortedCells[0]);
    return neighborCells.includes(sortedCells[1]);
  }

  private compareCellsByValue(cellA: Cell, cellB: Cell) {
    return this.compareValue(cellA.value, cellB.value);
  }

  private compareValue(valueA: number, valueB: number) {
    return valueA === valueB || valueA + valueB === 10;
  }
}
