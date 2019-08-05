class Deck {
  newDeck = () => {
    let suits = ["s", "h", "d", "c"];
    let values = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
    deck = [];
    for(let i = 0; i < suits.length; i++) {
      for(let j = 0; j < values.length; j++) {
        deck.push(values[j]+suits[i]);
      }
    }
    return shuffle(deck);
  }
}

// require_relative 'mycard.rb'
// require 'colorize'

// class Deck
  

//     attr_reader :deck, :cards_drawn

//     def initialize(deck = Deck.random_deck)
//         @deck = deck
//         @cards_drawn = 0
//     end

//     def shuffle
//         @deck = @deck.shuffle
//     end

//     def draw
//         self.shuffle if cards_drawn % 52 == 0
//         @cards_drawn+=1
//         @deck.pop
//     end

//     def return(card)
//         @deck.unshift(card)
//     end
// end