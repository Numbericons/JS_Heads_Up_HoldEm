export default class Bet {
  constructor(board) {
    this.board = board;
  }

  blindPlayer(player, blind) {
    let villain = (this.board.players[0] === player) ? this.board.players[1] : this.board.players[0];
    if (blind >= villain.chipsInPot + villain.chipstack) {
      player.chipsInPot = villain.chipsInPot + villain.chipstack;
      player.streetChipsInPot = player.chipsInPot;
      player.chipstack -= player.chipsInPot;
      return player.chipsInPot;
    }
    if (player.chipstack > blind) {
      player.chipstack -= blind;
      player.chipsInPot = blind;
      player.streetChipsInPot = blind;
      return blind;
    } else {
      player.chipsInPot += player.chipstack;
      player.streetChipsInPot = player.chipsInPot;
      player.chipstack = 0;
      return player.chipsInPot;
    }
  }

  calcBetInput() {
    let sb = this.board.isSb();
    let betInput = $('.actions-cont-bet-amt');
    let current = this.board.currentPlayer();
    let other = this.board.otherPlayer();
    if (betInput.length === 0) return 0;
    let totalBet = Number(betInput[0].value);
    if (totalBet > current.chipstack + current.streetChipsInPot) totalBet = current.chipstack - sb;
    if (totalBet > other.chipstack + other.streetChipsInPot) totalBet = other.chipstack + this.board.handChipDiff() - sb;
    return totalBet;
  }

  calcCompBetRaise(compBetRaise) {
    let sb = this.board.isSb();
    let totalBet;
    if (compBetRaise > this.board.currentPlayer().chipstack) {
      totalBet = this.board.currentPlayer().chipstack - sb;
    } else if (compBetRaise > this.board.otherPlayer().chipstack) {
      totalBet = this.board.otherPlayer().chipstack + this.board.handChipDiff() - sb;
    } else {
      totalBet = compBetRaise;
    }
    return totalBet;
  }

  isCompBet(compBetRaise) {
    let betRaise;
    if (compBetRaise) {
      if (compBetRaise < this.board.bb) compBetRaise = this.board.bb;
      betRaise = this.calcCompBetRaise(compBetRaise);
    } else {
      betRaise = this.calcBetInput();
    }
    return betRaise;
  }

  maxBet(bet) {
    let stack = this.board.currentPlayer().chipstack;
    let oppStack = this.board.otherPlayer().chipstack + this.board.handChipDiff() + this.board.isSb(); //change to add isSb + handchipdiff
    if (stack > oppStack) stack = oppStack;
    return (bet > stack - this.board.handChipDiff()) ? stack : bet;
  }

  minBet(bet) {
    if (bet === this.board.otherPlayer().chipstack + this.board.isSb()) return bet; //bet is already opponents remaining chips and min legal would otherwise be higher
    if (this.board.streetActions.length === 0) {
      if (this.board.isSb()) return (bet < this.board.bb + this.board.sb) ? this.board.bb + this.board.sb : bet;
      return (bet < this.board.bb) ? this.board.bb : bet;
    }
    let lastBet = this.board.streetActions[this.board.streetActions.length - 1] || 0;
    // let sb = this.board.isSb();
    let min;
    if (this.board.streetActions.length === 1) {
      min = (lastBet === this.board.sb || lastBet === 0) ? this.board.bb : lastBet * 2;
    // } else if (this.board.streetActions.length > 1) {
      // min = 2 * (lastBet - this.board.streetActions[this.board.streetActions.length - 2]) //flag
    } else {
      min = this.board.handChipDiff() * 2;
      // min = this.board.bb + 2 * sb; //flag
    }
    return (bet < min) ? min : bet;
  }

  pfBet(playerAction, bb, second = 0) {
    return parseInt(playerAction[0]) * bb - second;
  }

  potRelativeBet(playerAction) {
    let bet;
    switch (playerAction) {
      case "1/2 Pot":
        bet = this.maxBet(Math.floor(this.board.pot / 2));
        break;
      case "2/3 Pot":
        bet = this.maxBet(Math.floor(this.board.pot * 2 / 3));
        break;
      case "Pot":
        bet = this.maxBet(Math.floor(this.board.pot));
        break;
      case "All In":
        bet = this.maxBet(Math.floor(this.board.currentPlayer().chipstack));
        break;
    }
    return this.minBet(bet);
  }
}