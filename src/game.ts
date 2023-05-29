import Cell from "./cell";

const directions = ["right", "downRight", "down", "downLeft"] as const;

export default class Game {
  gridWidth: number;
  cells: Cell[];
  gridElement: HTMLElement;
  selectedCell: Cell | null;
  drawnCells: number;

  constructor(element: HTMLElement) {
    this.gridWidth = 9;
    this.gridElement = element;
    this.cells = [];
    this.selectedCell = null;
    this.drawnCells = 0;
    this.initialize(element);
  }

  initialize(element: HTMLElement) {
    this.gridElement = document.createElement("div"); //todo: innerhtml
    this.gridElement.classList.add("grid");
    this.gridElement.style.gridTemplateColumns = `repeat(${this.gridWidth}, 1fr)`;
    element.appendChild(this.gridElement);

    this.addCells();

    this.attachEventListeners();

    this.autoplay();
  }

  private autoplay() {
    setInterval(() => {
      const pair = this.nextUnsolvedPair();
      if (pair.length) {
        pair.forEach((cell) => {
          cell.pulse();
        });
        setTimeout(() => this.solvePair(pair), 500);
      } else {
        this.addCells();
      }
    }, 1000);
  }

  private solvePair(cells: Cell[]) {
    cells.forEach((cell) => cell.solve());
    this.clearEmptyRows();
  }

  private clearEmptyRows() {
    const getRows = () => {
      const rows: Cell[][] = [];
      for (let i = 0; i < this.cells.length / this.gridWidth; i++) {
        rows.push(
          this.cells.slice(
            i * this.gridWidth,
            i * this.gridWidth + this.gridWidth
          )
        );
      }
      return rows;
    };

    const emptyRows = getRows().filter((row) =>
      row.every((cell) => cell.solved)
    );

    emptyRows.forEach((row) => {
      row.forEach((cell) => {
        cell.element.remove();
      });
      this.cells.splice(row[0].index, this.gridWidth);
      this.cells.forEach((cell, i) => {
        cell.index = i;
        cell.element.setAttribute("data-index", i.toString());
      });
    });
  }

  private attachEventListeners() {
    (document.querySelector(".grid") as HTMLElement).addEventListener(
      "click",
      (e) => {
        const target = e.target as Element;
        if (target.classList.contains("cell")) {
          const cell = this.cells.find(
            (cell) =>
              cell.index ===
              parseInt(target.getAttribute("data-index") as string)
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
            this.nextUnsolvedPair().forEach((cell) => cell.pulse());
            if (!this.nextUnsolvedPair().length) {
              this.addCells();
            }
          }
        }
      }
    );
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

  private getLookDeltaFromDirection(direction: string) {
    switch (direction) {
      case "right":
        return 1;
      case "downRight":
        return this.gridWidth + 1;
      case "down":
        return this.gridWidth;
      case "downLeft":
        return this.gridWidth - 1;
      default:
        throw new Error("this should not happen");
    }
  }

  private getCellConstraints(cellIndex: number) {
    const constraints = [];

    if (cellIndex % this.gridWidth === 0) {
      constraints.push("left");
    }
    if (cellIndex % this.gridWidth === this.gridWidth - 1) {
      constraints.push("bottomRight");
    }
    if (cellIndex >= this.cells.length - this.gridWidth) {
      constraints.push("bottom");
    }
    if (cellIndex + this.gridWidth + 1 >= this.cells.length) {
      constraints.push("bottom", "right");
    }
    if (cellIndex === this.cells.length - 1) {
      constraints.push("last");
    }
    return constraints as (
      | "left"
      | "right"
      | "bottom"
      | "last"
      | "bottomRight"
    )[];
  }

  private getAllowedDirectionsFromConstraints(
    constraints: ("left" | "right" | "bottom" | "last" | "bottomRight")[]
  ) {
    const impossibleDirectionsForConstraint = {
      left: ["downLeft"],
      right: ["downRight", "right"],
      bottom: ["downLeft", "down", "downRight"],
      bottomRight: ["downRight"],
      last: ["right", "down", "downRight", "downLeft"],
    };

    const impossibleDirections = Array.from(
      new Set(
        constraints
          .map((constraint) => impossibleDirectionsForConstraint[constraint])
          .flat()
      )
    );
    return directions.filter(
      (direction) => !impossibleDirections.includes(direction)
    );
  }

  private getNeighborCells(cell: Cell) {
    const cellIndex = cell.index;

    const ownConstraints = this.getCellConstraints(cellIndex);
    const possibleDirections =
      this.getAllowedDirectionsFromConstraints(ownConstraints);

    return possibleDirections.reduce((neighbourCells: Cell[], direction) => {
      const lookDelta = this.getLookDeltaFromDirection(direction);

      const findNeighbourCellRecursive = (cell: Cell, delta: number) => {
        const neighbourCell = this.cells[cell.index + delta];

        if (neighbourCell && !neighbourCell.solved) {
          neighbourCells.push(neighbourCell);
        } else {
          const constraints = this.getCellConstraints(neighbourCell.index);

          if (
            this.getAllowedDirectionsFromConstraints(constraints).includes(
              direction
            )
          ) {
            findNeighbourCellRecursive(neighbourCell, delta);
          }
        }
      };

      findNeighbourCellRecursive(cell, lookDelta);

      return neighbourCells;
    }, []);
  }

  private addCells() {
    const elementsCount = this.gridWidth * 3.5;
    // const initialAnimationDuration = 400;

    for (let i = 0; i < Math.floor(elementsCount); i++) {
      // setTimeout(() => {
      this.cells.push(
        new Cell(
          this.cells.length,
          this.drawnCells++,
          document.querySelector(".grid") as HTMLElement
        )
      );
      // }, (i * initialAnimationDuration) / elementsCount);
    }
  }

  private compareCells(cellA: Cell, cellB: Cell) {
    return (
      this.compareCellsByValue(cellA, cellB) &&
      this.compareCellsByPosition(cellA, cellB)
    );
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
