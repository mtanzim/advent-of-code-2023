console.log("day 19");

const exampleInput = `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`;

type Part = {
  x: number;
  m: number;
  a: number;
  s: number;
};

type FirstRules = {
  label: string;
  op: string;
  val: number;
  nextWorkflow: string;
};
type FinalRule = Pick<FirstRules, "nextWorkflow">;
type Rule = FirstRules | FinalRule;

type Workflows = Record<string, Rule[]>;

const ACCEPTED = "A";
const REJECTED = "R";

function parse(input: string): [Workflows, Part[]] {
  const [workflowsTxt, partsTxt] = input.split("\n\n");
  // console.log({ workflowsTxt, partsTxt });
  const parts = partsTxt.split("\n").map((line) => {
    // console.log(line);
    const tokens = line.replace("}", "").replace("{", "").split(",");
    return tokens.reduce((acc, t) => {
      const [label, val] = t.split("=");
      return {
        ...acc,
        [label]: val,
      };
    }, {});
  });
  console.log({ parts });
  const workflows = workflowsTxt.split("\n").map((line) => {
    console.log(line);
    const [label, rulesTxt] = line.split("{");
    const rules = rulesTxt.replace("}", "").split(",");
    const finalRule = rules.at(-1);
    if (!finalRule) {
      throw Error("cannot get final rule");
    }
    const firstRules = rules.slice(0, -1);
    console.log({ rules, finalRule, firstRules });
  });
}

parse(exampleInput);
