const exampleInput = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`;

type Grid = string[][];
type Coord = { rowIdx: number; colIdx: number };
function parse(input: string): string[][] {
  const lines = input.split("\n").filter(Boolean);
  return lines.map((l) => l.split(""));
}

const isNum = (c: string) => {
  const digitPattern = /\d/g;
  return c.match(digitPattern);
};

const isSym = (c: string) => {
  return !isNum(c) && c !== ".";
};

function checkNeighbors(grid: Grid, { rowIdx, colIdx }: Coord) {
  const neighbors: Coord[] = [
    { rowIdx: rowIdx - 1, colIdx },
    { rowIdx: rowIdx + 1, colIdx },
    { rowIdx, colIdx: colIdx - 1 },
    { rowIdx, colIdx: colIdx + 1 },
    { rowIdx: rowIdx + 1, colIdx: colIdx + 1 },
    { rowIdx: rowIdx + 1, colIdx: colIdx - 1 },
    { rowIdx: rowIdx - 1, colIdx: colIdx + 1 },
    { rowIdx: rowIdx - 1, colIdx: colIdx - 1 },
  ].filter((n) => {
    return grid?.[n.rowIdx]?.[n.colIdx] !== undefined;
  });

  return neighbors.map((n) => isSym(grid[n.rowIdx][n.colIdx])).some(Boolean);
}

function pt1(grid: Grid) {
  const numbers: number[] = [];
  let startNum: number | null = null;

  grid.forEach((row, rowIdx) => {
    row.forEach((col, colIdx) => {
      // neutral state
      if (isNum(col) && startNum === null) {
        startNum = colIdx;
      }
      // number ended, reset
      if (!isNum(col) && startNum !== null) {
        const curNum = Number(row.slice(startNum, colIdx).join(""));
        let willAdd = false;
        // console.log({curNum})
        for (let i = startNum; i < colIdx; i++) {
          willAdd = willAdd || checkNeighbors(grid, { rowIdx, colIdx: i });
        }
        if (willAdd) {
          numbers.push(curNum);
        }
        startNum = null;
      }
    });
  });
  return numbers.reduce((acc, cur) => acc + cur, 0);
}
console.log(pt1(parse(exampleInput)));
console.log(pt1(parse(Deno.readTextFileSync("inputs/day-03.txt"))));
