const starterInput = `
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
`;

const starterInputPt2 = `
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
`;

function solvePt1(input: string): number {
  return input
    .split("\n")
    .map((line) => {
      const digits = (line.match(/\d+/g) || []).join("");
      const num = Number(`${digits.at(0)}${digits.at(-1)}`) || 0;
      return num;
    })
    .reduce((acc, cur) => acc + cur);
}

function solvePt2(input: string): number {
  return input.split("\n").map((line) => {
    const hm = Object.fromEntries(
      ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
        .map((strNum, idx) => [strNum, String(idx + 1)]),
    );

    const allDigits = Object.keys(hm).concat(Object.values(hm));

    const res = allDigits.map((d) => {
      const idx = line.indexOf(d);
      return { digit: d, idx, line };
    }).concat(allDigits.map((d) => {
      const idx = line.lastIndexOf(d);
      return { digit: d, idx, line };
    })).filter(({ idx }) => idx > -1)
      .toSorted((a, b) => a.idx - b.idx)
      .map(({ digit, idx, line }) => {
        console.log({ digit, idx, line });
        if (isNaN(Number(digit))) {
          return Number(hm[digit]);
        }
        return Number(digit);
      });

    return { digits: res, line };
  }).map(({ digits }) => {
    const v = Number(`${digits.at(0)}${digits.at(-1)}`) || 0;

    return v;
  })
    .reduce((acc, cur) => acc + cur);
}

const testInput = Deno.readTextFileSync("inputs/day-01.txt");
function pt1() {
  console.log(solvePt1(starterInput));
  console.log(solvePt1(testInput));
}

function pt2() {
  console.log(solvePt2(starterInputPt2));
  console.log(solvePt2(testInput));
}

pt2();
