export default class Action {
  constructor(board) {
    this.board = board;
    this.chips = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/raise.mp3');
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  resolvePlayerPrompt(response) {
    if (response[0] === 'fold') {
      this.startAction(null, 'fold');
    } else if (response[0] === 'call') {
      this.chips.play();
      this.startAction(null, 'call');
    } else if (response[0] === 'check') {
      this.startAction(null, 'check');
    } else {
      this.chips.play();
      this.startAction(null, 'bet', Math.ceil(response[1]));
    }
  }

  async promptPlayer() {
    // this.button.$el.empty();
    this.board.currentPlayer().promptText("Teddy KGB Contemplates Your Fate..")
    let wait = (this.board.currStreet === 'flop' && this.board.streetActions.length === 0) ? 2500 : 1500;
    await this.sleep(wait);
    let firstPreflop = this.board.checkFirstPreflop();
    let response = this.board.currentPlayer().promptResponse(this.board.currBet, this.board.pot, firstPreflop);
    if (response) this.resolvePlayerPrompt(response);
  }

  resolveAction(betRaise, playerAction) {
    let sb = this.board.isSb();
    if (playerAction.includes("Pot") || playerAction === "All In") betRaise = this.board.bet.potRelativeBet(playerAction) + sb;
    let resolvedAction = this.board.currentPlayer().resolve_action(this.board.handChipDiff(), betRaise, playerAction, sb);
    if (resolvedAction) {
      this.board.pot += resolvedAction;
      return resolvedAction;
    }
  }

  startAction($button, compAction, compBetRaise) {
    let playerAction = ($button) ? $button.data().action : compAction;
    if (playerAction === 'fold') {
      this.board.currentPlayer().folded = true;
      return this.board.determineWinner();
    }
    let betRaise = this.board.bet.isCompBet(compBetRaise);
    let resolved = this.resolveAction(betRaise, playerAction);
    this.board.streetActions = this.board.streetActions.concat(resolved);
    this.continueAction();
  }

  continueAction() {
    this.board.currBet = this.board.handChipDiff();
    this.board.toggleCurrPlayer();
    this.board.render();
    if (!this.board.allIn() && this.board.handChipDiff() === 0 && !this.board.handFinish) this.nextAction();
  }

  nextAction() {
    let handChipsEqual = this.board.handChipDiff() === 0;
    let multipleActions = this.board.streetActions.length > 1;
    if (this.board.players[0].folded || this.board.players[1].folded) {
      this.board.determineWinner();
    } else if (handChipsEqual) {
      if (this.board.allIn() && this.board.handChipDiff() === 0) {
        this.board.showDown();
        this.board.determineWinner();
      } else if (this.board.currStreet === 'river' && multipleActions) {
        this.board.revealCards();
        this.board.determineWinner();
      } else if (multipleActions) {
        this.board.nextStreet();
      }
    }
  }
}