function extrapolatePt1(nums: number[]): number {
  let nextRow: number[] = [];
  let curRow = nums.slice();
  const ends: number[] = [];
  while (true) {
    for (let i = 1; i < curRow.length; i++) {
      nextRow.push(curRow[i] - curRow[i - 1]);
    }
    const newEnd = nextRow.at(-1);
    if (newEnd === undefined || isNaN(newEnd)) {
      throw Error("cannot determine newEnd");
    }
    ends.push(newEnd);
    if (nextRow.every((n) => n === 0)) {
      break;
    }
    curRow = nextRow.slice();
    nextRow = [];
  }
  const lastNum = nums.at(-1);
  if (lastNum === undefined) {
    throw Error("invalid num input");
  }
  return lastNum + ends.reduce((acc, cur) => acc + cur, 0);
}

function extrapolatePt2(nums: number[]): number {
  let nextRow: number[] = [];
  let curRow = nums.slice();
  const diffRows = [nums];
  while (true) {
    for (let i = 1; i < curRow.length; i++) {
      nextRow.push(curRow[i] - curRow[i - 1]);
    }

    diffRows.push(nextRow);
    curRow = nextRow.slice();
    if (nextRow.every((n) => n === 0)) {
      break;
    }
    nextRow = [];
  }

  let beginning = diffRows.at(-1)?.at(0);
  if (beginning === undefined) {
    throw Error("cannot get first beginning");
  }
  for (let i = diffRows.length - 2; i >= 0; i--) {
    beginning = diffRows[i][0] - beginning;
  }

  return beginning;
}

function pt2(rows: number[][]) {
  return rows.reduce((acc, row) => acc + extrapolatePt2(row), 0);
}

function pt1(rows: number[][]) {
  return rows.reduce((acc, row) => acc + extrapolatePt1(row), 0);
}

function parse(input: string): number[][] {
  return input.split("\n").filter(Boolean).map((l) => l.split(" ").map(Number));
}

function validateNums(numRows: number[][]): never | number[][] {
  numRows.flat().forEach((n) => {
    if (isNaN(n)) {
      throw Error("bad number");
    }
  });
  return numRows;
}

const exampleInput = `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`;

console.log(pt1(validateNums(parse(exampleInput))));
console.log(
  pt1(validateNums(parse(Deno.readTextFileSync("inputs/day-09.txt")))),
);

console.log(pt2(validateNums(parse(exampleInput))));
console.log(
  pt2(validateNums(parse(Deno.readTextFileSync("inputs/day-09.txt")))),
);
