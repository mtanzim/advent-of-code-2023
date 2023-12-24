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

  let max = -1;

  while (stack.length > 0) {
    const top = stack.pop();

    if (!top) {
      throw Error("failed to get top of stack");
    }
    const [curCoord, curDistance, marked] = top;
    const curIndicator = toIndicator(curCoord);
    if (toIndicator(curCoord) === toIndicator(sink)) {
      max = Math.max(curDistance, max);
      console.log({ max });
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
  return max;
};

function pt1(grid: Grid): number {
  const [sink, source] = [findSink(grid), findSource(grid)];
  return dfs(source, grid, sink);
}

type AdjList = Map<string, Coord[]>;

function getAdjList(grid: Grid): AdjList {
  const adjList = new Map();
  grid.forEach((row, rowIdx) => {
    row.forEach((_, colIdx) => {
      const neighbors: Coord[] = [
        { rowIdx: rowIdx, colIdx: colIdx + 1 },
        { rowIdx: rowIdx, colIdx: colIdx - 1 },
        { rowIdx: rowIdx + 1, colIdx: colIdx },
        { rowIdx: rowIdx - 1, colIdx: colIdx },
      ]
        .filter((c) => grid?.[c.rowIdx]?.[c.colIdx] !== undefined)
        .filter((nc) => {
          const nv = grid[nc.rowIdx][nc.colIdx];
          return [PATH, U, D, L, R].some((d) => d === nv);
        });
      adjList.set(toIndicator({ rowIdx, colIdx }), neighbors);
    });
  });
  console.log({ adjList });
  return adjList;
}

const dfsAdj = (
  source: Coord,
  adjList: AdjList,
  sink: Coord,
): number => {
  const stack: Array<[Coord, number, Set<string>]> = [[
    source,
    0,
    new Set(),
  ]];

  let max = -1;

  while (stack.length > 0) {
    const top = stack.pop();

    if (!top) {
      throw Error("failed to get top of stack");
    }
    const [curCoord, curDistance, marked] = top;
    const curIndicator = toIndicator(curCoord);
    if (toIndicator(curCoord) === toIndicator(sink)) {
      max = Math.max(curDistance, max);
      console.log({ max });
      continue;
    }
    if (marked.has(curIndicator)) {
      continue;
    }
    marked.add(curIndicator);

    const neighbors = adjList.get(toIndicator(curCoord));
    if (!neighbors) {
      throw Error("cannot get neighbors");
    }
    neighbors.forEach((n) => {
      stack.push([n, curDistance + 1, new Set(marked)]);
    });
  }
  return max;
};

function pt2(grid: Grid): number {
  const [sink, source] = [findSink(grid), findSource(grid)];
  const adjList = getAdjList(grid);
  return dfsAdj(source, adjList, sink);
}

// console.log(pt1(toGrid(example)));
// console.log(pt2(toGrid(example)));
console.log(pt2(toGrid(Deno.readTextFileSync("inputs/day-23.txt"))));
