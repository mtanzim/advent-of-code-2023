const exampleInput = `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`;

function determineEmpties(
  input: string,
): { emptyCols: Set<number>; emptyRows: Set<number> } {
  const lines = input.split("\n").filter(Boolean);

  const columnsWithGalaxies = new Set<number>();
  lines.forEach((l) => {
    l.split("").forEach((c, idx) => {
      if (c === "#") {
        columnsWithGalaxies.add(idx);
      }
    });
  });

  const emptyCols = new Set<number>();
  new Array(lines[0].length).fill(null).forEach((_, idx) => {
    if (columnsWithGalaxies.has(idx)) {
      return;
    }
    emptyCols.add(idx);
  });

  const emptyRows = new Set<number>();
  lines.forEach((l, idx) => {
    if (!l.includes("#")) {
      emptyRows.add(idx);
    }
  });

  return {
    emptyRows,
    emptyCols,
  };
}

function toGrid(input: string): string[][] {
  return input.split("\n").map((l) => l.split(""));
}

function toString(grid: string[][]): string {
  return grid.map((row) => row.join("")).join("\n");
}

function idGalaxies(grid: string[][]): string[][] {
  const clone = grid.map((r) => r.slice());
  let counter = 1;
  grid.forEach((r, rIdx) => {
    r.forEach((c, cIdx) => {
      if (c === "#") {
        clone[rIdx][cIdx] = String(counter);
        counter++;
      }
    });
  });
  return clone;
}

type Coord = { rowIdx: number; colIdx: number };
type CoordKey = string;

function toCoordKey({ rowIdx, colIdx }: Coord): CoordKey {
  return `${rowIdx}-${colIdx}`;
}

function toCoord(key: CoordKey): Coord {
  const [rowIdx, colIdx] = key.split("-").map(Number);
  return { rowIdx, colIdx };
}
function coordGalaxyIds(grid: string[][]): Record<string, string> {
  const res: Record<string, string> = {};
  grid.forEach((r, rowIdx) => {
    r.forEach((c, colIdx) => {
      if (c !== ".") {
        res[c] = toCoordKey({ rowIdx, colIdx });
      }
    });
  });
  return res;
}

function getPairs(galaxyCoords: Record<string, string>): Set<[string, string]> {
  const pairs = [] as [string, string][];
  const ids = Object.keys(galaxyCoords);
  const tracker = new Set<string>();
  for (const id1 of ids) {
    for (const id2 of ids) {
      if (id1 === id2) {
        continue;
      }
      const forward = `${id1}-${id2}`;
      const backward = `${id2}-${id1}`;
      if (tracker.has(forward) || tracker.has(backward)) {
        continue;
      }
      pairs.push([id1, id2]);
      tracker.add(forward);
      tracker.add(backward);
    }
  }
  return new Set(pairs);
}

const solve = (emptinessFactor: number) => (input: string) => {
  const grid = toGrid(input);
  const { emptyRows, emptyCols } = determineEmpties(input);
  const idedGrid = idGalaxies(grid);
  const galaxyCoords = coordGalaxyIds(idedGrid);
  const pairsSet = getPairs(galaxyCoords);

  let total = 0;
  for (const p of pairsSet) {
    const [a, b] = p;
    const aCoord = toCoord(galaxyCoords[a]);
    const bCoord = toCoord(galaxyCoords[b]);
    const minCol = Math.min(aCoord.colIdx, bCoord.colIdx);
    const maxCol = Math.max(aCoord.colIdx, bCoord.colIdx);
    const minRow = Math.min(aCoord.rowIdx, bCoord.rowIdx);
    const maxRow = Math.max(aCoord.rowIdx, bCoord.rowIdx);

    let deltaCol = 0;
    for (let i = minCol; i < maxCol; i++) {
      if (emptyCols.has(i)) {
        deltaCol += emptinessFactor - 1;
      }
      deltaCol++;
    }

    let deltaRow = 0;
    for (let i = minRow; i < maxRow; i++) {
      if (emptyRows.has(i)) {
        deltaRow += emptinessFactor - 1;
      }
      deltaRow++;
    }

    total += deltaCol + deltaRow;
  }

  return total;
};

console.log(solve(2)(exampleInput));
console.log(solve(10)(exampleInput));
console.log(solve(2)(Deno.readTextFileSync("inputs/day-11.txt")));
console.log(solve(1000000)(Deno.readTextFileSync("inputs/day-11.txt")));
