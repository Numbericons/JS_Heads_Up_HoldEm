export default class Action {
  constructor(board) {
    this.board = board;
  }

  resolvePlayerPrompt(response) {
    if (response[0] === 'fold') {
      this.action(null, 'fold');
    } else if (response[0] === 'call') {
      this.chips.play();
      this.action(null, 'call');
    } else if (response[0] === 'check') {
      this.action(null, 'check');
    } else {
      this.chips.play();
      this.action(null, 'bet', Math.ceil(response[1]));
    }
  }

  async promptPlayer() {
    this.button.$el.empty();
    this.currentPlayer().promptText("Teddy KGB Contemplates Your Fate..")
    let wait = (this.currStreet === 'flop' && this.streetActions.length === 0) ? 3000 : 2000;
    await this.sleep(wait);
    let firstPreflop = this.checkFirstPreflop();
    let response = this.currentPlayer().promptResponse(this.currBet, this.pot, firstPreflop);
    if (response) this.resolvePlayerPrompt(response);
  }

  resolveAction(betRaise, playerAction) {
    let sb = this.isSb();
    if (playerAction.includes("Pot") || playerAction === "All In") betRaise = this.bet.potRelativeBet(playerAction) + sb;
    let resolvedAction = this.currentPlayer().resolve_action(this.handChipDiff(), betRaise, playerAction, sb);
    if (resolvedAction) {
      this.pot += resolvedAction;
      return resolvedAction;
    }
  }

  action($button, compAction, compBetRaise) {
    let playerAction = ($button) ? $button.data().action : compAction;
    if (playerAction === 'fold') {
      this.currentPlayer().folded = true;
      return this.determineWinner();
    }
    let betRaise = this.bet.isCompBet(compBetRaise);
    let resolved = this.resolveAction(betRaise, playerAction);
    this.streetActions = this.streetActions.concat(resolved);
    this.continueAction();
  }

  continueAction() {
    this.currBet = this.handChipDiff();
    this.toggleCurrPlayer();
    this.render();
    if (!this.allIn() && this.handChipDiff() === 0 && !this.handFinish) this.nextAction();
  }

  nextAction() {
    let handChipsEqual = this.handChipDiff() === 0;
    let multipleActions = this.streetActions.length > 1;
    if (this.players[0].folded || this.players[1].folded) {
      this.determineWinner();
    } else if (handChipsEqual) {
      if (this.allIn() && this.handChipDiff() === 0) {
        this.showDown();
        this.determineWinner();
      } else if (this.currStreet === 'river' && multipleActions) {
        this.revealCards();
        this.determineWinner();
      } else if (multipleActions) {
        this.nextStreet();
      }
    }
  }
}