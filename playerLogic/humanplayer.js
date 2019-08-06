class HumanPlayer {
  constructor(chipstack){
    this.chipstack = chipstack || 1500;
    this.folded = false;
    this.chips_in_pot = 0;
    this.hand = [];
  }

  action(to_call, sb = 0){
    console.log(`Player, you have ${this.chipstack} chips, your hand is ${self.hand.show}`)
    if (to_call === 0) {
      console.log("Enter 'check', 'fold', or 'bet' followed by an amount i.e. 'bet 100'");
    } else {
      console.log("It costs #{to_call} to call.");
      console.log("Enter 'call', 'fold', 'raise' followed by an amount i.e. 'raise 300': ";
      console.log('Action: ');
    }
    let input
    this.resolve_action(to_call, input, sb);
  }
}