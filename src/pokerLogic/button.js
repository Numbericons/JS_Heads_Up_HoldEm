export default class Button {
  constructor($el, board){
    this.$el = $el;
    this.board = board;
    this.bindEvents = this.bindEvents.bind(this);
  }

  showDealerBtnHelp(showDir, hideDir) {
    $(`#table-felt-dealer-btn-img-${hideDir}`).addClass("display-none");
    let dealerBtn = $(`#table-felt-dealer-btn-img-${showDir}`);
    dealerBtn.removeClass();
    (this.board.boardCards.length === 0) ? dealerBtn.addClass(`table-felt-dealer-btn-img-${showDir}`) : dealerBtn.addClass(`table-felt-dealer-btn-img-${showDir}-board`);
  }

  fold($outDiv) {
    let $foldDiv = $("<button>");
    $foldDiv.addClass("actions-cont-text");
    $foldDiv.data("action", "fold");
    $foldDiv.html('FOLD');
    $outDiv.append($foldDiv)
  }

  callOrCheck($outDiv) {
    let $callDiv = $("<button>");
    $callDiv.addClass("actions-cont-text")
    if (this.board.currBet === 0) {
      $callDiv.data("action", "check");
      $callDiv.html('CHECK');
    } else {
      $callDiv.data("action", "call");
      $callDiv.html('CALL');
    }

    $outDiv.append($callDiv)
  }

  betAmount($outDiv) {
    let value;
    if (this.board.currBet > 0) {
      if (this.board.currBet === this.board.sb) {
        value = this.board.bb * 2;
      } else {
        value = this.board.currBet * 2;
      }
    } else {
      value = this.board.bb
    }
    let $betAmtDiv = $("<input/>", {
      type: 'text',
      class: 'actions-cont-bet-amt',
      value: `${value}`
    })
    $outDiv.append($betAmtDiv)
  }

  betOrRaise($outDiv) {
    let $betDiv = $("<button>");
    $betDiv.addClass("actions-cont-text")

    if (this.board.currBet === 0) {
      $betDiv.data("action", "bet");
      $betDiv.html('BET');
    } else {
      $betDiv.data("action", "raise");
      $betDiv.html('RAISE');
    }
    $outDiv.append($betDiv)
  }
  
  betSizeButton($betsizeDiv, size){
    let $betDiv = $("<button>");
    $betDiv.data("action", size);
    $betDiv.addClass("betsize-cont-text");
    $betDiv.html(`${size}`);
    $betsizeDiv.append($betDiv);
  }

  regularBetSizes($betsizeDiv){
    this.betSizeButton($betsizeDiv, "1/2 Pot");
    this.betSizeButton($betsizeDiv, "2/3 Pot");
    this.betSizeButton($betsizeDiv, "Pot");
    this.betSizeButton($betsizeDiv, "All In");
  }

  preflopBetSizes($betsizeDiv){
    this.betSizeButton($betsizeDiv, "2X");
    this.betSizeButton($betsizeDiv, "3X");
    this.betSizeButton($betsizeDiv, "4X");
    this.betSizeButton($betsizeDiv, "All In");
  }

  betSizeButtons($betsizeDiv, pfSize){
    (pfSize) ? this.preflopBetSizes($betsizeDiv) : this.regularBetSizes($betsizeDiv);
  }

  setButtons(pfSize) {
    this.$el.empty();
    const $outDiv = $("<div>");
    $outDiv.addClass("actions-cont")
    const $betsizeDiv = $("<div>");
    $betsizeDiv.addClass("betsize-cont")

    this.fold($outDiv);
    this.callOrCheck($outDiv);
    if (!this.board.allIn() && this.board.currentPlayer().chipstack > this.board.currBet) {
      this.betOrRaise($outDiv);
      this.betAmount($outDiv);
      this.betSizeButtons($betsizeDiv, pfSize);
    }
    this.$el.append($outDiv);
    this.$el.append($betsizeDiv);
  }

  bindEvents() {
    this.$el.unbind();
    this.$el.on("click", "button", (event => {
      const $button = $(event.currentTarget);
      this.board.action.startAction($button);
    }));
  }

  bindPlayGame(table){
    this.$el.unbind();
    const $outDiv = $("<div>");
    let $newGame = $("<button>");

    $newGame.html('PLAY GAME');
    $newGame.addClass("actions-cont-new-game")
    $outDiv.addClass("actions-cont")
    $outDiv.append($newGame);
    this.$el.append($outDiv);
    this.$el.on("click", "button", (event => {
      table.playHand();
    }));
  }

  bindNewGame(table){
    this.$el.unbind();
    const $outDiv = $("<div>");
    let $newGame = $("<button>");

    $newGame.html('NEW GAME');
    $newGame.addClass("actions-cont-new-game")
    $outDiv.addClass("actions-cont")
    $outDiv.append($newGame);
    this.$el.append($outDiv);
    this.$el.on("click", "button", (event => {
      table.newGame();
    }));
  }
}
