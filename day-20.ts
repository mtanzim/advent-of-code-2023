// true is high, false is low
type Pulse = boolean;
// true is on, false is off
type State = boolean;

const FLIP_FLOP = "%";
const CONJUNCTION = "&";
const BROADCASTER = "broadcaster";

interface GameModule {
  name: string;
  rx: (senderName: string, pulse: Pulse) => void;
  tx: (pulse: Pulse) => void;
}

class FlipFlopModule implements GameModule {
  private state: State = false;
  private prefix: string = FLIP_FLOP;
  name: string;
  private connections: GameModule[] = [];
  constructor(name: string, connections: GameModule[]) {
    this.name = name;
    this.connections = connections;
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
    this.connections.forEach((c) => c.rx(this.name, pulse));
  }
}

class ConjunctionModule implements GameModule {
  private prefix: string = CONJUNCTION;
  name: string;
  private connections: GameModule[] = [];
  private state: Record<string, boolean> = {};
  constructor(name: string, connections: GameModule[]) {
    this.name = name;
    this.connections = connections;
    this.connections.forEach((c) => {
      this.state[c.name] = false;
    });
  }

  rx(senderName: string, pulse: Pulse) {
    this.state[senderName] = pulse;
    this.tx(!Object.values(this.state).every((s) => s));
  }
  tx(pulse: Pulse) {
    this.connections.forEach((c) => c.rx(this.name, pulse));
  }
}
