console.log("day 23");

const example = `
#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#
`;

const PATH = ".";
const FOREST = "#";
const U = "^";
const D = "v";
const L = "<";
const R = ">";

type Coord = {
  rowIdx: number;
  colIdx: number;
};
type Grid = string[][];

function toGrid(input: string): Grid {
  return input.split("\n").filter(Boolean).map((l) => l.split(""));
}

function toString(grid: Grid): string {
  return grid.map((row) => row.join("")).join("\n");
}
function findSource(grid: Grid): Coord {
  const colIdx = grid[0].findIndex((v) => v === PATH);
  return { colIdx, rowIdx: 0 };
}

function findSink(grid: Grid): Coord {
  const colIdx = grid.at(-1)?.findIndex((v) => v === PATH);
  if (!colIdx) throw Error("cannot find sink");
  return { colIdx, rowIdx: grid.length - 1 };
}

const toIndicator = (coord: Coord) => `ri:${coord.rowIdx}||ci:${coord.colIdx}`;
const dfs = (
  source: Coord,
  grid: Grid,
  sink: Coord,
  isSlippery = true,
): number => {
  const stack: Array<[Coord, number, Set<string>]> = [[
    source,
    0,
    new Set(),
  ]];

  const distances: number[] = [];

  while (stack.length > 0) {
    const top = stack.pop();

    if (!top) {
      throw Error("failed to get top of stack");
    }
    const [curCoord, curDistance, marked] = top;
    const curIndicator = toIndicator(curCoord);
    if (toIndicator(curCoord) === toIndicator(sink)) {
      distances.push(curDistance);
      continue;
    }
    if (marked.has(curIndicator)) {
      continue;
    }
    marked.add(curIndicator);

    const neighbors: Coord[] = [
      { rowIdx: curCoord.rowIdx, colIdx: curCoord.colIdx + 1 },
      { rowIdx: curCoord.rowIdx, colIdx: curCoord.colIdx - 1 },
      { rowIdx: curCoord.rowIdx + 1, colIdx: curCoord.colIdx },
      { rowIdx: curCoord.rowIdx - 1, colIdx: curCoord.colIdx },
    ]
      .filter((c) => grid?.[c.rowIdx]?.[c.colIdx] !== undefined)
      .filter((c) => !marked.has(toIndicator(c)))
      .filter((nc) => {
        const cv = grid[curCoord.rowIdx][curCoord.colIdx];
        const nv = grid[nc.rowIdx][nc.colIdx];
        if (isSlippery) {
          if (cv === L) {
            return nc.colIdx === curCoord.colIdx - 1;
          }
          if (cv === R) {
            return nc.colIdx === curCoord.colIdx + 1;
          }
          if (cv === U) {
            return nc.rowIdx === curCoord.rowIdx - 1;
          }
          if (cv === D) {
            return nc.rowIdx === curCoord.rowIdx + 1;
          }
        }
        return [PATH, U, D, L, R].some((d) => d === nv);
      });
    neighbors.forEach((n) => {
      stack.push([n, curDistance + 1, new Set(marked)]);
    });
  }
  return distances.reduce(
    (max, cur) => cur > max ? cur : max,
    Number.MIN_SAFE_INTEGER,
  );
};

function pt1(grid: Grid): number {
  const [sink, source] = [findSink(grid), findSource(grid)];
  return dfs(source, grid, sink);
}

function pt2(grid: Grid): number {
  const [sink, source] = [findSink(grid), findSource(grid)];
  return dfs(source, grid, sink, false);
}

console.log(pt1(toGrid(example)));
console.log(pt2(toGrid(example)));
console.log(pt2(toGrid(Deno.readTextFileSync("inputs/day-23.txt"))));