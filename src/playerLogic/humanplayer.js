export default class HumanPlayer {
  constructor(position, chipstack){
    this.position = position;
    this.chipstack = chipstack;
    this.folded = false;
    this.chipsInPot = 0;
    this.hand = [];
    (position === 'sb') ? this.side = 'right' : this.side = 'left';
    (this.side === 'right') ? this.name = 'Seat 1' : this.name = 'Seat 2';
  }

  text(input){
    let textSelect = document.querySelector(".table-actions-text");
    textSelect.innerText = input;
  }

  promptText(input){
    let promptSelect = document.querySelector(".table-actions-prompt");
    promptSelect.innerText = input;
  }

  promptAction(to_call){
    this.text(`${this.name}, your hand is ${this.hand[0]} ${this.hand[1]}`)
    // console.log(`${this.name}, you have ${this.chipstack} chips, your hand is ${this.hand[0]} ${this.hand[1]}`)
    // let input;
    if (to_call === 0) {
      this.promptText(`${this.name}, enter 'check', 'fold', or 'bet' followed by an amount i.e. 'bet 100'`)
      // input = prompt(`${this.name}, enter 'check', 'fold', or 'bet' followed by an amount i.e. 'bet 100'`);
    } else {
      this.promptText(`It costs ${to_call} to call. Enter 'call', 'fold', 'raise' followed by an amount i.e. 'raise 300'`)
      // input = prompt(`It costs ${to_call} to call. Enter 'call', 'fold', 'raise' followed by an amount i.e. 'raise 300'`);
    }
  }

  action(to_call, sb = 0){
    // while (document.querySelector(".input").innerText.length === 0) {
    // }
    let input = document.querySelector(".input").innerText;
    // console.log(input);
    return this.resolve_action(to_call, input, sb);
  }

  resolve_action(to_call, input, sb){
    // input = input.toLowerCase();
    // if (!input === "ch" &&  !input === "ca" && input === !"bet" && !input === "ra") {
    //   throw "Invalid input provided";
    // }
    if (input.startsWith('ch')) return 0;
    // if (input.startsWith('ch')) return [0, 'check'];
    // let wager = Number(input.split(" ")[1]);
    if (input.startsWith("ca")) {
      this.chipstack -= to_call;
      this.chipsInPot += to_call;
      // this.chipsInPot -= to_call;
      return to_call
      // return [to_call, 'call']
    } else if (input.startsWith("bet")) {
      this.chipstack -= to_call * 2;
      this.chipsInPot += sb;
      // this.chipsInPot -= sb;
      return 100
      // this.chipstack -= wager;
      // return [wager, 'bet']
    } 
    if (input.startsWith("ra")) {
      this.chipstack -= 100 + to_call;
      this.chipsInPot += sb;
      // this.chipsInPot -= sb;
      return 200 - to_call
      // this.chipstack -= wager + sb;
      // this.chipsInPot -= sb;
      // return [wager - to_call, 'raise']
    }
    if (input.startsWith('fo')) {
      this.folded = true;
      return null;
    }
  }

  playerName() {
    let playerName = document.querySelector(`.player-info-name-${this.side}`);
    playerName.innerText = `${this.name}`;
  }

  playerChips() {
    let playerChips = document.querySelector(`.player-info-chips-${this.side}`);
    playerChips.innerText = `${this.chipstack} chips`
  }

  render(){
    this.playerName();
    this.playerChips();
  }
}