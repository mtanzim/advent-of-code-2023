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
  cycleTracker: Set<string>,
) {
  let curCoord = start;
  let curDir = startDir;
  let curElem;

  if (cycleTracker.has(coordToStr(start))) {
    console.log({ start });
    return;
  }

  cycleTracker.add(coordToStr(start));

  let started = false;
  loop:
  while (true) {
    if (grid?.[curCoord.rowIdx]?.[curCoord.colIdx] === undefined) {
      break;
    }
    curElem = grid[curCoord.rowIdx][curCoord.colIdx];
    // console.log({ curElem });
    trackerGrid[curCoord.rowIdx][curCoord.colIdx] = true;
    if (coordToStr(curCoord) === coordToStr(start) && started) {
      console.log({ curCoord });
      break loop;
    }
    started = true;

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
            cycleTracker,
          );
          traverseBeam(
            { rowIdx: curCoord.rowIdx, colIdx: curCoord.colIdx + 1 },
            grid,
            ">",
            trackerGrid,
            cycleTracker,
          );
          break loop;
        }
        if (curDir === "v") {
          traverseBeam(
            { rowIdx: curCoord.rowIdx, colIdx: curCoord.colIdx - 1 },
            grid,
            "<",
            trackerGrid,
            cycleTracker,
          );
          traverseBeam(
            { rowIdx: curCoord.rowIdx, colIdx: curCoord.colIdx + 1 },
            grid,
            ">",
            trackerGrid,
            cycleTracker,
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
            cycleTracker,
          );
          traverseBeam(
            { rowIdx: curCoord.rowIdx + 1, colIdx: curCoord.colIdx },
            grid,
            "v",
            trackerGrid,
            cycleTracker,
          );
          break loop;
        }
        if (curDir === "<") {
          traverseBeam(
            { rowIdx: curCoord.rowIdx - 1, colIdx: curCoord.colIdx },
            grid,
            "^",
            trackerGrid,
            cycleTracker,
          );
          traverseBeam(
            { rowIdx: curCoord.rowIdx + 1, colIdx: curCoord.colIdx },
            grid,
            "v",
            trackerGrid,
            cycleTracker,
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
  return trackerGrid.reduce((acc, row) => {
    return acc + row.reduce((colAcc, v) => v ? colAcc + 1 : colAcc, 0);
  }, 0);
}

console.log(pt1(exampleInput));
console.log(pt1(Deno.readTextFileSync("inputs/day-16.txt")));
