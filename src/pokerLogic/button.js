export default class Button {
  constructor($el, board){
    this.$el = $el;
    this.board = board;
    this.bindEvents = this.bindEvents.bind(this);
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

  setButtons() {
    const $outDiv = $("<div>");
    $outDiv.addClass("actions-cont")

    this.fold($outDiv);
    this.callOrCheck($outDiv);
    if (!this.board.allIn() && this.board.currentPlayer().chipstack > this.board.currBet) {
      this.betOrRaise($outDiv);
      this.betAmount($outDiv);
    }
    this.$el.empty();
    this.$el.append($outDiv);
  }

  bindEvents() {
    this.$el.unbind();
    this.$el.on("click", "button", (event => {
      const $button = $(event.currentTarget);
      this.board.action($button);
    }));
  }
}