// true is high, false is low
type Pulse = boolean;
// true is on, false is off
type State = boolean;

const FLIP_FLOP = "%";
const CONJUNCTION = "&";
const BROADCASTER = "broadcaster";

interface GameModule {
  name: string;
  addConnection: (m: GameModule) => void;
  rx: (senderName: string, pulse: Pulse) => void;
  tx: (pulse: Pulse) => void;
}

class FlipFlopModule implements GameModule {
  private state: State = false;
  private prefix: string = FLIP_FLOP;
  name: string;
  private connections: GameModule[] = [];
  constructor(name: string) {
    this.name = name;
  }
  addConnection(m: GameModule) {
    this.connections.push(m);
  }
  rx(_: string, pulse: Pulse) {
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
      c.rx(this.name, pulse)
    });
  }
}

class ConjunctionModule implements GameModule {
  private prefix: string = CONJUNCTION;
  name: string;
  private connections: GameModule[] = [];
  private state: Record<string, boolean> = {};
  constructor(name: string) {
    this.name = name;
  }
  addConnection(m: GameModule) {
    this.connections.push(m);
    this.state[m.name] = false;
  }
  rx(senderName: string, pulse: Pulse) {
    this.state[senderName] = pulse;
    this.tx(Object.values(this.state).every((s) => s));
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
  constructor() {
  }
  addConnection(m: GameModule) {
    this.connections.push(m);
  }
  rx(_: string, pulse: Pulse) {
    this.tx(pulse);
  }
  tx(pulse: Pulse) {
    this.connections.forEach((c) => {
      console.log(`${this.name} -${pulse ? "high" : "low"} -> ${c.name}`);
      c.rx(this.name, pulse);
    });
  }
}

function example1() {
  const broadcaster = new BroadcasterModule();
  const a = new FlipFlopModule("a");
  const b = new FlipFlopModule("b");
  const c = new FlipFlopModule("c");
  const inv = new ConjunctionModule("inv");
  broadcaster.addConnection(a);
  broadcaster.addConnection(b);
  broadcaster.addConnection(c);
  a.addConnection(b);
  b.addConnection(c);
  c.addConnection(inv);
  inv.addConnection(a);

  broadcaster.rx("button module", false);
}
example1();
