import Board from './board.js';

export default class Monte extends Board {
  constructor(...props){
    super(...props);
    this.begin();
  }

  begin() {
    this.monte = true;
    this.resultMode();
    this.takeBlinds();
    this.dealInPlayers();
  }

  promptComp(){
    const response = this.currentPlayer().promptResponse(this.currBet, this.pot, this.isSb(), this.currStreet === 'preflop', this.boardCards, this.action.aggAction());
    if (response) this.action.resolvePlayerPrompt(response);
  }

  playMonte() {
    if (this.allIn() && this.handChipDiff() === 0) {
      this.showDown();
      this.determineWinner();
      return;
    }
    this.promptComp();
  }

  resultMode() {
    this.players[0].sound = false;
    this.players[1].sound = false;
    this.sound = false;
    this.delay = false;
  }

  showDown() {
    while (this.boardCards.length < 5) this.boardCards.push(this.deck.draw());
  }

  determineWinner() {
    this.handFinish = true;
    var hand1 = Hand.solve(this.handToStrArr(this.players[0]).concat(this.textBoard()));
    var hand2 = Hand.solve(this.handToStrArr(this.players[1]).concat(this.textBoard()));
    var winners = Hand.winners([hand1, hand2]);
    if (winners.length === 2) {
      return this.tie(hand1);
    } else if (this.players[1].folded || (!this.players[0].folded && winners[0] === hand1)) {
      this.winner(hand1, hand2, 0, 1);
    } else {
      this.winner(hand2, hand1, 1, 0);
    }
  }

  tie(hand) {
    this.players[0].chipstack += Math.floor(this.pot / 2);
    this.players[1].chipstack += Math.floor(this.pot / 2);
    if (this.chipMissing()) {
      if (Math.random() < .5) {
        this.players[0].chipstack += 1;
      } else {
        this.players[1].chipstack += 1;
      }
    }
    // this.table.handOver();
  }

  winner(winHand, loseHand, wonPos, lostPos) {
    this.players[wonPos].chipstack += this.pot;
    // this.table.handOver();
  }

  stepStreet(flopBool) {
    (flopBool) ? this.dealFlop() : this.dealCard();
  }
}

//resetVars()