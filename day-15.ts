console.log("day 15");

function hashFn(s: string): number {
  let val = 0;
  s.split("").forEach((c, idx) => {
    if (c === "," || c === "\n") {
      return;
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
    return acc + hashFn(s);
  }, 0);
}

// hashFn("HASH");
const exampleInput = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;
console.log(hashMultiple(exampleInput));
console.log(hashMultiple(Deno.readTextFileSync("inputs/day-15.txt")));
