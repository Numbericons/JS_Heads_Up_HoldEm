class Deck {
  constructor(){
    this.cards_drawn = 0;
    this.cards = this.newDeck();
  }

  shuffle = (array) => {
    let counter = array.length;

    while (counter > 0) {
      let index = Math.floor(Math.random() * counter);
      counter--;
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }
    return array;
  }

  newDeck = () => {
    let suits = ["s", "h", "d", "c"];
    let values = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
    let deck = [];
    for (let i = 0; i < suits.length; i++) {
      for (let j = 0; j < values.length; j++) {
        deck.push(values[j] + suits[i]);
      }
    }
    return this.shuffle(deck);
  }
}
// new Deck;
console.log(new Deck)