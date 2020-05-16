export default class Action {
  constructor(board) {
    this.board = board;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  resolvePlayerPrompt(response) {
    if (response[0] === 'fold') {
      this.startAction(null, 'fold');
    } else if (response[0] === 'call') {
      this.startAction(null, 'call');
    } else if (response[0] === 'check') {
      this.startAction(null, 'check');
    } else {
      let action = response[0] || 'bet';
      this.startAction(null, action, Math.ceil(response[1]));
    }
  }
  
  aggAction(){
    let firstBet = this.board.streetActions.length === 0;
    let secondBet = this.board.streetActions.length === 1 && this.board.streetActions[0] === 0;
    return firstBet || secondBet;
  }

  async promptPlayer(handArr) {
    this.board.currentPlayer().promptText("Teddy KGB Contemplates Your Fate..")
    let wait = (this.board.currStreet === 'flop' && this.board.streetActions.length === 0) ? 4000 : 1750;
    let response = this.board.currentPlayer().promptResponse(this.board.currBet, this.board.pot, this.board.isSb(), this.board.currStreet === 'preflop', this.board.boardCards, this.aggAction());
    if (this.board.delay) await this.sleep(wait);
    if (response) this.resolvePlayerPrompt(response);
  }

  resolveAction(betRaise, playerAction) {
    let sb = this.board.isSb();
    let secondPf = (sb) ? 0 : this.board.bb;
    if (playerAction.includes("Pot") || playerAction === "All In") betRaise = this.board.bet.potRelativeBet(playerAction) + sb;
    if (playerAction.includes("X")) betRaise = this.board.bet.pfBet(playerAction, this.board.bb, secondPf);
    let oppChipsRem = this.board.otherPlayer().chipstack + this.board.handChipDiff() + this.board.isSb();
    if (betRaise > oppChipsRem) betRaise = oppChipsRem;
    let resolvedAction = this.board.currentPlayer().resolveAction(this.board.handChipDiff(), betRaise, playerAction, sb);
    if (resolvedAction) {
      this.board.pot += resolvedAction;
      return resolvedAction;
    }
  }

  startMonte(compAction, compBetRaise){
    if (compAction === 'fold') {
      this.board.currentPlayer().folded = true;
      return this.board.determineWinner(); //
    }
    let betRaise = this.board.bet.isCompBet(compBetRaise);
    betRaise = this.board.bet.minBet(betRaise);
    let resolved = this.resolveAction(betRaise, compAction) || 0;
    this.board.streetActions = this.board.streetActions.concat(resolved);
    this.continueAction();
  }

  startAction($button, compAction, compBetRaise) {
    if (this.board.monte) return this.startMonte(compAction, compBetRaise);
    let playerAction = ($button) ? $button.data().action : compAction;
    if (playerAction === 'fold') {
      this.board.currentPlayer().folded = true;
      return this.board.determineWinner();
    }
    let betRaise = this.board.bet.isCompBet(compBetRaise);
    betRaise = this.board.bet.minBet(betRaise);
    let resolved = this.resolveAction(betRaise, playerAction) || 0;
    this.board.streetActions = this.board.streetActions.concat(resolved);
    this.board.lastActionChat(playerAction);
    this.continueAction();
  }

  continueAction() {
    this.board.currBet = this.board.handChipDiff();
    this.board.toggleCurrPlayer();
    if (this.board.monte) return this.nextAction();
    this.board.render();
    if (!this.board.allIn() && this.board.handChipDiff() === 0 && !this.board.handFinish) this.nextAction();
  }

  nextAction() {
    let handChipsEqual = this.board.handChipDiff() === 0;
    let multipleActions = this.board.streetActions.length > 1;
    if (this.board.players[0].folded || this.board.players[1].folded) {
      return this.board.determineWinner();
    } else if (handChipsEqual) {
      if (this.board.allIn() && handChipsEqual) {
        this.board.showDown();
        return this.board.determineWinner();
      } else if (this.board.currStreet === 'river' && multipleActions) {
        if (!this.board.monte) this.board.revealCards();
        return this.board.determineWinner();
      } else if (multipleActions) {
        this.board.nextStreet();
      }
    }
    // if (this.board.monte && !this.board.handFinish) this.board.promptComp();
    if (this.board.monte && this.board.players[0].hand.length) this.board.promptComp();
  }
}