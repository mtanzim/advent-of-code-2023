console.log("day 21");
const exampleInput = `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`;

const SOURCE = "S";
const ROCK = "#";

function toGrid(input: string): Grid {
  return input.split("\n").filter(Boolean).map((l) => l.split(""));
}

function toString(grid: Grid): string {
  return grid.map((row) => row.join("")).join("\n");
}

function findSource(g: Grid): Coord {
  let coord: Coord | undefined = undefined;
  g.forEach((row, rowIdx) => {
    if (coord) {
      return;
    }
    row.forEach((val, colIdx) => {
      if (val === SOURCE) {
        coord = { rowIdx, colIdx };
        return;
      }
    });
  });
  if (!coord) {
    throw Error("cannot find source");
  }
  return coord;
}
type Coord = {
  rowIdx: number;
  colIdx: number;
};
type Grid = string[][];

function solve(grid: Grid, maxCount: number): number {
  const marked = new Set<string>();
  const source = findSource(grid);
  let counter = 0;

  const toIndicator = (count: number, coord: Coord) =>
    `cnt:${count}||ri:${coord.rowIdx}||ci:${coord.colIdx}`;

  const toNormalized = (c: Coord): Coord => {
    const length = grid.length;
    const width = grid[0].length;
    const newRowIdx = (length + (c.rowIdx % length)) % length;
    const newColIdx = (width + (c.colIdx % width)) % width;
    return { rowIdx: newRowIdx, colIdx: newColIdx };
  };

  const dfs = () => {
    const stack: Array<[Coord, number]> = [];
    stack.push([source, 0]);
    while (stack.length > 0) {
      const cur = stack.pop();
      if (!cur) {
        throw Error("stack empty, invalid case");
      }
      const [ogCoord, curCount] = cur;
      const curIndicator = toIndicator(curCount, ogCoord);
      if (marked.has(curIndicator)) {
        continue;
      }
      marked.add(curIndicator);
      if (curCount === maxCount) {
        counter++;
        continue;
      }
      const neighbors: Coord[] = [
        { rowIdx: ogCoord.rowIdx, colIdx: ogCoord.colIdx + 1 },
        { rowIdx: ogCoord.rowIdx, colIdx: ogCoord.colIdx - 1 },
        { rowIdx: ogCoord.rowIdx + 1, colIdx: ogCoord.colIdx },
        { rowIdx: ogCoord.rowIdx - 1, colIdx: ogCoord.colIdx },
      ]
        .filter((c) =>
          grid[toNormalized(c).rowIdx][toNormalized(c).colIdx] !== ROCK
        ).filter((c) => {
          return !marked.has(toIndicator(curCount, c));
        });
      neighbors.forEach((c) => stack.push([c, curCount + 1]));
    }
  };
  dfs();

  return counter;
}

console.log(solve(toGrid(Deno.readTextFileSync("inputs/day-21.txt")), 64));
console.log(solve(toGrid(exampleInput), 6));
console.log(solve(toGrid(exampleInput), 10));
console.log(solve(toGrid(exampleInput), 50));
// console.log(solve(toGrid(Deno.readTextFileSync("inputs/day-21.txt")), 26501365));
