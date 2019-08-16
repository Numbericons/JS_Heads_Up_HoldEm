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

  // text(input){
  //   let textSelect = document.querySelector(".table-actions-text");
  //   textSelect.innerText = input;
  // }

  promptText(input){
    let promptSelect = document.querySelector(".table-actions-prompt");
    promptSelect.innerText = input;
  }

  promptAction(to_call){
    // this.text(`${this.name}, your hand is ${this.hand[0].rank}${this.hand[0].suit} ${this.hand[1].rank}${this.hand[1].suit}`)
    if (to_call === 0) {
      this.promptText(`${this.name}, enter 'check', 'fold', or 'bet'`)
    } else {
      this.promptText(`It costs $${to_call} to call`)
    }
  }

  resolve_action(to_call, betInput, textInput, sb = 0) {
    if (textInput === 'check') {
      return 0;
    } else if (textInput === 'fold') {
      this.folded = true;
      return null;
    } else if (textInput === 'call') {
      this.chipstack -= to_call;
      this.chipsInPot += to_call;
      return to_call;
    } else {
      this.chipstack -= betInput + sb;
      this.chipsInPot += betInput + sb;
      return betInput + sb;
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

  playerCards() {
    if (this.hand[0]) {
      let playerCard1 = document.querySelector(`.player-info-cards-${this.side}-1`);
      let playerCard2 = document.querySelector(`.player-info-cards-${this.side}-2`);
      this.hand[0].render(playerCard1, "45%", "67%");
      this.hand[1].render(playerCard2, "45%", "67%");
      // let playerCards = document.querySelector(`.player-info-cards-${this.side}`);
      // playerCards.innerText = `${this.hand[0].rank}${this.hand[0].suit} ${this.hand[1].rank}${this.hand[1].suit}`
    }
  }

  render(){
    this.playerName();
    this.playerChips();
    this.playerCards();
  }

  resetVars(){
    this.folded = false;
    this.chipsInPot = 0;
    this.hand = [];
  }
}