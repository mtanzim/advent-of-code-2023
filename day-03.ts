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
type Visited = boolean[][];
type Coord = { rowIdx: number; colIdx: number };
function parse(input: string): string[][] {
  const lines = input.split("\n").filter(Boolean);
  return lines.map((l) => l.split(""));
}

const isNum = (c: string) => {
  return !isNaN(Number(c));
};

const isSym = (c: string) => {
  return !isNum(c) && c !== ".";
};

function checkNeighbors(grid: Grid, { rowIdx, colIdx }: Coord) {
  const len = grid.length;
  const width = grid[0].length;
  // visited[rowIdx][colIdx] = true;
  const v = grid[rowIdx][colIdx];
  if (isSym(v)) {
    return true;
  }

  const neighbors: Coord[] = [
    { rowIdx: rowIdx - 1, colIdx },
    { rowIdx: rowIdx + 1, colIdx },
    { rowIdx, colIdx: colIdx - 1 },
    { rowIdx, colIdx: colIdx + 1 },
    { rowIdx: rowIdx + 1, colIdx: colIdx + 1 },
    { rowIdx: rowIdx + 1, colIdx: colIdx - 1 },
    { rowIdx: rowIdx - 1, colIdx: colIdx + 1 },
    { rowIdx: rowIdx - 1, colIdx: colIdx - 1 },
  ].filter((c) => {
    const { rowIdx, colIdx } = c;
    return !(rowIdx < 0 || colIdx < 0 || rowIdx >= len || colIdx >= width);
  });

  return neighbors.map((n) => isSym(grid[n.rowIdx][n.colIdx])).some(Boolean);
}

function dfs(grid: Grid, visited: Visited, { rowIdx, colIdx }: Coord): boolean {
  const len = grid.length;
  const width = grid[0].length;
  // visited[rowIdx][colIdx] = true;
  const v = grid[rowIdx][colIdx];
  if (isSym(v)) {
    return true;
  }

  const neighbors: Coord[] = [
    { rowIdx: rowIdx - 1, colIdx },
    { rowIdx: rowIdx + 1, colIdx },
    { rowIdx, colIdx: colIdx - 1 },
    { rowIdx, colIdx: colIdx + 1 },
    { rowIdx: rowIdx + 1, colIdx: colIdx + 1 },
    { rowIdx: rowIdx + 1, colIdx: colIdx - 1 },
    { rowIdx: rowIdx - 1, colIdx: colIdx + 1 },
    { rowIdx: rowIdx - 1, colIdx: colIdx - 1 },
  ].filter((c) => {
    const { rowIdx, colIdx } = c;
    return !(rowIdx < 0 || colIdx < 0 || rowIdx >= len || colIdx >= width);
  }).filter((c) => {
    const { rowIdx, colIdx } = c;
    return !(visited[rowIdx][colIdx] === true);
  });

  if (isNum(v)) {
    console.log({
      v,
      neighbors: neighbors.map((n) => grid[n.rowIdx][n.colIdx]),
    });
  }

  if (neighbors.length === 0) {
    return false;
  }

  return neighbors.map((n) => dfs(grid, visited, n)).some(Boolean);
}

function pt1(grid: Grid) {
  const numbers: number[] = [];
  let startNum = -1;
  let endNum = -1;
  let truthTracker: boolean[] = [];

  grid.forEach((row, rowIdx) => {
    row.forEach((col, colIdx) => {
      // neutral state
      if (isNum(col) && endNum === -1 && startNum === -1) {
        startNum = colIdx;
        endNum = colIdx;
      }
      // started tracking a number
      if (isNum(col) && startNum > -1) {
        endNum = colIdx;
        const isAdjacent = checkNeighbors(grid, {
          rowIdx,
          colIdx,
        });
        truthTracker.push(isAdjacent);
      }
      // number ended, reset
      if (!isNum(col) && endNum > -1 && startNum > -1) {
        endNum = colIdx;
        const curNum = Number(row.slice(startNum, endNum).join(""));
        const willAdd = truthTracker.some(Boolean);
        if (willAdd) {
          numbers.push(curNum);
        }
        startNum = -1;
        endNum = -1;
        truthTracker = [];
      }
    });
  });
  return numbers.reduce((acc, cur) => acc + cur, 0);
}
// console.log(parse(exampleInput));
console.log(pt1(parse(exampleInput)));
