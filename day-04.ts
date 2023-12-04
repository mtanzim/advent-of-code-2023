const exampleInput = `
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
`;

type Game = {
  id: string;
  myCards: number[];
  winningCards: number[];
};

function parse(input: string): Game[] | never {
  const lines = input.split("\n").filter(Boolean);
  return lines.map((l) => {
    const [a, b] = l.split("|");
    const [id, winingsRaw] = a.split(":");
    const myCards = b.split(" ").filter(Boolean).map(Number);
    const winningCards = winingsRaw.split(" ").filter(Boolean).map(Number);
    (function assertions() {
      myCards.forEach((n) => {
        if (isNaN(n)) {
          throw new Error("Parsing error");
        }
      });
      winningCards.forEach((n) => {
        if (isNaN(n)) {
          throw new Error("Parsing error");
        }
      });
    })();

    return ({ id, myCards, winningCards });
  });
}

function pt1(games: Game[]): number {
  return games.reduce((acc, game) => {
    const winningNumSet = new Set(game.winningCards);
    const winningCount = game.myCards.reduce((acc, cur) => {
      if (winningNumSet.has(cur)) {
        return acc + 1;
      }
      return acc;
    }, 0);

    const curScore = Math.floor(Math.pow(2, winningCount - 1));
    return acc + curScore;
  }, 0);
}

function getGameId(rawId?: string): number {
  const digitPattern = /\d+/g;
  const id = Number((rawId || "").match(digitPattern));
  if (!rawId || isNaN(id)) {
    console.log(rawId);
    throw new Error("invalid card id");
  }
  return id;
}

function pt2(games: Game[]): number {
  const maxCardId = getGameId(games?.at(-1)?.id);
  if (!maxCardId || isNaN(maxCardId)) {
    throw new Error("invalid max card id");
  }

  const winners = Object.fromEntries(games.map((game) => {
    const winningNumSet = new Set(game.winningCards);
    const winningCount = game.myCards.reduce((acc, cur) => {
      if (winningNumSet.has(cur)) {
        return acc + 1;
      }
      return acc;
    }, 0);

    return [getGameId(game.id), winningCount];
  }));

  const counts: Record<string, number> = Object.fromEntries(
    games.map((g) => [getGameId(g.id), 0]),
  );

  games.forEach((g) => {
    const id = getGameId(g.id);
    const wins = winners[id];
    counts[id] += 1;

    for (let i = 1; i <= wins; i++) {
      const nextId = id + i;
      counts[nextId] += counts[id];
    }
  });
  return Object.values(counts).reduce((acc, cur) => acc + cur, 0);
}

console.log(pt1(parse(exampleInput)));
console.log(pt1(parse(Deno.readTextFileSync("inputs/day-04.txt"))));
console.log(pt2(parse(exampleInput)));
console.log(pt2(parse(Deno.readTextFileSync("inputs/day-04.txt"))));
