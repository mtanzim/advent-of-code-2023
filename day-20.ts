// true is high, false is low
type Pulse = boolean;
// true is on, false is off
type State = boolean;

const FLIP_FLOP = "%";
const CONJUNCTION = "&";
const BROADCASTER = "broadcaster";

type TrackerCb = (pulse: Pulse) => void;

interface GameModule {
  name: string;
  trackerCb: TrackerCb;
  addConnection: (m: GameModule) => void;
  rx: (senderName: string, pulse: Pulse) => void;
  tx: (pulse: Pulse) => void;
}

class FlipFlopModule implements GameModule {
  state: State = false;
  private prefix: string = FLIP_FLOP;
  name: string;
  private connections: GameModule[] = [];
  trackerCb: TrackerCb;
  constructor(name: string, trackerCb: TrackerCb) {
    this.name = name;
    this.trackerCb = trackerCb;
  }
  addConnection(m: GameModule) {
    this.connections.push(m);
  }
  rx(_: string, pulse: Pulse) {
    this.trackerCb(pulse);
    if (pulse) {
      // nothing
    } else {
      this.state = !this.state;
      this.tx(this.state);
    }
  }
  tx(pulse: Pulse) {
    this.connections.forEach((c) => {
      console.log(`${this.name} -${pulse ? "high" : "low"} -> ${c.name}`);
      c.rx(this.name, pulse);
    });
  }
}

class ConjunctionModule implements GameModule {
  private prefix: string = CONJUNCTION;
  name: string;
  private connections: GameModule[] = [];
  state: Record<string, boolean> = {};
  trackerCb: TrackerCb;

  constructor(name: string, trackerCb: TrackerCb) {
    this.name = name;
    this.trackerCb = trackerCb;
  }
  addConnection(m: GameModule) {
    this.connections.push(m);
  }
  rx(senderName: string, pulse: Pulse) {
    this.trackerCb(pulse);
    this.state[senderName] = pulse;
    // console.log({ state: this.state });
    this.tx(!Object.values(this.state).every((s) => s));
  }
  tx(pulse: Pulse) {
    this.connections.forEach((c) => {
      console.log(`${this.name} -${pulse ? "high" : "low"} -> ${c.name}`);
      c.rx(this.name, pulse);
    });
  }
}

class BroadcasterModule implements GameModule {
  private prefix: string = BROADCASTER;
  name: string = BROADCASTER;
  private connections: GameModule[] = [];
  trackerCb: TrackerCb;

  constructor(trackerCb: TrackerCb) {
    this.trackerCb = trackerCb;
  }
  addConnection(m: GameModule) {
    this.connections.push(m);
  }
  rx(_: string, pulse: Pulse) {
    this.trackerCb(pulse);
    this.tx(pulse);
  }
  tx(pulse: Pulse) {
    this.connections.forEach((c) => {
      console.log(`${this.name} -${pulse ? "high" : "low"} -> ${c.name}`);
      c.rx(this.name, pulse);
    });
  }
}

class OutputModule implements GameModule {
  name = "output";
  private connections: GameModule[] = [];
  trackerCb: TrackerCb;
  constructor(trackerCb: TrackerCb) {
    this.trackerCb = trackerCb;
  }
  addConnection(m: GameModule) {
    this.connections.push(m);
  }
  rx(_: string, pulse: Pulse) {
    this.trackerCb(pulse);
  }
  tx(_pulse: Pulse) {
  }
}

function example1() {
  const tracker: Record<string, number> = {
    "true": 0,
    "false": 0,
  };
  const trackerCb = (pulse: Pulse) => {
    tracker[String(pulse)]++;
  };
  const broadcaster = new BroadcasterModule(trackerCb);
  const a = new FlipFlopModule("a", trackerCb);
  const b = new FlipFlopModule("b", trackerCb);
  const c = new FlipFlopModule("c", trackerCb);
  const inv = new ConjunctionModule("inv", trackerCb);
  broadcaster.addConnection(a);
  broadcaster.addConnection(b);
  broadcaster.addConnection(c);
  a.addConnection(b);
  b.addConnection(c);
  c.addConnection(inv);
  inv.addConnection(a);

  for (let i = 0; i < 1000; i++) {
    broadcaster.rx("button module", false);
    // console.log("\nstates\n");
    // [a, b, c].forEach((m) => {
    //   console.log(m.name);
    //   console.log(m.state);
    // });
  }
  console.log({ tracker });
}

function example2() {
  const tracker: Record<string, number> = {
    "true": 0,
    "false": 0,
  };
  const trackerCb = (pulse: Pulse) => {
    tracker[String(pulse)]++;
  };
  const broadcaster = new BroadcasterModule(trackerCb);
  const a = new FlipFlopModule("a", trackerCb);
  const b = new FlipFlopModule("b", trackerCb);
  const inv = new ConjunctionModule("inv", trackerCb);
  const con = new ConjunctionModule("con", trackerCb);
  const output = new OutputModule(trackerCb);
  broadcaster.addConnection(a);
  a.addConnection(inv);
  a.addConnection(con);
  inv.addConnection(b);
  b.addConnection(con);
  con.addConnection(output);
  for (let i = 0; i < 1000; i++) {
    broadcaster.rx("button module", false);
  }
  console.log({ tracker });

  // broadcaster.rx("button module", false);

  // console.log("\nstates\n");
  // [a, b].forEach((m) => {
  //   console.log(m.name);
  //   console.log(m.state);
  // });

  // broadcaster.rx("button module", false);

  // console.log("\nstates\n");
  // [a, b].forEach((m) => {
  //   console.log(m.name);
  //   console.log(m.state);
  // });

  // broadcaster.rx("button module", false);

  // console.log("\nstates\n");
  // [a, b].forEach((m) => {
  //   console.log(m.name);
  //   console.log(m.state);
  // });

  // broadcaster.rx("button module", false);
  // console.log("\nstates - 4\n");
  // [a, b].forEach((m) => {
  //   console.log(m.name);
  //   console.log(m.state);
  // });
}
example1();
// example2();
