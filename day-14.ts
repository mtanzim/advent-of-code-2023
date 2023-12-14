console.log("day 14");

const exampleInput = `
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....
`;

type Grid = string[][];

function toGrid(input: string): Grid {
  return input.split("\n").filter(Boolean).map((l) => l.split(""));
}

function toString(grid: Grid): string {
  return grid.map((row) => row.join("")).join("\n");
}

function moveAllNorth(grid: Grid) {
  grid.forEach((row, rowIdx) => {
    row.forEach((v, colIdx) => {
      if (v === "O") {
        let i = rowIdx - 1;
        while (i >= 0) {
          const cur = grid[i][colIdx];
          if (cur === ".") {
            i--;
          } else {
            break;
          }
        }
        const newRow = i + 1;
        if (newRow !== rowIdx) {
          grid[newRow][colIdx] = "O";
          grid[rowIdx][colIdx] = ".";
        }
      }
    });
  });
  return grid;
}

function countScore(grid: Grid) {
  const rowCount = grid.length;
  return grid.reduce((total, row, rowIdx) => {
    const rowLoad = rowCount - rowIdx;
    const rowScore = row.reduce((acc, c) => c === "O" ? acc + rowLoad : acc, 0);
    return total + rowScore;
  }, 0);
}

console.log(countScore(moveAllNorth(toGrid(exampleInput))));
console.log(
  countScore(moveAllNorth(toGrid(Deno.readTextFileSync("inputs/day-14.txt")))),
);
