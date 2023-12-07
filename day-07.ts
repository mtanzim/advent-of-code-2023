type Card =
  | "A"
  | "K"
  | "Q"
  | "J"
  | "T"
  | "9"
  | "8"
  | "7"
  | "6"
  | "5"
  | "4"
  | "3"
  | "2";

const cardsInOrderDescending: Card[] = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
];

const cardsInOrderDescendingPt2: Card[] = [
  "A",
  "K",
  "Q",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "J",
];

// lower is better
const cardRanks = Object.fromEntries(
  cardsInOrderDescending.map((c, idx) => [c, idx]),
);

const cardRanksPt2 = Object.fromEntries(
  cardsInOrderDescendingPt2.map((c, idx) => [c, idx]),
);

type HandTypes =
  | "Five of a kind"
  | "Four of a kind"
  | "Full house"
  | "Three of a kind"
  | "Two pair"
  | "One pair"
  | "High card";

const handTypesInOrderDescending: HandTypes[] = [
  "Five of a kind",
  "Four of a kind",
  "Full house",
  "Three of a kind",
  "Two pair",
  "One pair",
  "High card",
];

// lower is better
const handRanks = Object.fromEntries(
  handTypesInOrderDescending.map((c, idx) => [c, idx]),
);

type CardStr = string;
type Occurrences = number;
type SortedCardsForHand = Array<[CardStr, Occurrences]>;
function determineHandType(hand: string): [HandTypes, SortedCardsForHand] {
  if (hand.length !== 5) {
    console.log({ hand });
    throw Error("bad hand");
  }

  const cardCounts: Record<string, number> = hand.split("").reduce(
    (acc, cur) => {
      return { ...acc, [cur]: acc?.[cur] ? acc[cur] + 1 : 1 };
    },
    {} as Record<string, number>,
  );

  const sorted: SortedCardsForHand = Object.entries(cardCounts).sort(
    (a, b) => {
      const [, occurrencesA] = a;
      const [, occurrencesB] = b;
      return occurrencesB - occurrencesA;
    },
  );

  if (sorted.length === 1) {
    return ["Five of a kind", sorted];
  }
  if (sorted.length === 2 && sorted[0][1] === 4) {
    return ["Four of a kind", sorted];
  }
  if (sorted.length === 2 && sorted[0][1] === 3) {
    return ["Full house", sorted];
  }
  if (sorted.length === 3 && sorted[0][1] === 3) {
    return ["Three of a kind", sorted];
  }
  if (sorted.length === 3 && sorted[0][1] === 2 && sorted[1][1] === 2) {
    return ["Two pair", sorted];
  }
  if (sorted.length === 4 && sorted[0][1] === 2) {
    return ["One pair", sorted];
  }
  if (sorted.length === 5) {
    return ["High card", sorted];
  }

  throw Error("unhandled hand type, please fix");
}

function determineHandTypeWithJoker(hand: string): HandTypes {
  if (!hand.includes("J")) {
    return determineHandType(hand)[0];
  }
  const [origHand, origSorted] = determineHandType(hand);
  // can't get better
  if (origHand === "Five of a kind") {
    return origHand;
  }

  // other cases, extract until jokers are empty
  const jokers = origSorted.find((v) => v[0] === "J");
  if (!jokers) {
    throw Error("cannot find joker, invalid");
  }
  const rest = origSorted.filter((v) => v[0] !== "J");
  const bestOfRest = rest.slice(0, 1)[0];
  const restOfRest = rest.slice(1);
  const updatedHand = ([
    ["J", jokers[1] - 1],
    [bestOfRest[0], bestOfRest[1] + 1],
    ...restOfRest,
  ] as SortedCardsForHand).map((v) => {
    const [card, count] = v;
    return card.repeat(count);
  }).join("");

  if (updatedHand.length !== 5) {
    console.log({ hand, updatedHand, origSorted });
    throw Error("failed to update joker hand correctly");
  }

  return determineHandTypeWithJoker(updatedHand);
}

type Game = {
  cards: Card[];
  bid: number;
};

type RankedGame = Game & { rank: number };
function parse(input: string): Game[] {
  return input.split("\n").filter(Boolean).map((l) => {
    const [cardsRaw, bidRaw] = l.split(" ");

    const cards = cardsRaw.split("") as Card[];
    const bid = Number(bidRaw);

    if (isNaN(bid)) {
      throw Error("failed to parse bid");
    }
    return { cards, bid };
  });
}

function pt1(games: Game[]): number {
  const sortedGames = games.toSorted((ga, gb) => {
    const { cards: ca } = ga;
    const { cards: cb } = gb;
    const [handA] = determineHandType(ca.join(""));
    const [handB] = determineHandType(cb.join(""));
    const haRank = handRanks[handA];
    const hbRank = handRanks[handB];

    // assertions, TS can only help so much
    if (ca.length !== cb.length) {
      throw Error("bad cards");
    }
    if (haRank === undefined || hbRank === undefined) {
      console.log({ ca, cb, handA, handB, haRank, hbRank });
      throw Error("failed to determine hand rank");
    }

    if (haRank === hbRank) {
      // tie breaker
      for (let i = 0; i < ca.length; i++) {
        const cca = ca[i];
        const ccb = cb[i];
        const rankCCA = cardRanks[cca];
        const rankCCB = cardRanks[ccb];
        if (rankCCA !== rankCCB) {
          return rankCCB - rankCCA;
        }
      }
      throw Error("should not be here; cards are completely equal");
    }
    return hbRank - haRank;
  });

  const rankedGame: RankedGame[] = sortedGames.map((g, idx) => ({
    ...g,
    rank: idx + 1,
  }));

  return rankedGame.reduce((acc, cur) => acc + cur.rank * cur.bid, 0);
}

function pt2(games: Game[]): number {
  const sortedGames = games.toSorted((ga, gb) => {
    const { cards: ca } = ga;
    const { cards: cb } = gb;
    const handA = determineHandTypeWithJoker(ca.join(""));
    const handB = determineHandTypeWithJoker(cb.join(""));
    const haRank = handRanks[handA];
    const hbRank = handRanks[handB];

    if (ca.length !== cb.length) {
      throw Error("bad cards");
    }
    if (haRank === undefined || hbRank === undefined) {
      throw Error("failed to determine hand rank");
    }

    // tie breaker
    if (haRank === hbRank) {
      for (let i = 0; i < ca.length; i++) {
        const cca = ca[i];
        const ccb = cb[i];
        const rankCCA = cardRanksPt2[cca];
        const rankCCB = cardRanksPt2[ccb];
        if (rankCCA !== rankCCB) {
          return rankCCB - rankCCA;
        }
      }
      throw Error("should not be here; cards are completely equal");
    }
    return hbRank - haRank;
  });

  const rankedGame: RankedGame[] = sortedGames.map((g, idx) => ({
    ...g,
    rank: idx + 1,
  }));

  return rankedGame.reduce((acc, cur) => acc + cur.rank * cur.bid, 0);
}

const exampleInput = `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`;

console.log(pt1(parse(exampleInput)));
console.log(pt2(parse(exampleInput)));
console.log(pt1(parse(Deno.readTextFileSync("inputs/day-07.txt"))));
console.log(pt2(parse(Deno.readTextFileSync("inputs/day-07.txt"))));
