const exampleInput = `
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
`;

type Colors = "red" | "green" | "blue";
type Game = Record<Colors | "id", number>;

const maxColors: Record<Colors, number> = {
  blue: 14,
  green: 13,
  red: 12,
};

function parse(input: string): Game[] {
  return input.split("\n").filter((line) => !!line).flatMap((line) => {
    const [idHolder, countsRaw] = line.split(":");
    const id = Number(idHolder.replace("Game ", ""));
    // TODO: flatten sets for now
    // const counts = countsRaw.replaceAll(";", ",").split(",");
    const sets = countsRaw.split(";");
    // console.log(sets);
    return sets.map((s) => {
      // console.log(s);
      const counts = s.split(",");
      // console.log(counts);
      const game: Game = {
        id,
        red: 0,
        green: 0,
        blue: 0,
      };
      counts.forEach((c) => {
        const [_, num, color] = c.split(" ");
        if (color !== "red" && color !== "green" && color !== "blue") {
          throw new Error("unexpected color");
        }
        if (!num || isNaN(Number(num))) {
          throw new Error("unexpected color count");
        }
        game[color] += Number(num);
      });
      return game;
    });
  });
}

function pt1(input: string): number {
  const games = parse(input);
  const invalidGamesIds = new Set<number>();
  const validGames = games.forEach((g) => {
    const isValid = g.blue <= maxColors.blue && g.red <= maxColors.red &&
      g.green <= maxColors.green;
    if (!isValid) {
      invalidGamesIds.add(g.id);
    }
  });
  const validGameIds = [...new Set(games.map((g) => g.id))].filter((id) =>
    !invalidGamesIds.has(id)
  );
  // console.log(validGameIds);
  return validGameIds.reduce((acc, cur) => acc + cur, 0);
}

console.log(pt1(exampleInput));

const testInput = Deno.readTextFileSync("inputs/day-02.txt");
console.log(pt1(testInput));
