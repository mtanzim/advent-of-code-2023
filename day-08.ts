console.log("hello day 8");

const exampleInput = `
RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)
`;

type Direction = "R" | "L";
type Coord = string;
type NextCoord = {
  left: Direction;
  right: Direction;
};
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
      const [left, right] = nexRaw.replace("(", "").replace(")", "").split(",");

      return [cur, { left, right } as NextCoord];
    }),
  );

  return { dirs, steps };
}

console.log(parse(exampleInput));
