export default class Button {
  constructor($el, board){
    this.$el = $el;
    this.board = board;
    this.bindEvents = this.bindEvents.bind(this);
    this.invokeBtn = this.invokeBtn.bind(this);
    this.bindKeys();
  }

  bindKeys() {
    $(document).bind('keydown','', this.invokeBtn);
  }

  invokeBtn(event) {
    if (event.key !== ' ' || event.key !== 'Enter' || event.key !== 'Escape') return;
    let $btn;
    if (event.key === ' ') {
      $btn = this.$callDiv;
    } else if (event.key === 'Enter') {
      $btn = this.$betDiv;
    } else if (event.key === 'Escape') {
      $btn = this.$foldDiv;
    }
    this.board.action.startAction($btn);
  }

  hideDealerBtn(){
    $(`#table-felt-dealer-btn-img-left`).addClass("display-none");
    $(`#table-felt-dealer-btn-img-right`).addClass("display-none");
  }

  showDealerBtnHelp(showDir, hideDir) {
    let notDealer = $(`#table-felt-dealer-btn-img-${hideDir}`);
    notDealer.removeClass();
    notDealer.addClass("display-none");
    let dealerBtn = $(`#table-felt-dealer-btn-img-${showDir}`);
    dealerBtn.removeClass();
    (this.board.boardCards.length === 0) ? dealerBtn.addClass(`table-felt-dealer-btn-img-${showDir}`) : dealerBtn.addClass(`table-felt-dealer-btn-img-${showDir}-board`);
  }

  fold($outDiv) {
    let $foldDiv = $("<button>");
    $foldDiv.addClass("actions-cont-text");
    $foldDiv.addClass("actions-cont-text-fold");
    $foldDiv.data("action", "fold");
    $foldDiv.html('<i class="fas fa-times"></i>Fold');
    this.$foldDiv = $foldDiv;
    $outDiv.append($foldDiv)
  }

  callOrCheck($outDiv) {
    let $callDiv = $("<button>");
    $callDiv.addClass("actions-cont-text");
    $callDiv.addClass("actions-cont-text-callorcheck");
    if (this.board.currBet === 0) {
      $callDiv.data("action", "check");
      $callDiv.html('<i class="fas fa-check"></i>Check');
    } else {
      $callDiv.data("action", "call");
      $callDiv.html('<i class="fas fa-phone"></i>Call');
    }
    this.$callDiv = $callDiv;
    $outDiv.append($callDiv)
  }

  betAmount($outDiv) {
    let value;
    if (this.board.currBet > 0) {
      value = this.board.currBet === this.board.sb ? this.board.bb * 2 : this.board.currBet * 2;
    } else {
      value = this.board.bb
    }
    let $betAmtDiv = $("<input/>", { type: 'text', class: 'actions-cont-bet-amt', value: `${value}`})
    $outDiv.append($betAmtDiv)
  }

  betOrRaise($outDiv) {
    let $betDiv = $("<button>");
    $betDiv.addClass("actions-cont-text")
    $betDiv.addClass("actions-cont-text-betorraise");

    if (this.board.currBet === 0) {
      $betDiv.data("action", "bet");
      $betDiv.html('<i class="fas fa-dollar-sign"></i>Bet');
    } else {
      $betDiv.data("action", "raise");
      $betDiv.html('<i class="fas fa-arrow-up"></i>Raise');
    }
    this.$betDiv = $betDiv;
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
    this.betSizeButton($betsizeDiv, "3X");
    this.betSizeButton($betsizeDiv, "4X");
    this.betSizeButton($betsizeDiv, "5X");
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

    $newGame.html('<i class="fas fa-gamepad"></i>PLAY GAME');
    $newGame.addClass("actions-cont-new-game");
    $outDiv.addClass("actions-cont");
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
