import CellOld from "./cell-old";

export enum Constraint {
  "left",
  "right",
  "bottom",
  "last",
}

export enum Direction {
  "right",
  "downRight",
  "down",
  "downLeft",
}

const constraintsByDirection = new Map([
  [Direction.right, [Constraint.last]],
  [Direction.downRight, [Constraint.right, Constraint.bottom]],
  [Direction.down, [Constraint.bottom]],
  [Direction.downLeft, [Constraint.left, Constraint.bottom]],
]);

constraintsByDirection.get(Direction.right);

console.log(constraintsByDirection.get(Direction.down));

export default class GameOld {
  width: number;
  cells: CellOld[];

  constructor() {
    this.width = 3;
    this.cells = [];
    for (let i = 0; i < this.width * 3; i++) {
      this.cells.push(new CellOld(i));
    }

    this.cells.forEach((cell, index) => {
      cell.constraints = [this.getConstraintsByIndex(index)];
    });

    this.findMatchingPair();
  }

  private findMatchingPair() {
    const checkNextNeighbourRecursively = (
      startIndex: number,
      offset: number,
      targetValue: number
    ): CellOld | null => {
      const neighbour = this.cells[startIndex + offset];

      if (startIndex + offset > this.cells.length) {
        return null;
      }

      if (!neighbour.solved && neighbour.value === targetValue) {
        return neighbour;
      }

      return checkNextNeighbourRecursively(
        startIndex + offset,
        offset,
        targetValue
      );
    };

    const neighbour = checkNextNeighbourRecursively(
      1,
      this.width,
      this.cells[1].value
    );

    return neighbour;
  }

  // geef iedere cell zijn constraints (right, left, bottom, last)
  // loop door cells middels een direction.
  //    Direction heeft een offset en een constrainedBy

  getConstraintsByIndex(index: number) {
    const constraints = [];
    if (index % this.width === 0) {
      constraints.push(Constraint.left);
    }
    if (index === this.cells.length) {
      constraints.push(Constraint.last);
    }
  }

  // directionsWithConstraints = () => {
  //   right: {
  //     offset: 1,
  //     constraints: ['last']
  //   },
  //   bottomRight: {
  //     offset: this.width,
  //     constraints: []
  //   }
  // }
}
