import Card from './card';
export default class Deck {
  constructor(){
    this.cards_drawn = 0;
    this.cards = this.newDeck();
  }

  shuffle(arr) {
    for(let i = arr.length - 1; i > 0; i--) {
      let k = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[k]] = [arr[k], arr[i]];
    }
    return arr;
  }
  
  newDeck(){
    let suits = ["s", "h", "d", "c"];
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];
    let deck = [];
    for (let i = 0; i < suits.length; i++) {
      for (let j = 0; j < values.length; j++) {
        let pos_x = j * -78 - 6;
        const pos_y = i * -114 - 8;
        deck.push(new Card(values[j], suits[i], pos_x, pos_y, true));
      }
    }
    return this.shuffle(deck);
  }

  draw(){
    if (this.cards_drawn > 0 && this.cards_drawn % 52 == 0) {
      this.cards = this.shuffle(this.cards);
    }
    this.cards_drawn += 1;
    return this.cards.pop();
  }

  returnCard(card){
    this.cards.unshift(card);
  }
}