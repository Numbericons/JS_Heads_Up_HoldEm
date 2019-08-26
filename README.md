### Heads Up No Limit Hold'em! Play 1v1 hands against the computer until one player has all the monies!

[Live Link](https://acesandeights.firebaseapp.com//)
![Screen Shot 2019-08-26 at 12 02 05 PM](https://user-images.githubusercontent.com/16912968/63716023-e4bebb80-c7f9-11e9-8be3-afd72c9e597a.png)

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

JS Heads Up HoldEm was created primarily in simple HTMl SCSS and jQuery for an added challenge and to drill the fundamentals. jQuery is utilized to select and add style and other attributes to elements.

Playlists are the central feature of this website.  To reduce redundancy, the same song can be added to multiple playlists and a playlist can have many songs. After all, it is not a traditional library where one user checks out a song for their playlist, making it unavailable to the rest of the population. To accomplish this, an entry in a join table of Songlists, foreign keys to songs and playlists, is created to make the association.

When viewing a playlist, the Songlist associations are used to select a random song from the playlist and then fetch the associated album and its art to display to the user. Below is the snippet showing how the JSON attribute of album art is set for a playlist:

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

### Technologies and Libraries:
 1. jQuery
 2. HTML
 3. SCSS/CSS
 4. JavaScript
 5. Poker Solver

### Features to be Implemented:
 1. Chipstack visual representations
 2. Further AI improvements
