console.log("day 15");

function hashFn(s: string): number {
  let val = 0;
  s.split("").forEach((c, idx) => {
    const code = s.charCodeAt(idx);
    console.log({ c, code, val });
    val += code;
    val *= 17;
    val = val % 256;
  });
  console.log({ val });
}

hashFn("HASH");
