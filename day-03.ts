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
type Coord = { rowIdx: number; colIdx: number };
function parse(input: string): string[][] {
  const lines = input.split("\n").filter(Boolean);
  return lines.map((l) => l.split(""));
}

const isSym = (c: string) => {
  const symbolPattern = /[^0-9.]/;

  return c.match(symbolPattern);
};

function checkNs(
  grid: Grid,
  rowIdx: number,
  colStart: number,
  colEnd: number,
  num: number,
) {
  const ns: Coord[] = [{ rowIdx, colIdx: colStart - 1 }, {
    rowIdx,
    colIdx: colEnd + 1,
  }];

  for (let i = colStart - 1; i <= colEnd + 1; i++) {
    ns.push({ rowIdx: rowIdx - 1, colIdx: i });
    ns.push({ rowIdx: rowIdx + 1, colIdx: i });
  }

  const validNs = ns.filter((n) => {
    return grid?.[n.rowIdx]?.[n.colIdx] !== undefined;
  });
  return validNs.some((n) => isSym(grid[n.rowIdx][n.colIdx]));
}

function pt1(grid: Grid) {
  let res = 0;
  grid.forEach((row, rowIdx) => {
    const numberPattern = /\d+/g;
    let match;
    while ((match = numberPattern.exec(row.join(""))) !== null) {
      const start = match.index;
      const end = match.index + match[0].length - 1;
      const val = Number(match[0]);
      const willAdd = checkNs(
        grid,
        rowIdx,
        start,
        end,
        val,
      );
      if (willAdd) {
        res += val;
      }
    }
  });

  return res;
}
console.log(pt1(parse(exampleInput)));
console.log(pt1(parse(Deno.readTextFileSync("inputs/day-03.txt"))));
