export default class HumanPlayer {
  constructor(position, chipstack){
    this.position = position;
    this.chipstack = chipstack;
    this.folded = false;
    this.chipsInPot = 0;
    this.streetChipsInPot = 0;
    this.hand = [];
    this.comp = false;
    this.revealed = true;
    (position === 'sb') ? this.side = 'right' : this.side = 'left';
    (this.side === 'right') ? this.name = 'Mike McDermott' : this.name = 'Teddy KGB';
  }

  promptText(input){
    let promptSelect = document.querySelector(".table-actions-prompt");
    promptSelect.innerText = input;
  }

  promptAction(to_call){
    if (to_call === 0) {
      this.promptText(`Enter 'check', 'fold', or 'bet'`)
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
      this.streetChipsInPot += to_call;
      return to_call;
    } else {
      this.chipstack -= betInput + sb;
      this.chipsInPot += betInput + sb;
      this.streetChipsInPot += betInput + sb;
      return betInput + sb;
    }
  }

  playerName() {
    let playerName = document.querySelector(`.player-info-${this.side}-chip-text-name`);
    playerName.innerText = `${this.name}`;
  }

  playerChips() {
    let playerChips = document.querySelector(`.player-info-${this.side}-chip-text-chips`);
    playerChips.innerText = `$${this.chipstack} chips`
  }

  playerCards() {
    if (this.hand[0]) {
      let playerCard1 = document.querySelector(`.player-info-${this.side}-cards-1`);
      let playerCard2 = document.querySelector(`.player-info-${this.side}-cards-2`);
      this.hand[0].render(playerCard1, "54%", "89%");
      this.hand[1].render(playerCard2, "54%", "89%");
    }
  }

  render(){
    this.playerName();
    this.playerChips();
    this.playerCards();
    $(`.table-felt-board-bet-player-1`).text('$' + this.streetChipsInPot);
  }

  resetVars(){
    this.folded = false;
    this.chipsInPot = 0;
    this.streetChipsInPot = 0;
    this.hand = [];
  }
}