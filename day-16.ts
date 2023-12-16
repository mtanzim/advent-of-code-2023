console.log("day 16");

const exampleInput = `
.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....
`;

type Mirrors = "/" | "\\";
type EmptySpace = ".";
type Splitters = "-" | "|";
type Dir = "^" | "v" | "<" | ">";

type Element = Mirrors | EmptySpace | Splitters;
type Grid = Element[][];
type TrackerGrid = (boolean | null)[][];
type Coord = { rowIdx: number; colIdx: number };

function toGrid(input: string): Grid {
  return input.split("\n").filter(Boolean).map((l) => l.split("")) as Grid;
}

function coordToStr(c: Coord) {
  return `${c.rowIdx}-${c.colIdx}`;
}

function traverseBeam(
  start: Coord,
  grid: Grid,
  startDir: Dir,
  trackerGrid: TrackerGrid,
  localVisited: Set<string>,
) {
  let curCoord = start;
  let curDir = startDir;
  let curElem;

  const visualizedTracker = trackerGrid.map((r) =>
    r.map((v) => v ? "#" : ".").join("")
  ).join("\n");
  // console.log(visualizedTracker);
  console.log({ start });

  if (localVisited.has(coordToStr(start))) {
    return;
  }

  localVisited.add(coordToStr(start));

  loop:
  while (true) {
    // went out of bounds
    if (grid?.[curCoord.rowIdx]?.[curCoord.colIdx] === undefined) {
      break;
    }
    // if (localVisited.has(coordToStr(curCoord))) {
    //   break loop;
    // }
    curElem = grid[curCoord.rowIdx][curCoord.colIdx];
    // console.log({ curElem, curDir, curCoord });
    trackerGrid[curCoord.rowIdx][curCoord.colIdx] = true;

    switch (true) {
      case curElem === ".":
        if (curDir === "^") {
          curCoord = { rowIdx: curCoord.rowIdx - 1, colIdx: curCoord.colIdx };
          continue loop;
        }
        if (curDir === "v") {
          curCoord = { rowIdx: curCoord.rowIdx + 1, colIdx: curCoord.colIdx };
          continue loop;
        }
        if (curDir === "<") {
          curCoord = { rowIdx: curCoord.rowIdx, colIdx: curCoord.colIdx - 1 };
          continue loop;
        }
        if (curDir === ">") {
          curCoord = { rowIdx: curCoord.rowIdx, colIdx: curCoord.colIdx + 1 };
          continue loop;
        }
        throw Error("invalid direction encountered");
      case curElem === "/":
        if (curDir === "^") {
          curCoord = {
            rowIdx: curCoord.rowIdx,
            colIdx: curCoord.colIdx + 1,
          };
          curDir = ">";
          continue loop;
        }
        if (curDir === "v") {
          curCoord = {
            rowIdx: curCoord.rowIdx,
            colIdx: curCoord.colIdx - 1,
          };
          curDir = "<";
          continue loop;
        }
        if (curDir === "<") {
          curCoord = {
            rowIdx: curCoord.rowIdx + 1,
            colIdx: curCoord.colIdx,
          };
          curDir = "v";
          continue loop;
        }
        if (curDir === ">") {
          curCoord = {
            rowIdx: curCoord.rowIdx - 1,
            colIdx: curCoord.colIdx,
          };
          curDir = "^";
          continue loop;
        }
        throw Error("invalid direction encountered");
      case curElem === "\\":
        if (curDir === "^") {
          curCoord = {
            rowIdx: curCoord.rowIdx,
            colIdx: curCoord.colIdx - 1,
          };
          curDir = "<";

          continue loop;
        }
        if (curDir === "v") {
          curCoord = {
            rowIdx: curCoord.rowIdx,
            colIdx: curCoord.colIdx + 1,
          };
          curDir = ">";
          continue loop;
        }
        if (curDir === "<") {
          curCoord = {
            rowIdx: curCoord.rowIdx - 1,
            colIdx: curCoord.colIdx,
          };
          curDir = "^";
          continue loop;
        }
        if (curDir === ">") {
          curCoord = {
            rowIdx: curCoord.rowIdx + 1,
            colIdx: curCoord.colIdx,
          };
          curDir = "v";
          continue loop;
        }
        throw Error("invalid direction encountered");
      case curElem === "-":
        if (curDir === "^") {
          traverseBeam(
            { rowIdx: curCoord.rowIdx, colIdx: curCoord.colIdx - 1 },
            grid,
            "<",
            trackerGrid,
            localVisited,
          );
          traverseBeam(
            { rowIdx: curCoord.rowIdx, colIdx: curCoord.colIdx + 1 },
            grid,
            ">",
            trackerGrid,
            localVisited,
          );
          break loop;
        }
        if (curDir === "v") {
          traverseBeam(
            { rowIdx: curCoord.rowIdx, colIdx: curCoord.colIdx - 1 },
            grid,
            "<",
            trackerGrid,
            localVisited,
          );
          traverseBeam(
            { rowIdx: curCoord.rowIdx, colIdx: curCoord.colIdx + 1 },
            grid,
            ">",
            trackerGrid,
            localVisited,
          );
          break loop;
        }
        if (curDir === "<") {
          curCoord = { rowIdx: curCoord.rowIdx, colIdx: curCoord.colIdx - 1 };
          continue loop;
        }
        if (curDir === ">") {
          curCoord = { rowIdx: curCoord.rowIdx, colIdx: curCoord.colIdx + 1 };
          continue loop;
        }
        throw Error("invalid direction encountered");
      case curElem === "|":
        if (curDir === ">") {
          traverseBeam(
            { rowIdx: curCoord.rowIdx - 1, colIdx: curCoord.colIdx },
            grid,
            "^",
            trackerGrid,
            localVisited,
          );
          traverseBeam(
            { rowIdx: curCoord.rowIdx + 1, colIdx: curCoord.colIdx },
            grid,
            "v",
            trackerGrid,
            localVisited,
          );
          break loop;
        }
        if (curDir === "<") {
          traverseBeam(
            { rowIdx: curCoord.rowIdx - 1, colIdx: curCoord.colIdx },
            grid,
            "^",
            trackerGrid,
            localVisited,
          );
          traverseBeam(
            { rowIdx: curCoord.rowIdx + 1, colIdx: curCoord.colIdx },
            grid,
            "v",
            trackerGrid,
            localVisited,
          );
          break loop;
        }
        if (curDir === "^") {
          curCoord = { rowIdx: curCoord.rowIdx - 1, colIdx: curCoord.colIdx };
          continue loop;
        }
        if (curDir === "v") {
          curCoord = { rowIdx: curCoord.rowIdx + 1, colIdx: curCoord.colIdx };
          continue loop;
        }
        throw Error("invalid direction encountered");
      default:
        throw Error("invalid element encountered");
    }
  }
}

function pt1(input: string) {
  const grid = toGrid(input);
  const trackerGrid = grid.map((r) => r.map((_) => null));
  // console.log({ trackerGrid });
  traverseBeam(
    { rowIdx: 0, colIdx: 0 },
    grid,
    ">",
    trackerGrid,
    new Set<string>(),
  );
  const visualizedTracker = trackerGrid.map((r) =>
    r.map((v) => v ? "#" : ".").join("")
  ).join("\n");
  console.log(visualizedTracker);
}

pt1(exampleInput);
