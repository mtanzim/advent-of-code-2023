const exampleInput = `
Time:      7  15   30
Distance:  9  40  200
`;

const day6Input = `
Time:        44     89     96     91
Distance:   277   1136   1890   1768
`;

type Race = {
  time: number;
  distance: number;
};

function parse(input: string): Race[] {
  const [timesRaw, distancesRaw] = input.split("\n").filter(Boolean);
  const getNums = (raw: string) =>
    raw.replace("Time:", "").split(" ").map(Number).filter(
      (v) => !isNaN(v),
    ).filter((n) => n > 0);
  const times = getNums(timesRaw);
  const distances = getNums(distancesRaw);
  if (times.length !== distances.length) {
    throw new Error("Parsing error");
  }
  return times.map((t, idx) => {
    return {
      time: t,
      distance: distances[idx],
    };
  });
}

function pt1(races: Race[]): number {
  return races.map(({ time, distance }) => {
    let held = 0;
    while (held < time) {
      if (held * (time - held) > distance) {
        return time - 2 * held;
      }
      held++;
    }
    throw Error("should not be here");
  }).reduce((acc, cur) => acc * cur, 1);
}

function pt2(races: Race[]): number {
  const time = Number(races.map((r) => r.time).map(String).join(""));
  const distance = Number(races.map((r) => r.distance).map(String).join(""));
  return pt1([{ time, distance }]);
}

console.log(pt1(parse(exampleInput)));
console.log(pt1(parse(day6Input)));
console.log(pt2(parse(exampleInput)));
console.log(pt2(parse(day6Input)));
