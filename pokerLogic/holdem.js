class HoldEm {
  constructor(initial_stack) {
    this.initial_chips = initial_chips;
    this.players = [new HumanPlayer("sb", initial_chips), new HumanPlayer("bb", initial_chips)];
    this.dealer_pos = 0;
  }

  play_hand(){
    this.table = new Table(this.players);
    this.table.play_hand();
  }

  toggle_players(){
    this.players.push(this.players.shift());
    if (this.players[0].position === 1) {
      this.players[0].position = 2;
      this.players[1].position = 1;
    } else {
      this.players[0].position = 1;
      this.players[1].position = 2;
    }
  }

  reset_player_vars() {
    this.players[0].folded = false;
    this.players[0].chips_in_pot = 0;
    this.players[0].hand = [];
    this.players[1].folded = false;
    this.players[1].chips_in_pot = 0;
    this.players[1].hand = [];
  }
}

let game = new HoldEm;
while (game.players[0].chipstack > 0 && game.players[1].chipstack > 0) {
  game.play_hand();
  game.toggle_players();
}
if (game.players[0].chipsstack === 0) {
  "Seat 2 has won the match!"
} else {
  "Seat 1 has won the match!"
}
