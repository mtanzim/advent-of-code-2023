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

console.log(toString(idGalaxies(toGrid(expand(exampleInput)))));
