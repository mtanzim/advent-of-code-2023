(function main() {
  // hashFn("HASH");
  const exampleInput = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;
  // pt1
  console.log("day 15 - pt 1");
  console.log(hashMultiple(exampleInput));
  console.log(hashMultiple(Deno.readTextFileSync("inputs/day-15.txt")));

  // pt2
  console.log("day 15 - pt 2");
  console.log(getFocusingPower(parseAllSteps(exampleInput)));
  console.log(
    getFocusingPower(parseAllSteps(Deno.readTextFileSync("inputs/day-15.txt"))),
  );
})();

function hashFn(s: string): number {
  let val = 0;
  s.split("").forEach((c, idx) => {
    if (c === "," || c === "\n") {
      throw Error("not clean");
    }
    const code = s.charCodeAt(idx);
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
  const [label, optionalNum] = s.split(/[-=]/);
  const op = s.match(/[=-]/g)?.at(0) as Op;

  const focalLen = optionalNum !== undefined ? Number(optionalNum) : undefined;
  return { label, op: op, focalLen };
}

function parseAllSteps(s: string): StepInstr[] {
  return s.split(",").map((s) => {
    return parseStep(s.replace("\n", "") as unknown as Step);
  }, 0);
}

function getFocusingPower(steps: StepInstr[]): number {
  // try with a list first, optimize after if needed
  const boxes: Array<Array<[string, number]> | null> = new Array(256).fill(
    null,
  );
  for (const step of steps) {
    const boxNum = hashFn(step.label);
    const curBox = boxes[boxNum];
    if (curBox === null && step.op === "=") {
      boxes[boxNum] = [[step.label, step.focalLen!]];
    }
    if (curBox !== null && step.op === "-") {
      boxes[boxNum] = curBox.filter(([label, _]) => label !== step.label);
      if (boxes[boxNum]?.length === 0) {
        boxes[boxNum] = null;
      }
    }
    if (curBox !== null && step.op === "=") {
      const curIdx = curBox.findIndex(([label, _]) => step.label === label);
      if (curIdx === -1) {
        curBox.push([step.label, step.focalLen!]);
      } else {
        curBox[curIdx] = [step.label, step.focalLen!];
      }
    }
  }

  const focusingPower = boxes.reduce((acc, box, boxIdx) => {
    if (!box) {
      return acc;
    }
    const curScore = box.reduce((accLens, lens, lensIdx) => {
      const [_, lensPower] = lens;
      return (boxIdx + 1) * (lensIdx + 1) * lensPower + accLens;
    }, 0);

    return acc + curScore;
  }, 0);

  return focusingPower;
}
