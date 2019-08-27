import "babel-polyfill";
import Deck from './deck'
import Button from './button'
const Hand = require('pokersolver').Hand;

export default class Board {
  constructor($el, players, sb = 50, bb = 100, table) {
    this.boardCards = [];
    this.deck = new Deck;
    this.button = new Button($el, this);
    this.players = players;
    this.sb = sb;
    this.bb = bb;
    this.table = table;
    this.pot = 0;
    this.currPlayerPos = 0;
    this.currBet = this.sb;
    this.streetActions = [];
    this.currStreet = 'preflop';
    this.lastShownCard = 0;
    this.shuffle = new Audio('./audio/shuffle2.mp3');
    this.cardTurn = new Audio('./audio/cardTurnOver.mp3');
    this.chips = new Audio('./audio/chipsTop.mp3')
  }

  currentPlayer() {
    return this.players[this.currPlayerPos];
  }

  otherPlayer() {
    let otherPlayerPos = (this.currPlayerPos === 0) ? 1 : 0;
    return this.players[otherPlayerPos];
  }

  resetVars() {
    this.deck = new Deck;
    this.boardCards = [];
    this.pot = 0;
    this.currPlayerPos = 0;
    this.currBet = this.sb;
    this.streetActions = [];
    this.currStreet = 'preflop';
  }

  showDealerBtn() {
    if (this.table.handNum % 2 === 0) {
      $('#dealer-right-img').addClass("display-none");
      let button = $('#dealer-left-img');
      button.removeClass();
      (this.boardCards.length === 0) ? button.addClass("table-felt-dealer-btn-left") : button.addClass("table-felt-dealer-btn-left-board");
    } else {
      $('#dealer-left-img').addClass("display-none");
      let button = $('#dealer-right-img');
      button.removeClass();
      (this.boardCards.length === 0) ? button.addClass("table-felt-dealer-btn-right") : button.addClass("table-felt-dealer-btn-right-board");
    }
  }

  resetPlayerVars() {
    this.players[0].resetVars();
    this.players[1].resetVars();
  }

  async playHand() {
    this.shuffle.play();
    this.dealInPlayers();
    this.takeBlinds();
    this.render();
    // window.onload = () => {
    //   setTimeout(() => {
    //   }, 0)
    // }
    // $(document).ready(() => { this.shuffle.play().catch((err) => {
      //   console.log(err)
      // }) });
      // await this.sleep(10000).then(res => {
        // this.deck.shuffleSound();
        // })
  }

  determineWinner() {
    var hand1 = Hand.solve(this.handToStrArr(this.players[0]).concat(this.textBoard()));
    var hand2 = Hand.solve(this.handToStrArr(this.players[1]).concat(this.textBoard()));
    this.outputString = (this.boardCards.length > 0) ? `On a board of ${this.textBoard()}, ` : `Preflop, `
    var winners = Hand.winners([hand1, hand2]);
    if (!this.players[0].folded && !this.players[1].folded && winners.length === 2) {
      return this.tie(hand1);
    } else if (this.players[1].folded || (!this.players[0].folded && winners[0] === hand1)) {
      this.winner(hand1, hand2, 0, 1);
    } else {
      this.winner(hand2, hand1, 1, 0);
    }
  }

  renderChat(str){
    let chat = $('.table-bottom-chat');
    chat.val(str);
  }

  tie(hand) {
    this.renderChat(this.outputString + `the hand resulted in a tie. Splitting the pot of $${this.pot} with ${hand.descr}!`)
    this.players[0].chipstack += Math.floor(this.pot / 2);
    this.players[1].chipstack += Math.floor(this.pot / 2);
    if (!this.pot % 2 === 0) {
      if (Math.random() < .5) {
        this.players[0].chipstack += 1;
      } else {
        this.players[1].chipstack += 1;
      }
    }
    this.renderPlayers();
    this.table.handOver();
  }

  winner(winHand, loseHand, winPos, losePos) {
    this.outputString += `${this.players[winPos].name} wins the pot of $${this.pot}`;
    if (!this.players[losePos].folded) this.outputString += ` with hand: ${winHand.descr}`;
    if (!this.players[losePos].chipstack === 0) this.outputString += `${this.players[losePos].name} lost with with hand: ${loseHand.descr}`;
    this.players[winPos].chipstack += this.pot;
    this.renderPlayers();
    this.renderChat(this.outputString);
    // alert(this.outputString);
    this.table.handOver();
  }

  clearBoard() {
    for (let i = 0; i < this.boardCards.length; i++) {
      let card = document.querySelector(`.table-felt-board-card-${i + 1}`);
      this.boardCards[i].unrender(card);
    }
  }

  handToStrArr(player) {
    let playerHand = player.hand.map(card => {
      return `${card.rank}${card.suit}`;
    })
    return playerHand;
  }

  async dealPlayerCard(pos, revealed) {
    let card = this.deck.draw();
    card.revealed = revealed;
    this.players[pos].hand.push(card);
  }

  dealInPlayers() {
    this.dealPlayerCard(1, !this.players[1].comp);
    this.dealPlayerCard(0, !this.players[0].comp);
    this.dealPlayerCard(1, !this.players[1].comp);
    this.dealPlayerCard(0, !this.players[0].comp);
  }

  blindPlayer(player, blind){
    let villain = (this.players[0] === player) ? this.players[1] : this.players[0];
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

  takeBlinds() {
    const sbTotal = this.blindPlayer(this.players[0], this.sb);
    const bbTotal = this.blindPlayer(this.players[1], this.bb);
    this.pot = sbTotal + bbTotal;
  }

  async dealCard() {
    this.currPlayerPos = 1;
    this.boardCards.push(this.deck.draw());
    await this.sleep(500);
    this.cardTurn.play();
  }

  dealFlop() {
    this.currPlayerPos = 1;
    for (let i = 0; i < 3; i++) {
      this.dealCard();
    }
  }

  textBoard() {
    let textBoard = this.boardCards.map(card => {
      return card.show();
    })
    return textBoard;
  }

  sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  startCard(){
    if (this.currStreet === 'flop') {
      return 0;
    } else {
      return this.boardCards.length - 1;
    }
  }

  showBoardCard(pos){
    let card = document.querySelector(`.table-felt-board-card-${pos+1}`);
    this.boardCards[pos].render(card, "17.5%", "69%", true)
  }

  async showBoard() {
    if (this.boardCards.length === 0) return;
    for (let i = this.startCard(); i < this.boardCards.length; i++) {
      await this.sleep(500);
      this.showBoardCard(i);
    };
  }

  toggleCurrPlayer() {
    if (this.currPlayerPos === 0) {
      this.currPlayerPos = 1;
    } else {
      this.currPlayerPos = 0;
    }
  }

  allIn() {
    if (this.players[0].chipstack === 0 || this.players[1].chipstack === 0) {
      return true
    }
    return false;
  }

  showPot() {
    let currPotText = document.querySelector(`.top-left-current-pot-text`);
    currPotText.innerText = `Current pot: $${this.pot}`;

    let currPotNum = document.querySelector(`.table-felt-pot`);
    currPotNum.innerText = `$${this.pot}`;
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
    let wait = (this.currStreet === 'flop' && this.streetActions.length === 0) ? 2500 : 1200;
    await this.sleep(wait);
    let response = this.currentPlayer().promptResponse(this.currBet, this.currentPlayer().chipstack, this.pot);
    if (response) {
      this.resolvePlayerPrompt(response);
    }
  }

  renderPlayers(){
    this.players[0].render();
    this.players[1].render();
  }

  renderDealerPlayers(){
    this.showDealerBtn();
    this.renderPlayers();
  }

  render() {
    this.renderDealerPlayers();
    this.showPot();
    if (this.allIn() && this.handChipDiff() === 0) {
      this.showDown();
      this.determineWinner();
      return;
    }
    this.showBoard();
    this.button.setButtons();
    this.button.bindEvents();
    if (this.currentPlayer().hand[0]) this.currentPlayer().promptAction(this.handChipDiff(), this.currentPlayer.chipstack);
    if (this.currentPlayer().comp && (this.streetActions.length < 2 || this.handChipDiff() !== 0)) this.promptPlayer();
  }

  handChipDiff() {
    return Math.abs(this.players[0].chipsInPot - this.players[1].chipsInPot);
  }

  calcBetInput() {
    let sb = this.isSb();
    let betInput = $('.actions-cont-bet-amt');
    if (betInput.length === 0) return 0;
    let totalBet = Number(betInput[0].value);
    if (totalBet > this.currentPlayer().chipstack) totalBet = this.currentPlayer().chipstack - sb;
    if (totalBet > this.otherPlayer().chipstack) totalBet = this.otherPlayer().chipstack + this.handChipDiff() - sb;
    return totalBet;
  }

  calcCompBetRaise(compBetRaise, isSb) {
    let sb = this.isSb();
    let totalBet;
    if (compBetRaise > this.currentPlayer().chipstack) {
      totalBet = this.currentPlayer().chipstack - sb;
    } else if (compBetRaise > this.otherPlayer().chipstack) {
      totalBet = this.otherPlayer().chipstack + this.handChipDiff() - sb;
    } else {
      totalBet = compBetRaise;
    }
    return totalBet;
  }

  isSb(){
    return (this.currStreet === 'preflop' && this.streetActions.length === 0) ? this.sb : 0;
  }

  isCompBet(compBetRaise){
    let betRaise;
    if (compBetRaise) {
      if (compBetRaise < this.bb) compBetRaise = this.bb;
      betRaise = this.calcCompBetRaise(compBetRaise);
    } else {
      betRaise = this.calcBetInput();
    }
    return betRaise;
  }

  resolveAction(betRaise, playerAction){
    let resolvedPlayerAction = this.currentPlayer().resolve_action(this.handChipDiff(), betRaise, playerAction, this.isSb());
    if (resolvedPlayerAction) {
      this.pot += resolvedPlayerAction;
    }
  }

  action($button, compAction, compBetRaise) {
    let playerAction = ($button) ? $button.data().action : compAction;
    if (playerAction === 'fold') {
      this.currentPlayer().folded = true;
      return this.determineWinner();
    }
    let betRaise = this.isCompBet(compBetRaise);
    let resolved = this.resolveAction(betRaise, playerAction);
    this.streetActions = this.streetActions.concat(resolved);
    this.continueAction();
  }

  continueAction() {
    this.currBet = this.handChipDiff();
    this.toggleCurrPlayer();
    this.render();
    if (!this.allIn() && this.handChipDiff() === 0)  this.nextAction();
  }

  nextAction() {
    let handChipsEqual = this.handChipDiff() === 0;
    let multipleActions = this.streetActions.length > 1;
    if (this.streetActions[this.streetActions - 1] === 'fold') {
      this.determineWinner();
    } else if (handChipsEqual) {
      if (this.allIn() && this.handChipDiff() === 0) {   // remove as render handles logic
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

  revealCards() {
    this.players.forEach(player => { player.revealed = true })
  }

  showDown() {
    this.revealCards();
    while (this.boardCards.length < 5) {
      this.dealCard();
      this.showBoard();
    }
  }

  stepStreet(flopBool) {
    (flopBool) ? this.dealFlop() : this.dealCard();
    this.showBoard();
    if (!this.allIn()) this.render();
  }

  nextStreet() {
    this.streetActions = [];
    this.currBet = 0;
    this.players[0].streetChipsInPot = 0;
    this.players[1].streetChipsInPot = 0;
    if (this.currStreet === 'preflop') {
      this.currStreet = 'flop';
      this.stepStreet(true);
    } else if (this.currStreet === 'flop') {
      this.currStreet = 'turn';
      this.stepStreet();
    } else if (this.currStreet === 'turn') {
      this.currStreet = 'river';
      this.stepStreet();
    }
  }
}