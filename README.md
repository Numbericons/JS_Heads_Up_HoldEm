### Heads Up No Limit Hold'em! Play 1v1 hands against the computer until one player has all the monies!

[Live Link](https://acesandeights.firebaseapp.com//)
![Screen Shot 2019-10-23 at 2 24 01 PM](https://user-images.githubusercontent.com/16912968/67435368-d0e8c900-f5a0-11e9-9837-55b65db61abe.png)

### Local Installation
 1. Enter 'NPM install' in the root directory
 2. Enter 'NPM run dev' to run both webpack and sass in one terminal OR complete steps 3 and 4 below
 3. Enter 'NPM run webpack' in the current terminal
 4. Enter 'NPM run sass' in a new second terminal
 5. After step 2 or steps 3 and 4 above, Open 'index.html' in the dist folder or from the root enter 'open dist/index.html'
 
### Technologies and Libraries:
 1. jQuery
 2. HTML
 3. SCSS/CSS
 4. JavaScript
 5. Poker Solver

JS_Heads_Up_Holdem (JavaScript Hold'em Poker) is a JavaScript project designed and built by me in one week. The site provides the user with the experience of battling wits against an AI embodiment of the legendary Teddy KGB as Mike McDermott from the movie Rounders.

The deck of cards was built from a sprite sheet. When the deck is populated, the relative position on intended card is specified by coordinates.

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

The shuffle method referenced above utilizes the Fisher-Yates array shuffling method to ensure an even distribution. The poker solver library is incorporated to determine relative hand strength and for the computer to determine their actions.

JS Heads Up HoldEm was created primarily in simple HTMl SCSS and the JavaScript jQuery library for an added challenge and to drill the fundamentals of these technologies. jQuery is utilized to select and add style and other attributes to elements.

The computer player uses pot odds (the amount wagered compared to the entire amount of the pot) combined with JavaScripts Math.random function to the simulate player actions. Adjustments are made for categories of preflop hands and postflop considerations.

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

### Attributions:
 1. https://github.com/goldfire/pokersolver
    * Calculates hand strength
 2. https://github.com/unRARed/stack-builder
    * Used stack builders chip images to build my chip stacking logic and display
