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

function expand(input: string): string {
  const lines = input.split("\n").filter(Boolean);

  const columnsWithGalaxies = new Set<number>();
  lines.forEach((l) => {
    l.split("").forEach((c, idx) => {
      if (c === "#") {
        columnsWithGalaxies.add(idx);
      }
    });
  });

  const columnsWithoutGalaxies = new Set<number>();
  new Array(lines[0].length).fill(null).forEach((_, idx) => {
    if (columnsWithGalaxies.has(idx)) {
      return;
    }
    columnsWithoutGalaxies.add(idx);
  });

  const expandedHorizontally = lines.reduce((acc, line) => {
    if (line.includes("#")) {
      return acc.concat(line);
    }
    return acc.concat([line, line]);
  }, [] as string[]);

  const expandedBoth = expandedHorizontally.map((l) => {
    return l.split("").reduce((acc, c, idx) => {
      if (columnsWithoutGalaxies.has(idx)) {
        return acc.concat([c, c]);
      }
      return acc.concat(c);
    }, [] as string[]).join("");
  }).join("\n");

  return expandedBoth;
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
  console.log({ ids });
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

function toSourceSinkStr(from: string, to: string) {
  return `${from}>${to}`;
}

function bfs(
  grid: string[][],
  sourceId: string,
  sourceCoordStr: string,
) {
  let count = 0;
  const pathDistances: Record<string, number> = {};
  const queue = [toCoord(sourceCoordStr)];
  const marked = new Set([sourceCoordStr]);
  while (queue.length !== 0) {
    const curNode = queue.shift();
    if (!curNode) {
      throw Error("error in bfs queue pop");
    }

    const { rowIdx, colIdx } = curNode;
    if (grid[rowIdx][colIdx] !== ".") {
      const sink = grid[rowIdx][colIdx];
      const keyFwd = toSourceSinkStr(sourceId, sink);
      const keyBwd = toSourceSinkStr(sink, sourceId);
      if (
        !pathDistances[keyFwd] && !pathDistances[keyBwd] && sourceId != sink
      ) {
        pathDistances[keyFwd] = count;
      }
    }
    count++;
    const neighbors: Coord[] = [
      { rowIdx, colIdx: colIdx + 1 },
      { rowIdx, colIdx: colIdx - 1 },
      { rowIdx: rowIdx + 1, colIdx },
      { rowIdx: rowIdx - 1, colIdx },
    ].filter((c) => grid?.[c.rowIdx]?.[c.colIdx] !== undefined)
      .filter((c) => !marked.has(toCoordKey(c)));

    for (const n of neighbors) {
      marked.add(toCoordKey(n));
      queue.push(n);
    }
  }
  return pathDistances;
}

function pt1(grid: string[][]): number {
  const idedGrid = idGalaxies(grid);
  const galaxyCoords = coordGalaxyIds(idedGrid);
  const pairsSet = getPairs(galaxyCoords);
  console.log(galaxyCoords);

  const testSourceId = "1";
  const testCoord = galaxyCoords[testSourceId];
  console.log(bfs(idedGrid, testSourceId, testCoord));

  // console.log(pairsSet);
  // console.log(pairsSet.size);
}

// const idedGrid = idGalaxies(toGrid(expand(exampleInput)));
console.log(pt1(toGrid(expand(exampleInput))));
