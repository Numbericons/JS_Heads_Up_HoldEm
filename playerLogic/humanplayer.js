export default class HumanPlayer {
  constructor(position, chipstack){
    this.position = position;
    this.chipstack = chipstack || 1500;
    this.folded = false;
    this.chipsInPot = 0;
    this.hand = [];
  }

  action(to_call, sb = 0){
    console.log(`Player, you have ${this.chipstack} chips, your hand is ${self.hand.show}`)
    let input;
    if (to_call === 0) {
      input = prompt("Enter 'check', 'fold', or 'bet' followed by an amount i.e. 'bet 100'");
    } else {
      input = prompt(`It costs ${to_call} to call. Enter 'call', 'fold', 'raise' followed by an amount i.e. 'raise 300'`);
    }
    console.log(input);
    this.resolve_action(to_call, input, sb);
  }

  resolve_action(to_call, input, sb){
    let input = input.toLowerCase;
    if (input.startsWith('ch')) return [0, 'check'];
    if (!input === "ch" &&  !input === "ca" && input === !"bet" && !input === "ra") {
      throw "Invalid input provided";
    }
    let wager = Number(input.split(" ")[1]);
    if (input.startsWith("ca")) {
      self.chipstack = self.chipstack - to_call;
      self.chipsInPot = self.chipsInPot + to_call;
      return [wager, 'call']
    } else if (input.startsWith("bet")) {
      self.chipstack = self.chipstack - wager;
      self.chipsInPot = wager - sb;
      return [wager, 'bet']
    } 
    if (input.startsWith("ra")) {
      self.chipstack = self.chipstack - wager + sb;
      self.chipsInPot = self.chipsInPot - sb;
      return [wager - to_call, 'raise']
    }
    if (input.startsWith('fo')) {
      self.folded = true;
      return null;
    }
  }
}