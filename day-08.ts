// console.log("hello day 8");

type Direction = "R" | "L";
type Coord = string;
type NextCoord = Record<Direction, Coord>;
type Game = {
  dirs: Direction[];
  steps: Record<Coord, NextCoord>;
};

function parse(input: string): Game {
  const lines = input.split("\n").filter(Boolean);
  const dirs = lines[0].split("") as Direction[];
  const steps = Object.fromEntries(
    lines.slice(1).map((l) => {
      const [cur, nexRaw] = l.split("=").map((token) =>
        token.replaceAll(" ", "")
      );
      const [L, R] = nexRaw.replace("(", "").replace(")", "").split(",");

      return [cur, { L, R }];
    }),
  );

  return { dirs, steps };
}

function pt1(game: Game): number {
  const { dirs, steps } = game;
  let i = 0;
  let counter = 0;
  const start = "AAA";
  const end = "ZZZ";

  let coord = start;
  while (true) {
    if (i === dirs.length) {
      i = 0;
    }
    const curDir = dirs[i];
    coord = steps[coord][curDir];
    counter++;
    if (coord === end) {
      break;
    }
    i++;
  }
  return counter;
}

function pt1WithArgs(game: Game, start: string, end: string): number {
  const { dirs, steps } = game;
  let i = 0;
  let counter = 0;

  let coord = start;
  while (true) {
    if (i === dirs.length) {
      i = 0;
    }
    const curDir = dirs[i];
    coord = steps[coord][curDir];
    counter++;
    if (coord === end) {
      break;
    }
    i++;
  }
  return counter;
}

function pt2(game: Game): number {
  const { dirs, steps } = game;
  let i = 0;
  let counter = 0;
  const starts = Object.keys(steps).filter((c) => c.endsWith("A"));
  const ends = Object.keys(steps).filter((c) => c.endsWith("Z"));
  console.log({ starts, ends });

  if (starts.length !== ends.length) {
    throw Error("invalid game, start and end counts mismatch");
  }
  const expectedEnd = "Z".repeat(starts.length);

  let coords = starts;

  while (true) {
    if (i === dirs.length) {
      i = 0;
    }
    const curDir = dirs[i];
    coords = coords.map((c) => steps[c][curDir]);
    counter++;
    // console.log({ coords });
    const lastChars = coords.map((c) => c.at(-1)).join("");

    if (lastChars === expectedEnd) {
      break;
    }
    i++;
  }
  return counter;
}

const exampleInput1 = `
RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)
`;

const exampleInput2 = `
LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)
`;

const exampleInput3 = `
LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX
`;

console.log(pt1(parse(exampleInput1)));
console.log(pt1(parse(exampleInput2)));
console.log(pt1(parse(Deno.readTextFileSync("inputs/day-08.txt"))));

console.log(pt2(parse(exampleInput3)));
console.log(pt2(parse(Deno.readTextFileSync("inputs/day-08.txt"))));
