### Heads Up No Limit Hold'em! Play 1v1 hands against the computer until one player has all the monies!

[Live Link](https://acesandeights.firebaseapp.com//)
![Screen Shot 2019-09-09 at 11 10 06 AM](https://user-images.githubusercontent.com/16912968/64555608-8c57e580-d2f2-11e9-9d78-79751099d82c.png)

### Technologies and Libraries:
 1. jQuery
 2. HTML
 3. SCSS/CSS
 4. JavaScript
 5. Poker Solver

JS_Heads_Up_Holdem is a JavaScript project designed and built by me alone in one week. The site provides the user with the experience of battling wits against an artifical intelligence embodiment of the legendary Teddy KGB as Mike McDermott from the movie Rounders.

The deck was built from a sprite sheet. When the deck is populated with cards, the relative position on intended card is specified by coordinates.

``` javsacript
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
```

This project utilized the poker solver library to determine relative hand strength and for the computer to determine their actions.

JS Heads Up HoldEm was created primarily in simple HTMl SCSS and the JavaScript jQuery library for an added challenge and to drill the fundamentals. jQuery is utilized to select and add style and other attributes to elements.

The computer player uses pot odds (the amount wagered compared to the entire amount of the pot) combined with JavaScripts Math.random function to the appropriate actions.

``` javascript
  promptResponse(to_call, stack, pot){
    let adjToCall;
    (to_call === 0) ? adjToCall = pot / 2: adjToCall = to_call;
    let randNum = Math.random();
    let potOdds = adjToCall / (adjToCall + pot); 
    if (randNum < potOdds) {
      if (to_call > 0) {
        return ['fold'];
      } else {
          return ['check'];
      }
    } else if (randNum < potOdds * 1.5) {
      if (to_call > 0) {
        return ['call'];
      } else {
        return ['check'];
      }
    } else {
        return this.genBetRaise(to_call, stack, pot);
    }
  }
```

### Site Features:

* Fully featured No Limit Texas Hold'em
* Computer AI for the player to battle
* Dynamic playing cards
* Card and chip sounds

### Features to be Implemented:
 1. Chipstack visual representations
 2. Further AI improvements
