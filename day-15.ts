console.log("day 15");

function hashFn(s: string): number {
  let val = 0;
  s.split("").forEach((c, idx) => {
    if (c === "," || c === "\n") {
      throw Error("not clean");
    }
    const code = s.charCodeAt(idx);
    // console.log({ c, code, val });
    val += code;
    val *= 17;
    val = val % 256;
  });
  return val;
}

function hashMultiple(s: string): number {
  return s.split(",").reduce((acc, s) => {
    return acc + hashFn(s.replace("\n", ""));
  }, 0);
}

type Step = string;
type Op = "=" | "-";
type StepInstr = {
  label: string;
  op: Op;
  focalLen?: number;
};
function parseStep(s: Step): StepInstr {
  if (s.length < 3 || s.length > 4) {
    console.log(s);
    throw Error("invalid input to parseStep");
  }
  const [lb1, lb2, op, optionalNum] = s;
  const label = lb1 + lb2;
  // console.log({ label, op, optionalNum });
  const focalLen = optionalNum !== undefined ? Number(optionalNum) : undefined;
  return { label, op: op as Op, focalLen };
}

function parseAllSteps(s: string): StepInstr[] {
  return s.split(",").map((s) => {
    return parseStep(s.replace("\n", "") as unknown as Step);
  }, 0);
}

function traverseBoxes(steps: StepInstr[]) {
  // try with list first, optimize after
  const boxes: Array<Array<[string, number]> | null> = new Array(256).fill(
    null,
  );
  for (const step of steps) {
    const boxNum = hashFn(step.label);
    const curBox = boxes[boxNum];
    if (curBox === null && step.op === "=") {
      if (!step.focalLen) {
        throw Error(
          "Something went wrong with parsing, see: " + JSON.stringify(step),
        );
      }
      boxes[boxNum] = [[step.label, step.focalLen]];
    }
    if (curBox !== null) {
      if (step.op === "-") {
        boxes[boxNum] = curBox.filter(([label, _]) => label !== step.label);
        if (boxes[boxNum]?.length === 0) {
          boxes[boxNum] = null;
        }
      }

      if (step.op === "=") {
        const curIdx = curBox.findIndex(([label, _]) => step.label === label);
        if (curIdx === -1) {
          curBox.push([step.label, step.focalLen!]);
        } else {
          curBox[curIdx] = [step.label, step.focalLen!];
        }
      }
    } else {
      if (step.op === "=") {
        if (!step.focalLen) {
          throw Error(
            "Something went wrong with parsing, see: " + JSON.stringify(step),
          );
        }
        boxes[boxNum] = [[step.label, step.focalLen!]];
      }
    }
  }

  const cleanedBoxes = boxes.map((b, idx) => b === null ? undefined : { idx, b })
    .filter(
      Boolean,
    );
  console.log({
    cleanedBoxes,
  });
}

// hashFn("HASH");
const exampleInput = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;
// console.log(parseAllSteps(exampleInput));
console.log(traverseBoxes(parseAllSteps(exampleInput)));
// console.log(traverseBoxes(parseAllSteps(Deno.readTextFileSync("inputs/day-15.txt"))));
// console.log(hashMultiple(exampleInput));
// console.log(hashMultiple(Deno.readTextFileSync("inputs/day-15.txt")));
