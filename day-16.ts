console.log("day 16");

const exampleInput = `
.|...\....
|.-.\.....
.....|-...
........|.
..........
.........\
..../.\\..
.-.-/..|..
.|....-|.\
..//.|....
`;

type Mirrors = "/" | "\\";
type EmptySpace = ".";
type Splitters = "-" | "|";
type Dir = "^" | "v" | "<" | ">";

type Element = Mirrors | EmptySpace | Splitters;
type Grid = Element[][];
type TrackerGrid = Element[][];
type Coord = { rowIdx: number; colIdx: number };

function toGrid(input: string): Grid {
  return input.split("\n").filter(Boolean).map((l) => l.split("")) as Grid;
}

function traverseBeam(
  start: Coord,
  grid: Grid,
  startDir: Dir,
  trackerGrid: boolean[][],
) {
  let curCoord = start;
  let curDir = startDir;
  let curElem = grid[curCoord.rowIdx][curCoord.colIdx];
  while (true) {
    if (grid?.[curCoord.rowIdx]?.[curCoord.colIdx] === undefined) {
      break;
    }
    curElem = grid[curCoord.rowIdx][curCoord.colIdx];

    console.log({ curElem, curDir });
    trackerGrid[curCoord.rowIdx][curCoord.colIdx] = true;
    switch (true) {
      case curElem === ".":
        if (curDir === "^") {
          curCoord = { rowIdx: curCoord.rowIdx, colIdx: curCoord.colIdx - 1 };
          continue;
        }
        if (curDir === "v") {
          curCoord = { rowIdx: curCoord.rowIdx, colIdx: curCoord.colIdx + 1 };
          continue;
        }
        if (curDir === "<") {
          curCoord = { rowIdx: curCoord.rowIdx - 1, colIdx: curCoord.colIdx };
          continue;
        }
        if (curDir === ">") {
          curCoord = { rowIdx: curCoord.rowIdx + 1, colIdx: curCoord.colIdx };
          continue;
        }
        throw Error("invalid direction encountered");
      case curElem === "/":
        if (curDir === "^") {
          curCoord = { rowIdx: curCoord.rowIdx + 1, colIdx: curCoord.colIdx };
          curDir = ">";
          continue;
        }
        if (curDir === "v") {
          curCoord = { rowIdx: curCoord.rowIdx, colIdx: curCoord.colIdx - 1 };
          curDir = "<";
          continue;
        }
        if (curDir === "<") {
          curCoord = { rowIdx: curCoord.rowIdx + 1, colIdx: curCoord.colIdx };
          curDir = "v";
          continue;
        }
        if (curDir === ">") {
          curCoord = { rowIdx: curCoord.rowIdx - 1, colIdx: curCoord.colIdx };
          curDir = "^";
          continue;
        }
        throw Error("invalid direction encountered");
      case curElem === "\\":
        if (curDir === "^") {
          curCoord = { rowIdx: curCoord.rowIdx, colIdx: curCoord.colIdx - 1 };
          curDir = "<";

          continue;
        }
        if (curDir === "v") {
          curCoord = { rowIdx: curCoord.rowIdx, colIdx: curCoord.colIdx + 1 };
          curDir = ">";
          continue;
        }
        if (curDir === "<") {
          curCoord = { rowIdx: curCoord.rowIdx - 1, colIdx: curCoord.colIdx };
          curDir = "^";
          continue;
        }
        if (curDir === ">") {
          curCoord = { rowIdx: curCoord.rowIdx + 1, colIdx: curCoord.colIdx };
          curDir = "v";
          continue;
        }
        throw Error("invalid direction encountered");
      case curElem === "-":
        if (curDir === "^" || curDir === "v") {
          traverseBeam(
            { rowIdx: curCoord.rowIdx, colIdx: curCoord.colIdx - 1 },
            grid,
            "<",
            trackerGrid,
          );
          traverseBeam(
            { rowIdx: curCoord.rowIdx, colIdx: curCoord.colIdx + 1 },
            grid,
            ">",
            trackerGrid,
          );
          break;
        }
        if (curDir === "<") {
          curCoord = { rowIdx: curCoord.rowIdx - 1, colIdx: curCoord.colIdx };
          continue;
        }
        if (curDir === ">") {
          curCoord = { rowIdx: curCoord.rowIdx + 1, colIdx: curCoord.colIdx };
          continue;
        }
        throw Error("invalid direction encountered");
      case curElem === "|":
        if (curDir === "^" || curDir === "v") {
          traverseBeam(
            { rowIdx: curCoord.rowIdx - 1, colIdx: curCoord.colIdx },
            grid,
            "^",
            trackerGrid,
          );
          traverseBeam(
            { rowIdx: curCoord.rowIdx + 1, colIdx: curCoord.colIdx },
            grid,
            "v",
            trackerGrid,
          );
          break;
        }
        if (curDir === "<") {
          curCoord = { rowIdx: curCoord.rowIdx, colIdx: curCoord.colIdx - 1 };
          continue;
        }
        if (curDir === ">") {
          curCoord = { rowIdx: curCoord.rowIdx, colIdx: curCoord.colIdx + 1 };
          continue;
        }
        throw Error("invalid direction encountered");
      default:
        throw Error("invalid element encountered");
    }
  }
}

function pt1(input: string) {
  const grid = toGrid(input);
  const trackerGrid = grid.map((r) => r.map((_) => false));
  console.log({ trackerGrid });
  traverseBeam({ rowIdx: 0, colIdx: 0 }, grid, ">", trackerGrid);
  console.log(trackerGrid);
}

pt1(exampleInput);
