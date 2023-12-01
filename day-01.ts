const starterInput = `
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
`;

function solvePt1(input: string): number {
  return input
    .split("\n")
    .map((line) => {
      const digits = (line.match(/\d+/g) || []).join("")
      const num = Number(`${digits.at(0)}${digits.at(-1)}`) || 0;
      return num;
    })
    .reduce((acc, cur) => acc + cur);
}


console.log(solvePt1(starterInput));
const testInput = Deno.readTextFileSync("inputs/day-01.txt")
console.log(solvePt1(testInput))

