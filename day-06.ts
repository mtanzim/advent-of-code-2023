const exampleInput = `
Time:      7  15   30
Distance:  9  40  200
`;

type Race = {
  time: number;
  distance: number;
};

function parse(input: string): number {
  const [timesRaw, distancesRaw] = input.split("\n").filter(Boolean);
  const getNums = (raw: string) =>
    raw.replace("Time:", "").split(" ").map(Number).filter(
      (v) => !isNaN(v),
    ).filter((n) => n > 0);
  const times = getNums(timesRaw);
  const distances = getNums(distancesRaw);
  console.log({ times, distances, distancesRaw });
}

parse(exampleInput);
