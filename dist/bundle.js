/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/pokersolver/pokersolver.js":
/*!*************************************************!*\
  !*** ./node_modules/pokersolver/pokersolver.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * pokersolver v2.1.2
 * Copyright (c) 2016, James Simpson of GoldFire Studios
 * http://goldfirestudios.com
 */

(function() {
  'use strict';

  // NOTE: The 'joker' will be denoted with a value of 'O' and any suit.
  var values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

  /**
   * Base Card class that defines a single card.
   */
  class Card {
    constructor(str) {
      this.value = str.substr(0, 1);
      this.suit = str.substr(1, 1).toLowerCase();
      this.rank = values.indexOf(this.value);
      this.wildValue = str.substr(0, 1);
    }

    // TODO: Add a parameter to leave out the suit and update the this.descr calls.
    toString() {
      return this.wildValue.replace('T', '10') + this.suit;
    }

    static sort(a, b) {
      if (a.rank > b.rank) {
        return -1;
      } else if (a.rank < b.rank) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  /**
   * Base Hand class that handles comparisons of full hands.
   */
  class Hand {
    constructor(cards, name, game, canDisqualify) {
      this.cardPool = [];
      this.cards = [];
      this.suits = {};
      this.values = [];
      this.wilds = [];
      this.name = name;
      this.game = game;
      this.sfLength = 0;
      this.alwaysQualifies = true;

      // Qualification rules apply for dealer's hand.
      // Also applies for single player games, like video poker.
      if (canDisqualify && this.game.lowestQualified) {
        this.alwaysQualifies = false;
      }
      
      // Get rank based on game.
      var handRank = this.game.handValues.length;
      for (var i=0; i<this.game.handValues.length; i++) {
        if (this.game.handValues[i] === this.constructor) {
          break;
        }
      }
      this.rank = handRank - i;

      // Set up the pool of cards.
      this.cardPool = cards.map(function(c) {
        return (typeof c === 'string') ? new Card(c) : c;
      });

      // Fix the card ranks for wild cards, and sort.
      for (var i=0; i<this.cardPool.length; i++) {
        card = this.cardPool[i];
        if (card.value === this.game.wildValue) {
          card.rank = -1;
        }
      }
      this.cardPool = this.cardPool.sort(Card.sort);

      // Create the arrays of suits and values.
      var obj, obj1, key, key1, card;
      for (var i=0; i<this.cardPool.length; i++) {
        // Make sure this value already exists in the object.
        card = this.cardPool[i];

        // We do something special if this is a wild card.
        if (card.rank === -1) {
          this.wilds.push(card);
        } else {
          (obj = this.suits)[key = card.suit] || (obj[key] = []);
          (obj1 = this.values)[key1 = card.rank] || (obj1[key1] = []);

          // Add the value to the array for that type in the object.
          this.suits[card.suit].push(card);
          this.values[card.rank].push(card);
        }
      }

      this.values.reverse();
      this.isPossible = this.solve();
    }

    /**
     * Compare current hand with another to determine which is the winner.
     * @param  {Hand} a Hand to compare to.
     * @return {Number}
     */
    compare(a) {
      if (this.rank < a.rank) {
        return 1;
      } else if (this.rank > a.rank) {
        return -1;
      }

      var result = 0;
      for (var i=0; i<=4; i++) {
        if (this.cards[i] && a.cards[i] && this.cards[i].rank < a.cards[i].rank) {
          result = 1;
          break;
        } else if (this.cards[i] && a.cards[i] && this.cards[i].rank > a.cards[i].rank) {
          result = -1;
          break;
        }
      }

      return result;
    }

    /**
     * Determine whether a hand loses to another.
     * @param  {Hand} hand Hand to compare to.
     * @return {Boolean}
     */
    loseTo(hand) {
      return (this.compare(hand) > 0);
    }

    /**
     * Determine the number of cards in a hand of a rank.
     * @param  {Number} val Index of this.values.
     * @return {Number} Number of cards having the rank, including wild cards.
     */
    getNumCardsByRank(val) {
      var cards = this.values[val];
      var checkCardsLength = (cards) ? cards.length : 0;

      for (var i=0; i<this.wilds.length; i++) {
        if (this.wilds[i].rank > -1) {
          continue;
        } else if (cards) {
          if (this.game.wildStatus === 1 || cards[0].rank === values.length - 1) {
            checkCardsLength += 1;
          }
        } else if (this.game.wildStatus === 1 || val === values.length - 1) {
          checkCardsLength += 1;
        }
      }

      return checkCardsLength;
    }

    /**
     * Determine the cards in a suit for a flush.
     * @param  {String} suit Key for this.suits.
     * @param  {Boolean} setRanks Whether to set the ranks for the wild cards.
     * @return {Array} Cards having the suit, including wild cards.
     */
    getCardsForFlush(suit, setRanks) {
      var cards = (this.suits[suit] || []).sort(Card.sort);

      for (var i=0; i<this.wilds.length; i++) {
        var wild = this.wilds[i];

        if (setRanks) {
          var j=0;
          while (j<values.length && j<cards.length) {
            if (cards[j].rank === values.length-1-j) {
              j += 1;
            } else {
              break;
            }
          }
          wild.rank = values.length-1-j;
          wild.wildValue = values[wild.rank];
        }

        cards.push(wild);
        cards = cards.sort(Card.sort);
      }

      return cards;
    }

    /**
     * Resets the rank and wild values of the wild cards.
     */
    resetWildCards() {
      for (var i=0; i<this.wilds.length; i++) {
        this.wilds[i].rank = -1;
        this.wilds[i].wildValue = this.wilds[i].value;
      }
    }

    /**
     * Highest card comparison.
     * @return {Array} Highest cards
     */
    nextHighest() {
      var picks;
      var excluding = [];
      excluding = excluding.concat(this.cards);

      picks = this.cardPool.filter(function(card) {
        if (excluding.indexOf(card) < 0) {
          return true;
        }
      });

      // Account for remaining wild card when it must be ace.
      if (this.game.wildStatus === 0) {
        for (var i=0; i<picks.length; i++) {
          var card = picks[i];
          if (card.rank === -1) {
            card.wildValue = 'A';
            card.rank = values.length - 1;
          }
        }
        picks = picks.sort(Card.sort);
      }

      return picks;
    }

    /**
     * Return list of contained cards in human readable format.
     * @return {String}
     */
    toString() {
      var cards = this.cards.map(function(c) {
        return c.toString();
      });

      return cards.join(', ');
    }

    /**
     * Return array of contained cards.
     * @return {Array}
     */
    toArray() {
      var cards = this.cards.map(function(c) {
        return c.toString();
      });

      return cards;
    }

    /**
     * Determine if qualifying hand.
     * @return {Boolean}
     */
    qualifiesHigh() {
      if (!this.game.lowestQualified || this.alwaysQualifies) {
        return true;
      }

      return (this.compare(Hand.solve(this.game.lowestQualified, this.game)) <= 0);
    }

    /**
     * Find highest ranked hands and remove any that don't qualify or lose to another hand.
     * @param  {Array} hands Hands to evaluate.
     * @return {Array}       Winning hands.
     */
    static winners(hands) {
      hands = hands.filter(function(h) {
        return h.qualifiesHigh();
      });

      var highestRank = Math.max.apply(Math, hands.map(function(h) {
        return h.rank;
      }));

      hands = hands.filter(function(h) {
        return h.rank === highestRank;
      });

      hands = hands.filter(function(h) {
        var lose = false;
        for (var i=0; i<hands.length; i++) {
          lose = h.loseTo(hands[i]);
          if (lose) {
            break;
          }
        }

        return !lose;
      });

      return hands;
    }

    /**
     * Build and return the best hand.
     * @param  {Array} cards Array of cards (['Ad', '3c', 'Th', ...]).
     * @param  {String} game Game being played.
     * @param  {Boolean} canDisqualify Check for a qualified hand.
     * @return {Hand}       Best hand.
     */
    static solve(cards, game, canDisqualify) {
      game = game || 'standard';
      game = (typeof game === 'string') ? new Game(game) : game;
      cards = cards || [''];

      var hands = game.handValues;
      var result = null;

      for (var i=0; i<hands.length; i++) {
        result = new hands[i](cards, game, canDisqualify);
        if (result.isPossible) {
          break;
        }
      }

      return result;
    }

    /**
     * Separate cards based on if they are wild cards.
     * @param  {Array} cards Array of cards (['Ad', '3c', 'Th', ...]).
     * @param  {Game} game Game being played.
     * @return {Array} [wilds, nonWilds] Wild and non-Wild Cards.
     */
    static stripWilds(cards, game) {
      var card, wilds, nonWilds;
      cards = cards || [''];
      wilds = [];
      nonWilds = [];

      for (var i=0; i<cards.length; i++) {
        card = cards[i];
        if (card.rank === -1) {
          wilds.push(cards[i]);  
        } else {
          nonWilds.push(cards[i]);  
        }
      }

      return [wilds, nonWilds];
    }
  }

  class StraightFlush extends Hand {
    constructor(cards, game, canDisqualify) {
      super(cards, 'Straight Flush', game, canDisqualify);
    }

    solve() {
      var cards;
      this.resetWildCards();
      var possibleStraight = null;
      var nonCards = [];

      for (var suit in this.suits) {
        cards = this.getCardsForFlush(suit, false);
        if (cards && cards.length >= this.game.sfQualify) {
          possibleStraight = cards;
          break;
        } 
      }

      if (possibleStraight) {
        if (this.game.descr !== 'standard') {
          for (var suit in this.suits) {
            if (possibleStraight[0].suit !== suit) {
              nonCards = nonCards.concat(this.suits[suit] || []);
              nonCards = Hand.stripWilds(nonCards, this.game)[1];
            }
          }
        }
        var straight = new Straight(possibleStraight, this.game);
        if (straight.isPossible) {
          this.cards = straight.cards;
          this.cards = this.cards.concat(nonCards);
          this.sfLength = straight.sfLength;
        }
      }

      if (this.cards[0] && this.cards[0].rank === 13) {
        this.descr = 'Royal Flush';
      } else if (this.cards.length >= this.game.sfQualify) {
        this.descr = this.name + ', ' + this.cards[0].toString().slice(0, -1) + suit + ' High';
      }

      return this.cards.length >= this.game.sfQualify;
    }
  }

  class RoyalFlush extends StraightFlush {
    constructor(cards, game, canDisqualify) {
      super(cards, game, canDisqualify);
    }

    solve() {
      this.resetWildCards();
      var result = super.solve();
      return result && this.descr === 'Royal Flush';
    }
  }

  class NaturalRoyalFlush extends RoyalFlush {
    constructor(cards, game, canDisqualify) {
      super(cards, game, canDisqualify);
    }

    solve() {
      var i = 0;
      this.resetWildCards();
      var result = super.solve();
      if (result && this.cards) {
        for (i=0; i<this.game.sfQualify && i<this.cards.length; i++) {
          if (this.cards[i].value === this.game.wildValue) {
            result = false;
            this.descr = 'Wild Royal Flush';
            break;
          }
        }
        if (i === this.game.sfQualify) {
          this.descr = 'Royal Flush';
        }
      }
      return result;
    }
  }

  class WildRoyalFlush extends RoyalFlush {
    constructor(cards, game, canDisqualify) {
      super(cards, game, canDisqualify);
    }

    solve() {
      var i = 0;
      this.resetWildCards();
      var result = super.solve();
      if (result && this.cards) {
        for (i=0; i<this.game.sfQualify && i<this.cards.length; i++) {
          if (this.cards[i].value === this.game.wildValue) {
            this.descr = 'Wild Royal Flush';
            break;
          }
        }
        if (i === this.game.sfQualify) {
          result = false;
          this.descr = 'Royal Flush';
        }
      }
      return result;
    }
  }

  class FiveOfAKind extends Hand {
    constructor(cards, game, canDisqualify) {
      super(cards, 'Five of a Kind', game, canDisqualify);
    }

    solve() {
      this.resetWildCards();

      for (var i=0; i<this.values.length; i++) {
        if (this.getNumCardsByRank(i) === 5) {
          this.cards = this.values[i] || [];
          for (var j=0; j<this.wilds.length && this.cards.length<5; j++) {
            var wild = this.wilds[j];
            if (this.cards) {
              wild.rank = this.cards[0].rank;
            } else {
              wild.rank = values.length - 1;
            }
            wild.wildValue = values[wild.rank];
            this.cards.push(wild);
          }
          this.cards = this.cards.concat(this.nextHighest().slice(0, this.game.cardsInHand-5));
          break;
        }
      }

      if (this.cards.length >= 5) {
        this.descr = this.name + ', ' + this.cards[0].toString().slice(0, -1) + '\'s';
      }

      return this.cards.length >= 5;
    }
  }

  class FourOfAKindPairPlus extends Hand {
    constructor(cards, game, canDisqualify) {
      super(cards, 'Four of a Kind with Pair or Better', game, canDisqualify);
    }

    solve() {
      var cards;
      this.resetWildCards();

      for (var i=0; i<this.values.length; i++) {
        if (this.getNumCardsByRank(i) === 4) {
          this.cards = this.values[i] || [];
          for (var j=0; j<this.wilds.length && this.cards.length<4; j++) {
            var wild = this.wilds[j];
            if (this.cards) {
              wild.rank = this.cards[0].rank;
            } else {
              wild.rank = values.length - 1;
            }
            wild.wildValue = values[wild.rank];
            this.cards.push(wild);
          }
          break;
        }
      }

      if (this.cards.length === 4) {
        for (i=0; i<this.values.length; i++) {
          cards = this.values[i];
          if (cards && this.cards[0].wildValue === cards[0].wildValue) {
            continue;
          }
          if (this.getNumCardsByRank(i) >= 2) {
            this.cards = this.cards.concat(cards || []);
            for (var j=0; j<this.wilds.length; j++) {
              var wild = this.wilds[j];
              if (wild.rank !== -1) {
                continue;
              }
              if (cards) {
                wild.rank = cards[0].rank;
              } else if (this.cards[0].rank === values.length - 1 && this.game.wildStatus === 1) {
                wild.rank = values.length - 2;
              } else {
                wild.rank = values.length - 1;
              }
              wild.wildValue = values[wild.rank];
              this.cards.push(wild);
            }
            this.cards = this.cards.concat(this.nextHighest().slice(0, this.game.cardsInHand-6));
            break;
          }
        }
      }

      if (this.cards.length >= 6) {
        var type = this.cards[0].toString().slice(0, -1) + '\'s over ' + this.cards[4].toString().slice(0, -1) + '\'s';
        this.descr = this.name + ', ' + type;
      }

      return this.cards.length >= 6;
    }
  }

  class FourOfAKind extends Hand {
    constructor(cards, game, canDisqualify) {
      super(cards, 'Four of a Kind', game, canDisqualify);
    }

    solve() {
      this.resetWildCards();

      for (var i=0; i<this.values.length; i++) {
        if (this.getNumCardsByRank(i) === 4) {
          this.cards = this.values[i] || [];
          for (var j=0; j<this.wilds.length && this.cards.length<4; j++) {
            var wild = this.wilds[j];
            if (this.cards) {
              wild.rank = this.cards[0].rank;
            } else {
              wild.rank = values.length - 1;
            }
            wild.wildValue = values[wild.rank];
            this.cards.push(wild);
          }

          this.cards = this.cards.concat(this.nextHighest().slice(0, this.game.cardsInHand-4));
          break;
        }
      }

      if (this.cards.length >= 4) {
        if (this.game.noKickers) {
          this.cards.length = 4;
        }

        this.descr = this.name + ', ' + this.cards[0].toString().slice(0, -1) + '\'s';
      }

      return this.cards.length >= 4;
    }
  }

  class FourWilds extends Hand {
    constructor(cards, game, canDisqualify) {
      super(cards, 'Four Wild Cards', game, canDisqualify);
    }

    solve() {
      if (this.wilds.length === 4) {
        this.cards = this.wilds;
        this.cards = this.cards.concat(this.nextHighest().slice(0, this.game.cardsInHand-4));
      }

      if (this.cards.length >= 4) {
        if (this.game.noKickers) {
          this.cards.length = 4;
        }

        this.descr = this.name;
      }

      return this.cards.length >= 4;
    }
  }

  class ThreeOfAKindTwoPair extends Hand {
    constructor(cards, game, canDisqualify) {
      super(cards, 'Three of a Kind with Two Pair', game, canDisqualify);
    }

    solve() {
      var cards;
      this.resetWildCards();

      for (var i=0; i<this.values.length; i++) {
        if (this.getNumCardsByRank(i) === 3) {
          this.cards = this.values[i] || [];
          for (var j=0; j<this.wilds.length && this.cards.length<3; j++) {
            var wild = this.wilds[j];
            if (this.cards) {
              wild.rank = this.cards[0].rank;
            } else {
              wild.rank = values.length - 1;
            }
            wild.wildValue = values[wild.rank];
            this.cards.push(wild);
          }
          break;
        }
      }

      if (this.cards.length === 3) {
        for (var i=0; i<this.values.length; i++) {
          var cards = this.values[i];
          if (cards && this.cards[0].wildValue === cards[0].wildValue) {
            continue;
          }
          if (this.cards.length > 5 && this.getNumCardsByRank(i) === 2) {
            this.cards = this.cards.concat(cards || []);
            for (var j=0; j<this.wilds.length; j++) {
              var wild = this.wilds[j];
              if (wild.rank !== -1) {
                continue;
              }
              if (cards) {
                wild.rank = cards[0].rank;
              } else if (this.cards[0].rank === values.length - 1 && this.game.wildStatus === 1) {
                wild.rank = values.length - 2;
              } else {
                wild.rank = values.length - 1;
              }
              wild.wildValue = values[wild.rank];
              this.cards.push(wild);
            }
            this.cards = this.cards.concat(this.nextHighest().slice(0, this.game.cardsInHand-4));
            break;
          } else if (this.getNumCardsByRank(i) === 2) {
            this.cards = this.cards.concat(cards);
            for (var j=0; j<this.wilds.length; j++) {
              var wild = this.wilds[j];
              if (wild.rank !== -1) {
                continue;
              }
              if (cards) {
                wild.rank = cards[0].rank;
              } else if (this.cards[0].rank === values.length - 1 && this.game.wildStatus === 1) {
                wild.rank = values.length - 2;
              } else {
                wild.rank = values.length - 1;
              }
              wild.wildValue = values[wild.rank];
              this.cards.push(wild);
            }
          }
        }
      }

      if (this.cards.length >= 7) {
        var type = this.cards[0].toString().slice(0, -1) + '\'s over ' + this.cards[3].toString().slice(0, -1) + '\'s & ' + this.cards[5].value + '\'s';
        this.descr = this.name + ', ' + type;
      }

      return this.cards.length >= 7;
    }
  }

  class FullHouse extends Hand {
    constructor(cards, game, canDisqualify) {
      super(cards, 'Full House', game, canDisqualify);
    }

    solve() {
      var cards;
      this.resetWildCards();

      for (var i=0; i<this.values.length; i++) {
        if (this.getNumCardsByRank(i) === 3) {
          this.cards = this.values[i] || [];
          for (var j=0; j<this.wilds.length && this.cards.length<3; j++) {
            var wild = this.wilds[j];
            if (this.cards) {
              wild.rank = this.cards[0].rank;
            } else {
              wild.rank = values.length - 1;
            }
            wild.wildValue = values[wild.rank];
            this.cards.push(wild);
          }
          break;
        }
      }

      if (this.cards.length === 3) {
        for (i=0; i<this.values.length; i++) {
          cards = this.values[i];
          if (cards && this.cards[0].wildValue === cards[0].wildValue) {
            continue;
          }
          if (this.getNumCardsByRank(i) >= 2) {
            this.cards = this.cards.concat(cards || []);
            for (var j=0; j<this.wilds.length; j++) {
              var wild = this.wilds[j];
              if (wild.rank !== -1) {
                continue;
              }
              if (cards) {
                wild.rank = cards[0].rank;
              } else if (this.cards[0].rank === values.length - 1 && this.game.wildStatus === 1) {
                wild.rank = values.length - 2;
              } else {
                wild.rank = values.length - 1;
              }
              wild.wildValue = values[wild.rank];
              this.cards.push(wild);
            }
            this.cards = this.cards.concat(this.nextHighest().slice(0, this.game.cardsInHand-5));
            break;
          }
        }
      }

      if (this.cards.length >= 5) {
        var type = this.cards[0].toString().slice(0, -1) + '\'s over ' + this.cards[3].toString().slice(0, -1) + '\'s';
        this.descr = this.name + ', ' + type;
      }

      return this.cards.length >= 5;
    }
  }

  class Flush extends Hand {
    constructor(cards, game, canDisqualify) {
      super(cards, 'Flush', game, canDisqualify);
    }

    solve() {
      this.sfLength = 0;
      this.resetWildCards();

      for (var suit in this.suits) {
        var cards = this.getCardsForFlush(suit, true);
        if (cards.length >= this.game.sfQualify) {
          this.cards = cards;
          break;
        }
      }

      if (this.cards.length >= this.game.sfQualify) {
        this.descr = this.name + ', ' + this.cards[0].toString().slice(0, -1) + suit + ' High';
        this.sfLength = this.cards.length;
        if (this.cards.length < this.game.cardsInHand) {
          this.cards = this.cards.concat(this.nextHighest().slice(0, this.game.cardsInHand-this.cards.length));
        }
      }

      return this.cards.length >= this.game.sfQualify;
    }
  }

  class Straight extends Hand {
    constructor(cards, game, canDisqualify) {
      super(cards, 'Straight', game, canDisqualify);
    }

    solve() {
      var card, checkCards;
      this.resetWildCards();

      // There are still some games that count the wheel as second highest.
      // These games do not have enough cards/wilds to make AKQJT and 5432A both possible.
      if (this.game.wheelStatus === 1) {
        this.cards = this.getWheel();
        if (this.cards.length) {
          var wildCount = 0;
          for (var i=0; i<this.cards.length; i++) {
            card = this.cards[i];
            if (card.value === this.game.wildValue) {
              wildCount += 1;
            }
            if (card.rank === 0) {
              card.rank = values.indexOf('A');
              card.wildValue = 'A';
              if (card.value === '1') {
                card.value = 'A';
              }
            }
          }
          this.cards = this.cards.sort(Card.sort);
          for (; wildCount<this.wilds.length && this.cards.length < this.game.cardsInHand; wildCount++) {
            card = this.wilds[wildCount];
            card.rank = values.indexOf('A');
            card.wildValue = 'A';
            this.cards.push(card);
          }
          this.descr = this.name + ', Wheel';
          this.sfLength = this.sfQualify;
          if (this.cards[0].value === 'A') {
            this.cards = this.cards.concat(this.nextHighest().slice(1, this.game.cardsInHand-this.cards.length+1));
          } else {
            this.cards = this.cards.concat(this.nextHighest().slice(0, this.game.cardsInHand-this.cards.length));
          }
          return true;
        }
        this.resetWildCards();
      }

      this.cards = this.getGaps();

      // Now add the wild cards, if any, and set the appropriate ranks
      for (var i=0; i<this.wilds.length; i++) {
        card = this.wilds[i];
        checkCards = this.getGaps(this.cards.length);
        if (this.cards.length === checkCards.length) {
          // This is an "open-ended" straight, the high rank is the highest possible rank.
          if (this.cards[0].rank < (values.length - 1)) {
            card.rank = this.cards[0].rank + 1;
            card.wildValue = values[card.rank];
            this.cards.push(card);
          } else {
            card.rank = this.cards[this.cards.length - 1].rank - 1;
            card.wildValue = values[card.rank];
            this.cards.push(card);
          }
        } else {
          // This is an "inside" straight, the high card doesn't change.
          for (var j=1; j<this.cards.length; j++) {
            if (this.cards[j-1].rank - this.cards[j].rank > 1) {
              card.rank = this.cards[j-1].rank - 1;
              card.wildValue = values[card.rank];
              this.cards.push(card);
              break;
            }
          }
        }
        this.cards = this.cards.sort(Card.sort);
      }
      if (this.cards.length >= this.game.sfQualify) {
        this.descr = this.name + ', ' + this.cards[0].toString().slice(0, -1) + ' High';
        this.cards = this.cards.slice(0, this.game.cardsInHand);
        this.sfLength = this.cards.length;
        if (this.cards.length < this.game.cardsInHand) {
          if (this.cards[this.sfLength-1].rank === 0) {
            this.cards = this.cards.concat(this.nextHighest().slice(1, this.game.cardsInHand-this.cards.length+1));
          } else {
            this.cards = this.cards.concat(this.nextHighest().slice(0, this.game.cardsInHand-this.cards.length));
          }
        }
      }

      return this.cards.length >= this.game.sfQualify;
    }

    /**
     * Get the number of gaps in the straight.
     * @return {Array} Highest potential straight with fewest number of gaps.
     */
    getGaps(checkHandLength) {
      var wildCards, cardsToCheck, i, card, gapCards, cardsList, gapCount, prevCard, diff;

      var stripReturn = Hand.stripWilds(this.cardPool, this.game);
      wildCards = stripReturn[0];
      cardsToCheck = stripReturn[1];

      for (i=0; i<cardsToCheck.length; i++) {
        card = cardsToCheck[i];
        if (card.wildValue === 'A') {
          cardsToCheck.push(new Card('1' + card.suit));
        }
      }
      cardsToCheck = cardsToCheck.sort(Card.sort);

      if (checkHandLength) {
        i = cardsToCheck[0].rank + 1;
      } else {
        checkHandLength = this.game.sfQualify;
        i = values.length;
      }

      gapCards = [];
      for (; i>0; i--) {
        cardsList = [];
        gapCount = 0;
        for (var j=0; j<cardsToCheck.length; j++) {
          card = cardsToCheck[j];
          if (card.rank > i) {
            continue;
          }
          prevCard = cardsList[cardsList.length - 1];
          diff = (prevCard) ? prevCard.rank - card.rank : i - card.rank;

          if (diff === null) {
            cardsList.push(card);
          } else if (checkHandLength < (gapCount + diff + cardsList.length)) {
            break;
          } else if (diff > 0) {
            cardsList.push(card);
            gapCount += (diff - 1);
          }
        }
        if (cardsList.length > gapCards.length) {
          gapCards = cardsList.slice();
        }
        if (this.game.sfQualify - gapCards.length <= wildCards.length) {
          break;
        }
      }

      return gapCards;
    }

    getWheel() {
      var wildCards, cardsToCheck, i, card, wheelCards, wildCount, cardFound;

      var stripReturn = Hand.stripWilds(this.cardPool, this.game);
      wildCards = stripReturn[0];
      cardsToCheck = stripReturn[1];

      for (i=0; i<cardsToCheck.length; i++) {
        card = cardsToCheck[i];
        if (card.wildValue === 'A') {
          cardsToCheck.push(new Card('1' + card.suit));
        }
      }
      cardsToCheck = cardsToCheck.sort(Card.sort);

      wheelCards = [];
      wildCount = 0;
      for (i = this.game.sfQualify-1; i>=0; i--) {
        cardFound = false;
        for (var j=0; j<cardsToCheck.length; j++) {
          card = cardsToCheck[j];
          if (card.rank > i) {
            continue;
          }
          if (card.rank < i) {
            break;
          }
          wheelCards.push(card);
          cardFound = true;
          break;
        }
        if (!cardFound) {
          if (wildCount < wildCards.length) {
            wildCards[wildCount].rank = i;
            wildCards[wildCount].wildValue = values[i];
            wheelCards.push(wildCards[wildCount]);
            wildCount += 1;
          } else {
            return [];
          }
        }
      }

      return wheelCards;
    }
  }

  class TwoThreeOfAKind extends Hand {
    constructor(cards, game, canDisqualify) {
      super(cards, 'Two Three Of a Kind', game, canDisqualify);
    }

    solve() {
      this.resetWildCards();
      for (var i=0; i<this.values.length; i++) {
        var cards = this.values[i];
        if (this.cards.length > 0 && this.getNumCardsByRank(i) === 3) {
          this.cards = this.cards.concat(cards || []);
          for (var j=0; j<this.wilds.length; j++) {
            var wild = this.wilds[j];
            if (wild.rank !== -1) {
              continue;
            }
            if (cards) {
              wild.rank = cards[0].rank;
            } else if (this.cards[0].rank === values.length - 1 && this.game.wildStatus === 1) {
              wild.rank = values.length - 2;
            } else {
              wild.rank = values.length - 1;
            }
            wild.wildValue = values[wild.rank];
            this.cards.push(wild);
          }
          this.cards = this.cards.concat(this.nextHighest().slice(0, this.game.cardsInHand-6));
          break;
        } else if (this.getNumCardsByRank(i) === 3) {
          this.cards = this.cards.concat(cards);
          for (var j=0; j<this.wilds.length; j++) {
            var wild = this.wilds[j];
            if (wild.rank !== -1) {
              continue;
            }
            if (cards) {
              wild.rank = cards[0].rank;
            } else if (this.cards[0].rank === values.length - 1 && this.game.wildStatus === 1) {
              wild.rank = values.length - 2;
            } else {
              wild.rank = values.length - 1;
            }
            wild.wildValue = values[wild.rank];
            this.cards.push(wild);
          }
        }
      }

      if (this.cards.length >= 6) {
        var type = this.cards[0].toString().slice(0, -1) + '\'s & ' + this.cards[3].toString().slice(0, -1) + '\'s';
        this.descr = this.name + ', ' + type;
      }

      return this.cards.length >= 6;
    }
  }

  class ThreeOfAKind extends Hand {
    constructor(cards, game, canDisqualify) {
      super(cards, 'Three of a Kind', game, canDisqualify);
    }

    solve() {
      this.resetWildCards();

      for (var i=0; i<this.values.length; i++) {
        if (this.getNumCardsByRank(i) === 3) {
          this.cards = this.values[i] || [];
          for (var j=0; j<this.wilds.length && this.cards.length<3; j++) {
            var wild = this.wilds[j];
            if (this.cards) {
              wild.rank = this.cards[0].rank;
            } else {
              wild.rank = values.length - 1;
            }
            wild.wildValue = values[wild.rank];
            this.cards.push(wild);
          }
          this.cards = this.cards.concat(this.nextHighest().slice(0, this.game.cardsInHand-3));
          break;
        }
      }

      if (this.cards.length >= 3) {
        if (this.game.noKickers) {
          this.cards.length = 3;
        }

        this.descr = this.name + ', ' + this.cards[0].toString().slice(0, -1) + '\'s';
      }

      return this.cards.length >= 3;
    }
  }

  class ThreePair extends Hand {
    constructor(cards, game, canDisqualify) {
      super(cards, 'Three Pair', game, canDisqualify);
    }

    solve() {
      this.resetWildCards();

      for (var i=0; i<this.values.length; i++) {
        var cards = this.values[i];
        if (this.cards.length > 2 && this.getNumCardsByRank(i) === 2) {
          this.cards = this.cards.concat(cards || []);
          for (var j=0; j<this.wilds.length; j++) {
            var wild = this.wilds[j];
            if (wild.rank !== -1) {
              continue;
            }
            if (cards) {
              wild.rank = cards[0].rank;
            } else if (this.cards[0].rank === values.length - 1 && this.game.wildStatus === 1) {
              wild.rank = values.length - 2;
            } else {
              wild.rank = values.length - 1;
            }
            wild.wildValue = values[wild.rank];
            this.cards.push(wild);
          }
          this.cards = this.cards.concat(this.nextHighest().slice(0, this.game.cardsInHand-6));
          break;
        } else if (this.cards.length > 0 && this.getNumCardsByRank(i) === 2) {
          this.cards = this.cards.concat(cards || []);
          for (var j=0; j<this.wilds.length; j++) {
            var wild = this.wilds[j];
            if (wild.rank !== -1) {
              continue;
            }
            if (cards) {
              wild.rank = cards[0].rank;
            } else if (this.cards[0].rank === values.length - 1 && this.game.wildStatus === 1) {
              wild.rank = values.length - 2;
            } else {
              wild.rank = values.length - 1;
            }
            wild.wildValue = values[wild.rank];
            this.cards.push(wild);
          }
        } else if (this.getNumCardsByRank(i) === 2) {
          this.cards = this.cards.concat(cards);
          for (var j=0; j<this.wilds.length; j++) {
            var wild = this.wilds[j];
            if (wild.rank !== -1) {
              continue;
            }
            if (cards) {
              wild.rank = cards[0].rank;
            } else if (this.cards[0].rank === values.length - 1 && this.game.wildStatus === 1) {
              wild.rank = values.length - 2;
            } else {
              wild.rank = values.length - 1;
            }
            wild.wildValue = values[wild.rank];
            this.cards.push(wild);
          }
        }
      }

      if (this.cards.length >= 6) {
        var type = this.cards[0].toString().slice(0, -1) + '\'s & ' + this.cards[2].toString().slice(0, -1) + '\'s & ' + this.cards[4].toString().slice(0, -1) + '\'s';
        this.descr = this.name + ', ' + type;
      }

      return this.cards.length >= 6;
    }
  }

  class TwoPair extends Hand {
    constructor(cards, game, canDisqualify) {
      super(cards, 'Two Pair', game, canDisqualify);
    }

    solve() {
      this.resetWildCards();

      for (var i=0; i<this.values.length; i++) {
        var cards = this.values[i];
        if (this.cards.length > 0 && this.getNumCardsByRank(i) === 2) {
          this.cards = this.cards.concat(cards || []);
          for (var j=0; j<this.wilds.length; j++) {
            var wild = this.wilds[j];
            if (wild.rank !== -1) {
              continue;
            }
            if (cards) {
              wild.rank = cards[0].rank;
            } else if (this.cards[0].rank === values.length - 1 && this.game.wildStatus === 1) {
              wild.rank = values.length - 2;
            } else {
              wild.rank = values.length - 1;
            }
            wild.wildValue = values[wild.rank];
            this.cards.push(wild);
          }
          this.cards = this.cards.concat(this.nextHighest().slice(0, this.game.cardsInHand-4));
          break;
        } else if (this.getNumCardsByRank(i) === 2) {
          this.cards = this.cards.concat(cards);
          for (var j=0; j<this.wilds.length; j++) {
            var wild = this.wilds[j];
            if (wild.rank !== -1) {
              continue;
            }
            if (cards) {
              wild.rank = cards[0].rank;
            } else if (this.cards[0].rank === values.length - 1 && this.game.wildStatus === 1) {
              wild.rank = values.length - 2;
            } else {
              wild.rank = values.length - 1;
            }
            wild.wildValue = values[wild.rank];
            this.cards.push(wild);
          }
        }
      }

      if (this.cards.length >= 4) {
        if (this.game.noKickers) {
          this.cards.length = 4;
        }

        var type = this.cards[0].toString().slice(0, -1) + '\'s & ' + this.cards[2].toString().slice(0, -1) + '\'s';
        this.descr = this.name + ', ' + type;
      }

      return this.cards.length >= 4;
    }
  }

  class OnePair extends Hand {
    constructor(cards, game, canDisqualify) {
      super(cards, 'Pair', game, canDisqualify);
    }

    solve() {
      this.resetWildCards();

      for (var i=0; i<this.values.length; i++) {
        if (this.getNumCardsByRank(i) === 2) {
          this.cards = this.cards.concat(this.values[i] || []);
          for (var j=0; j<this.wilds.length && this.cards.length<2; j++) {
            var wild = this.wilds[j];
            if (this.cards) {
              wild.rank = this.cards[0].rank;
            } else {
              wild.rank = values.length - 1;
            }
            wild.wildValue = values[wild.rank];
            this.cards.push(wild);
          }
          this.cards = this.cards.concat(this.nextHighest().slice(0, this.game.cardsInHand-2));
          break;
        }
      }

      if (this.cards.length >= 2) {
        if (this.game.noKickers) {
          this.cards.length = 2;
        }

        this.descr = this.name + ', ' + this.cards[0].toString().slice(0, -1) + '\'s';
      }

      return this.cards.length >= 2;
    }
  }

  class HighCard extends Hand {
    constructor(cards, game, canDisqualify) {
      super(cards, 'High Card', game, canDisqualify);
    }

    solve() {
      this.cards = this.cardPool.slice(0, this.game.cardsInHand);

      for (var i=0; i<this.cards.length; i++) {
        var card = this.cards[i];
        if (this.cards[i].value === this.game.wildValue) {
          this.cards[i].wildValue = 'A';
          this.cards[i].rank = values.indexOf('A');
        }
      }

      if (this.game.noKickers) {
        this.cards.length = 1;
      }

      this.cards = this.cards.sort(Card.sort);
      this.descr = this.cards[0].toString().slice(0, -1) + ' High';

      return true;
    }
  }

  /*
   * Base class for handling Pai Gow Poker hands.
   * House Way is in accordance with the MGM Grand Casino, Las Vegas NV.
   * http://wizardofodds.com/games/pai-gow-poker/house-way/mgm/
   * EXCEPTION: With Four of a Kind and S/F, preserve the S/F, just like Three of a Kind.
   */
  class PaiGowPokerHelper {
    /*
     * Constructor class.
     * @param {Hand} hand Solved hand against Game 'paigowpokerfull'.
     */
    constructor(hand) {
      this.baseHand = null;
      this.hiHand = null;
      this.loHand = null;
      this.game = null;
      this.loGame = new Game('paigowpokerlo');
      this.hiGame = new Game('paigowpokerhi');

      if (Array.isArray(hand)) {
        this.baseHand = Hand.solve(hand, new Game('paigowpokerfull'));
      } else {
        this.baseHand = hand;
      }

      this.game = this.baseHand.game;
    }

    /*
     * Set a full hand into high and low hands, according to House Way.
     */
    splitHouseWay() {
      var hiCards, loCards;
      var rank = this.game.handValues.length - this.baseHand.rank;
      var handValue = this.game.handValues[rank];

      if (handValue === FiveOfAKind) {
        if (this.baseHand.cards[5].value === 'K' && this.baseHand.cards[6].value === 'K') {
          loCards = this.baseHand.cards.slice(5, 7);
          hiCards = this.baseHand.cards.slice(0, 5);
        } else {
          loCards = this.baseHand.cards.slice(0, 2);
          hiCards = this.baseHand.cards.slice(2, 7);
        }
      } else if (handValue === FourOfAKindPairPlus) {
        if (this.baseHand.cards[0].wildValue === 'A' && this.baseHand.cards[4].value !== 'K') {
          hiCards = this.baseHand.cards.slice(0, 2);
          loCards = this.baseHand.cards.slice(2, 4);
          hiCards = hiCards.concat(this.baseHand.cards.slice(4, 7));
        } else {
          hiCards = this.baseHand.cards.slice(0, 4);
          loCards = this.baseHand.cards.slice(4, 6);
          hiCards.push(this.baseHand.cards[6]);
        }
      } else if (handValue === StraightFlush || handValue === Flush || handValue === Straight) {
        var sfReturn;
        var altGame = new Game('paigowpokeralt');
        var altHand = Hand.solve(this.baseHand.cards, altGame);
        var altRank = altGame.handValues.length - altHand.rank;
        if (altGame.handValues[altRank] === FourOfAKind) {
          sfReturn = this.getSFData(altHand.cards);
          hiCards = sfReturn[0];
          loCards = sfReturn[1];
        } else if (altGame.handValues[altRank] === FullHouse) {
          hiCards = altHand.cards.slice(0, 3);
          loCards = altHand.cards.slice(3, 5);
          hiCards = hiCards.concat(altHand.cards.slice(5, 7));
        } else if (altGame.handValues[altRank] === ThreeOfAKind) {
          sfReturn = this.getSFData(altHand.cards);
          hiCards = sfReturn[0];
          loCards = sfReturn[1];
        } else if (altGame.handValues[altRank] === ThreePair) {
          loCards = altHand.cards.slice(0, 2);
          hiCards = altHand.cards.slice(2, 7);
        } else if (altGame.handValues[altRank] === TwoPair) {
          if (altHand.cards[0].rank < 6) {
            if (altHand.cards[4].wildValue === 'A') {
              hiCards = altHand.cards.slice(0, 4);
              loCards = altHand.cards.slice(4, 6);
              hiCards.push(altHand.cards[6]);
            } else {
              sfReturn = this.getSFData(altHand.cards);
              hiCards = sfReturn[0];
              loCards = sfReturn[1];
            }
          } else if (altHand.cards[0].rank < 10) {
            if (altHand.cards[4].wildValue === 'A') {
              hiCards = altHand.cards.slice(0, 4);
              loCards = altHand.cards.slice(4, 6);
              hiCards.push(altHand.cards[6]);
            } else {
              hiCards = altHand.cards.slice(0, 2);
              loCards = altHand.cards.slice(2, 4);
              hiCards = hiCards.concat(altHand.cards.slice(4, 7));
            }
          } else if (altHand.cards[0].wildValue !== 'A' && altHand.cards[2].rank < 6 && altHand.cards[4].wildValue === 'A') {
            hiCards = altHand.cards.slice(0, 4);
            loCards = altHand.cards.slice(4, 6);
            hiCards.push(altHand.cards[6]);
          } else {
            hiCards = altHand.cards.slice(0, 2);
            loCards = altHand.cards.slice(2, 4);
            hiCards = hiCards.concat(altHand.cards.slice(4, 7));
          }
        } else if (altGame.handValues[altRank] === OnePair) {
          if (altHand.cards[0].rank >= values.indexOf('T') && altHand.cards[0].rank <= values.indexOf('K') && altHand.cards[2].wildValue === 'A') {
            var possibleSF = altHand.cards.slice(0, 2);
            possibleSF = possibleSF.concat(altHand.cards.slice(3, 7));
            sfReturn = this.getSFData(possibleSF);
            if (sfReturn[0]) {
              hiCards = sfReturn[0];
              loCards = sfReturn[1];
              loCards.push(altHand.cards[2]);
            } else {
              hiCards = altHand.cards.slice(0, 2);
              loCards = altHand.cards.slice(2, 4);
              hiCards = hiCards.concat(altHand.cards.slice(4, 7));
            }
          } else {
            sfReturn = this.getSFData(altHand.cards.slice(2, 7));
            if (sfReturn[0]) {
              hiCards = sfReturn[0];
              loCards = altHand.cards.slice(0, 2);
            } else {
              sfReturn = this.getSFData(altHand.cards);
              hiCards = sfReturn[0];
              loCards = sfReturn[1];
            }
          }
        } else {
          sfReturn = this.getSFData(altHand.cards);
          hiCards = sfReturn[0];
          loCards = sfReturn[1];
        }
      } else if (handValue === FourOfAKind) {
        if (this.baseHand.cards[0].rank < 6) {
          hiCards = this.baseHand.cards.slice(0, 4);
          loCards = this.baseHand.cards.slice(4, 6);
          hiCards.push(this.baseHand.cards[6]);
        } else if (this.baseHand.cards[0].rank < 10 && this.baseHand.cards[4].wildValue === 'A') {
          hiCards = this.baseHand.cards.slice(0, 4);
          loCards = this.baseHand.cards.slice(4, 6);
          hiCards.push(this.baseHand.cards[6]);
        } else {
          hiCards = this.baseHand.cards.slice(0, 2);
          loCards = this.baseHand.cards.slice(2, 4);
          hiCards = hiCards.concat(this.baseHand.cards.slice(4, 7));
        }
      } else if (handValue === TwoThreeOfAKind) {
        loCards = this.baseHand.cards.slice(0, 2);
        hiCards = this.baseHand.cards.slice(3, 6);
        hiCards.push(this.baseHand.cards[2]);
        hiCards.push(this.baseHand.cards[6]);
      } else if (handValue === ThreeOfAKindTwoPair) {
        hiCards = this.baseHand.cards.slice(0, 3);
        loCards = this.baseHand.cards.slice(3, 5);
        hiCards = hiCards.concat(this.baseHand.cards.slice(5, 7));
      } else if (handValue === FullHouse) {
        if (this.baseHand.cards[3].wildValue === '2' && this.baseHand.cards[5].wildValue === 'A' && this.baseHand.cards[6].wildValue === 'K') {
          hiCards = this.baseHand.cards.slice(0, 5);
          loCards = this.baseHand.cards.slice(5, 7);
        } else {
          hiCards = this.baseHand.cards.slice(0, 3);
          loCards = this.baseHand.cards.slice(3, 5);
          hiCards = hiCards.concat(this.baseHand.cards.slice(5, 7));
        }
      } else if (handValue === ThreeOfAKind) {
        if (this.baseHand.cards[0].wildValue === 'A') {
          hiCards = this.baseHand.cards.slice(0, 2);
          loCards = this.baseHand.cards.slice(2, 4);
          hiCards = hiCards.concat(this.baseHand.cards.slice(4, 7));
        } else {
          hiCards = this.baseHand.cards.slice(0, 3);
          loCards = this.baseHand.cards.slice(3, 5);
          hiCards = hiCards.concat(this.baseHand.cards.slice(5, 7));
        }
      } else if (handValue === ThreePair) {
        loCards = this.baseHand.cards.slice(0, 2);
        hiCards = this.baseHand.cards.slice(2, 7);
      } else if (handValue === TwoPair) {
        if (this.baseHand.cards[0].rank < 6) {
          hiCards = this.baseHand.cards.slice(0, 4);
          loCards = this.baseHand.cards.slice(4, 6);
          hiCards.push(this.baseHand.cards[6]);
        } else if (this.baseHand.cards[0].rank < 10) {
          if (this.baseHand.cards[4].wildValue === 'A') {
            hiCards = this.baseHand.cards.slice(0, 4);
            loCards = this.baseHand.cards.slice(4, 6);
            hiCards.push(this.baseHand.cards[6]);
          } else {
            hiCards = this.baseHand.cards.slice(0, 2);
            loCards = this.baseHand.cards.slice(2, 4);
            hiCards = hiCards.concat(this.baseHand.cards.slice(4, 7));
          }
        } else if (this.baseHand.cards[0].wildValue !== 'A' && this.baseHand.cards[2].rank < 6 && this.baseHand.cards[4].wildValue === 'A') {
          hiCards = this.baseHand.cards.slice(0, 4);
          loCards = this.baseHand.cards.slice(4, 6);
          hiCards.push(this.baseHand.cards[6]);
        } else {
          hiCards = this.baseHand.cards.slice(0, 2);
          loCards = this.baseHand.cards.slice(2, 4);
          hiCards = hiCards.concat(this.baseHand.cards.slice(4, 7));
        }
      } else if (handValue === OnePair) {
        hiCards = this.baseHand.cards.slice(0, 2);
        loCards = this.baseHand.cards.slice(2, 4);
        hiCards = hiCards.concat(this.baseHand.cards.slice(4, 7));
      } else {
        hiCards = [this.baseHand.cards[0]];
        loCards = this.baseHand.cards.slice(1, 3);
        hiCards = hiCards.concat(this.baseHand.cards.slice(3, 7));
      }

      this.hiHand = Hand.solve(hiCards, this.hiGame);
      this.loHand = Hand.solve(loCards, this.loGame);
    }

    /*
     * Determine the best possible Straight and/or Flush.
     * @param  {Array} cards 5-7 Card objects to check.
     * @return {Array} [hiCards, loCards] High and Low components, if any.
     */
    getSFData(cards) {
      var hiCards, possibleLoCards, bestLoCards, bestHand;
      var handsToCheck = [
        new StraightFlush(cards, new Game('paigowpokersf7')),
        new StraightFlush(cards, new Game('paigowpokersf6')),
        new StraightFlush(cards, this.game),
        new Flush(cards, new Game('paigowpokersf7')),
        new Flush(cards, new Game('paigowpokersf6')),
        new Flush(cards, this.game),
        new Straight(cards, new Game('paigowpokersf7')),
        new Straight(cards, new Game('paigowpokersf6')),
        new Straight(cards, this.game)
      ];

      for (var i=0; i<handsToCheck.length; i++) {
        var hand = handsToCheck[i];
        if (hand.isPossible) {
          if (hand.sfLength === 7) {
            possibleLoCards = [hand.cards[0], hand.cards[1]];
          } else if (hand.sfLength === 6) {
            possibleLoCards = [hand.cards[0]];
            if (cards.length > 6) {
              possibleLoCards.push(hand.cards[6]);
            }
          } else if (cards.length > 5) {
            possibleLoCards = [hand.cards[5]];
            if (cards.length > 6) {
              possibleLoCards.push(hand.cards[6]);
            }
          }
          if (possibleLoCards) {
            possibleLoCards = possibleLoCards.sort(Card.sort);
            if (!bestLoCards || bestLoCards[0].rank < possibleLoCards[0].rank || (bestLoCards.length > 1 && bestLoCards[0].rank === possibleLoCards[0].rank && bestLoCards[1].rank < possibleLoCards[1].rank)) {
              bestLoCards = possibleLoCards;
              bestHand = hand;
            }
          } else if (!bestHand) {
            bestHand = hand;
            break;
          }
        }
      }

      if (bestHand) {
        if (bestHand.sfLength === 7) {
          hiCards = bestHand.cards.slice(2, 7);
        } else if (bestHand.sfLength === 6) {
          hiCards = bestHand.cards.slice(1, 6);
        } else {
          hiCards = bestHand.cards.slice(0, 5);
        }
      }

      return [hiCards, bestLoCards];
    }

    /*
     * Determine if the setting of the hands is valid. Hi must be higher than lo.
     * @return {Boolean}
     */
    qualifiesValid() {
      var compareHands = Hand.winners([this.hiHand, this.loHand]);

      return !(compareHands.length === 1 && compareHands[0] === this.loHand);
    }

    /**
     * Find which of two split hands is best, according to rules.
     * @param  {PaiGowPokerHelper} player Player hand to evaluate. Must be set.
     * @param  {PaiGowPokerHelper} banker Banker hand to evaluate. Must be set.
     * @param  {int}               winner Winning party, if any.
     *                                    Player = 1, Banker = -1, Push = 0
     */
    static winners(player, banker) {
      if (!player.qualifiesValid()) {
        if (banker.qualifiesValid()) {
          return -1;
        }
        // Probably shouldn't get here because the dealer must set house way.
        // However, we'll still have it as a sanity check, just in case.
        return 0;
      }

      if (!banker.qualifiesValid()) {
        return 1;
      }

      var hiWinner = Hand.winners([player.hiHand, banker.hiHand]);
      var loWinner = Hand.winners([player.loHand, banker.loHand]);

      // In Pai Gow Poker, Banker takes any equal valued hands.
      if (hiWinner.length === 1 && hiWinner[0] === player.hiHand) {
        if (loWinner.length === 1 && loWinner[0] === player.loHand) {
          // Player wins both; player wins
          return 1;
        }
        // Player wins hi, Banker wins lo; push
        return 0;
      }

      if (loWinner.length === 1 && loWinner[0] === player.loHand) {
        // Banker wins hi, Player wins lo; push
        return 0;
      }

      // Banker wins both; banker wins
      return -1;
    }

    /*
     * Set a full hand into high and low hands, according to manual input.
     * @param  {Array} hiHand       High hand to specify.
     *                              Can also be {Hand} with game of 'paigowpokerhi'.
     * @param  {Array} loHand       Low hand to specify.
     *                              Can also be {Hand} with game of 'paigowpokerlo'.
     * @return {PaiGowPokerHelper}  Object with split hands.
     */
    static setHands(hiHand, loHand) {
      var fullHand = [];

      if (Array.isArray(hiHand)) {
        hiHand = Hand.solve(hiHand, new Game('paigowpokerhi'));
      }
      fullHand = fullHand.concat(hiHand.cardPool);
      if (Array.isArray(loHand)) {
        loHand = Hand.solve(loHand, new Game('paigowpokerlo'));
      }
      fullHand = fullHand.concat(loHand.cardPool);

      var result = new PaiGowPokerHelper(fullHand);
      result.hiHand = hiHand;
      result.loHand = loHand;

      return result;
    }

    /**
     * Build and return PaiGowPokerHelper object with hands split House Way.
     * @param  {Array} fullHand    Array of cards (['Ad', '3c', 'Th', ...]).
     *                             Can also be {Hand} with game of 'paigowpokerfull'.
     * @return {PaiGowPokerHelper} Object with split hands.
     */
    static solve(fullHand) {
      var result = new PaiGowPokerHelper(fullHand = fullHand || ['']);
      result.splitHouseWay();

      return result;
    }
  }

  var gameRules = {
    'standard': {
      'cardsInHand': 5,
      'handValues': [StraightFlush, FourOfAKind, FullHouse, Flush, Straight, ThreeOfAKind, TwoPair, OnePair, HighCard],
      'wildValue': null,
      'wildStatus': 1,
      'wheelStatus': 0,
      'sfQualify': 5,
      'lowestQualified': null,
      "noKickers": false
    },
    'jacksbetter': {
      'cardsInHand': 5,
      'handValues': [StraightFlush, FourOfAKind, FullHouse, Flush, Straight, ThreeOfAKind, TwoPair, OnePair, HighCard],
      'wildValue': null,
      'wildStatus': 1,
      'wheelStatus': 0,
      'sfQualify': 5,
      'lowestQualified': ['Jc', 'Jd', '4h', '3s', '2c'],
      "noKickers": true
    },
    'joker': {
      'cardsInHand': 5,
      'handValues': [NaturalRoyalFlush, FiveOfAKind, WildRoyalFlush, StraightFlush, FourOfAKind, FullHouse, Flush, Straight, ThreeOfAKind, TwoPair, HighCard],
      'wildValue': 'O',
      'wildStatus': 1,
      'wheelStatus': 0,
      'sfQualify': 5,
      'lowestQualified': ['4c', '3d', '3h', '2s', '2c'],
      "noKickers": true
    },
    'deuceswild': {
      'cardsInHand': 5,
      'handValues': [NaturalRoyalFlush, FourWilds, WildRoyalFlush, FiveOfAKind, StraightFlush, FourOfAKind, FullHouse, Flush, Straight, ThreeOfAKind, HighCard],
      'wildValue': '2',
      'wildStatus': 1,
      'wheelStatus': 0,
      'sfQualify': 5,
      'lowestQualified': ['5c', '4d', '3h', '3s', '3c'],
      "noKickers": true
    },
    'threecard': {
      'cardsInHand': 3,
      'handValues': [StraightFlush, ThreeOfAKind, Straight, Flush, OnePair, HighCard],
      'wildValue': null,
      'wildStatus': 1,
      'wheelStatus': 0,
      'sfQualify': 3,
      'lowestQualified': ['Qh', '3s', '2c'],
      "noKickers": false
    },
    'fourcard': {
      'cardsInHand': 4,
      'handValues': [FourOfAKind, StraightFlush, ThreeOfAKind, Flush, Straight, TwoPair, OnePair, HighCard],
      'wildValue': null,
      'wildStatus': 1,
      'wheelStatus': 0,
      'sfQualify': 4,
      'lowestQualified': null,
      "noKickers": true
    },
    'fourcardbonus': {
      'cardsInHand': 4,
      'handValues': [FourOfAKind, StraightFlush, ThreeOfAKind, Flush, Straight, TwoPair, OnePair, HighCard],
      'wildValue': null,
      'wildStatus': 1,
      'wheelStatus': 0,
      'sfQualify': 4,
      'lowestQualified': ['Ac', 'Ad', '3h', '2s'],
      "noKickers": true
    },
    'paigowpokerfull': {
      'cardsInHand': 7,
      'handValues': [FiveOfAKind, FourOfAKindPairPlus, StraightFlush, Flush, Straight, FourOfAKind, TwoThreeOfAKind, ThreeOfAKindTwoPair, FullHouse, ThreeOfAKind, ThreePair, TwoPair, OnePair, HighCard],
      'wildValue': 'O',
      'wildStatus': 0,
      'wheelStatus': 1,
      'sfQualify': 5,
      'lowestQualified': null
    },
    'paigowpokeralt': {
      'cardsInHand': 7,
      'handValues': [FourOfAKind, FullHouse, ThreeOfAKind, ThreePair, TwoPair, OnePair, HighCard],
      'wildValue': 'O',
      'wildStatus': 0,
      'wheelStatus': 1,
      'sfQualify': 5,
      'lowestQualified': null
    },
    'paigowpokersf6': {
      'cardsInHand': 7,
      'handValues': [StraightFlush, Flush, Straight],
      'wildValue': 'O',
      'wildStatus': 0,
      'wheelStatus': 1,
      'sfQualify': 6,
      'lowestQualified': null
    },
    'paigowpokersf7': {
      'cardsInHand': 7,
      'handValues': [StraightFlush, Flush, Straight],
      'wildValue': 'O',
      'wildStatus': 0,
      'wheelStatus': 1,
      'sfQualify': 7,
      'lowestQualified': null
    },
    'paigowpokerhi': {
      'cardsInHand': 5,
      'handValues': [FiveOfAKind, StraightFlush, FourOfAKind, FullHouse, Flush, Straight, ThreeOfAKind, TwoPair, OnePair, HighCard],
      'wildValue': 'O',
      'wildStatus': 0,
      'wheelStatus': 1,
      'sfQualify': 5,
      'lowestQualified': null
    },
    'paigowpokerlo': {
      'cardsInHand': 2,
      'handValues': [OnePair, HighCard],
      'wildValue': 'O',
      'wildStatus': 0,
      'wheelStatus': 1,
      'sfQualify': 5,
      'lowestQualified': null
    }
  };

  /**
   * Base Game class that defines the rules of the game.
   */
  class Game {
    constructor(descr) {
      this.descr = descr;
      this.cardsInHand = 0;
      this.handValues = [];
      this.wildValue = null;
      this.wildStatus = 0;
      this.wheelStatus = 0;
      this.sfQualify = 5;
      this.lowestQualified = null;
      this.noKickers = null;

      // Set values based on the game rules.
      if (!this.descr || !gameRules[this.descr]) {
        this.descr = 'standard';
      }
      this.cardsInHand = gameRules[this.descr]['cardsInHand'];
      this.handValues = gameRules[this.descr]['handValues'];
      this.wildValue = gameRules[this.descr]['wildValue'];
      this.wildStatus = gameRules[this.descr]['wildStatus'];
      this.wheelStatus = gameRules[this.descr]['wheelStatus'];
      this.sfQualify = gameRules[this.descr]['sfQualify'];
      this.lowestQualified = gameRules[this.descr]['lowestQualified'];
      this.noKickers = gameRules[this.descr]['noKickers'];
    }
  }

  function exportToGlobal(global) {
    global.Card = Card;
    global.Hand = Hand;
    global.Game = Game;
    global.RoyalFlush = RoyalFlush;
    global.NaturalRoyalFlush = NaturalRoyalFlush;
    global.WildRoyalFlush = WildRoyalFlush;
    global.FiveOfAKind = FiveOfAKind;
    global.StraightFlush = StraightFlush;
    global.FourOfAKindPairPlus = FourOfAKindPairPlus;
    global.FourOfAKind = FourOfAKind;
    global.FourWilds = FourWilds;
    global.TwoThreeOfAKind = TwoThreeOfAKind;
    global.ThreeOfAKindTwoPair = ThreeOfAKindTwoPair;
    global.FullHouse = FullHouse;
    global.Flush = Flush;
    global.Straight = Straight;
    global.ThreeOfAKind = ThreeOfAKind;
    global.ThreePair = ThreePair;
    global.TwoPair = TwoPair;
    global.OnePair = OnePair;
    global.HighCard = HighCard;
    global.PaiGowPokerHelper = PaiGowPokerHelper;
  }

  // Export the classes for node.js use.
  if (true) {
    exportToGlobal(exports);
  }

  // Add the classes to the window for browser use.
  if (typeof window !== 'undefined') {
    exportToGlobal(window);
  }

})();

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _pokerLogic_holdem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pokerLogic/holdem */ "./src/pokerLogic/holdem.js");

$(function () {
  var actionsCont = $('.table-actions');
  var game = new _pokerLogic_holdem__WEBPACK_IMPORTED_MODULE_0__["default"](actionsCont);
  game.newGame();
}); // $(() => {
//   const rootEl = $('.ttt');
//   const game = new Game();
//   new View(game, rootEl);
// });
// import React from "react";
// import ReactDom from "react-dom";
// import App from "../dist/App"
// const Root = () => {
//   return (
//     // <App />
//   )
// }
// ReactDOM.render(element, document.getElementById('root'));
// ReactDOM.render(<h1>Hello Poker world!</h1>, document.getElementById("root"));
// document.addEventListener("DOMContentLoaded", () => {
//   const game = new HoldEm;
//   game.newGame();
//   console.log("Game Over!");
// })

/***/ }),

/***/ "./src/playerLogic/computerplayer.js":
/*!*******************************************!*\
  !*** ./src/playerLogic/computerplayer.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ComputerPlayer; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ComputerPlayer =
/*#__PURE__*/
function () {
  function ComputerPlayer(position, chipstack) {
    _classCallCheck(this, ComputerPlayer);

    this.position = position;
    this.chipstack = chipstack;
    this.folded = false;
    this.chipsInPot = 0;
    this.hand = [];
    this.comp = true;
    position === 'sb' ? this.side = 'right' : this.side = 'left';
    this.side === 'right' ? this.name = 'Seat 1' : this.name = 'Seat 2';
  }

  _createClass(ComputerPlayer, [{
    key: "text",
    value: function text(input) {
      var textSelect = document.querySelector(".table-actions-text");
      textSelect.innerText = input;
    }
  }, {
    key: "promptText",
    value: function promptText(input) {// let promptSelect = document.querySelector(".table-actions-prompt");
      // promptSelect.innerText = input;
    }
  }, {
    key: "promptAction",
    value: function promptAction(to_call) {// this.text(`${this.name}, your hand is ${this.hand[0].rank} ${this.hand[1]}.suit`)
      // if (to_call === 0) {
      //   this.promptText(`${this.name}, enter 'check', 'fold', or 'bet' will bet the amount in the box to the right`)
      // } else {
      //   this.promptText(`It costs ${to_call} to call. Enter 'call', 'fold', 'raise' will raise the amount in the box to the right`)
      // }
    }
  }, {
    key: "genBetRaise",
    value: function genBetRaise(to_call, stack) {
      var randNum = Math.random();

      if (to_call === 0) {
        var bet = randNum * stack;
        return ['betRaise', bet];
      } else {
        var raise = randNum * stack;
        if (raise < to_call * 2) raise = to_call * 2;
        return ['betRaise', raise];
      }
    }
  }, {
    key: "promptResponse",
    value: function promptResponse(to_call, stack) {
      var randNum = Math.random();

      if (randNum < .3333) {
        if (to_call > 0) {
          return ['fold'];
        } else {
          if (randNum < .16666) {
            return ['check'];
          } else {
            return this.genBetRaise(to_call, stack);
          }
        }
      } else if (randNum < .6666) {
        if (to_call > 0) {
          return ['call'];
        } else {
          return ['check'];
        }
      } else {
        if (to_call === 0) {
          return this.genBetRaise(to_call, stack);
        } else {
          return ['call'];
        }
      }
    }
  }, {
    key: "resolve_action",
    value: function resolve_action(to_call, betInput, textInput) {
      var sb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

      if (textInput === 'check') {
        return 0;
      } else if (textInput === 'fold') {
        this.folded = true;
        return null;
      } else if (textInput === 'call') {
        this.chipstack -= to_call;
        this.chipsInPot += to_call;
        return to_call;
      } else {
        this.chipstack -= betInput + sb;
        this.chipsInPot += betInput + sb;
        return betInput + sb;
      }
    }
  }, {
    key: "playerName",
    value: function playerName() {
      var playerName = document.querySelector(".player-info-name-".concat(this.side));
      playerName.innerText = "".concat(this.name);
    }
  }, {
    key: "playerChips",
    value: function playerChips() {
      var playerChips = document.querySelector(".player-info-chips-".concat(this.side));
      playerChips.innerText = "".concat(this.chipstack, " chips");
    }
  }, {
    key: "playerCards",
    value: function playerCards() {
      if (this.hand[0]) {
        var playerCard1 = document.querySelector(".player-info-cards-".concat(this.side, "-1"));
        var playerCard2 = document.querySelector(".player-info-cards-".concat(this.side, "-2"));
        this.hand[0].render(playerCard1, "51%", "67%");
        this.hand[1].render(playerCard2, "51%", "67%");
      }
    }
  }, {
    key: "render",
    value: function render() {
      this.playerName();
      this.playerChips();
      this.playerCards();
    }
  }, {
    key: "resetVars",
    value: function resetVars() {
      this.folded = false;
      this.chipsInPot = 0;
      this.hand = [];
    }
  }]);

  return ComputerPlayer;
}();



/***/ }),

/***/ "./src/playerLogic/humanplayer.js":
/*!****************************************!*\
  !*** ./src/playerLogic/humanplayer.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return HumanPlayer; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var HumanPlayer =
/*#__PURE__*/
function () {
  function HumanPlayer(position, chipstack) {
    _classCallCheck(this, HumanPlayer);

    this.position = position;
    this.chipstack = chipstack;
    this.folded = false;
    this.chipsInPot = 0;
    this.hand = [];
    this.comp = false;
    position === 'sb' ? this.side = 'right' : this.side = 'left';
    this.side === 'right' ? this.name = 'Seat 1' : this.name = 'Seat 2';
  } // text(input){
  //   let textSelect = document.querySelector(".table-actions-text");
  //   textSelect.innerText = input;
  // }


  _createClass(HumanPlayer, [{
    key: "promptText",
    value: function promptText(input) {
      var promptSelect = document.querySelector(".table-actions-prompt");
      promptSelect.innerText = input;
    }
  }, {
    key: "promptAction",
    value: function promptAction(to_call) {
      // this.text(`${this.name}, your hand is ${this.hand[0].rank}${this.hand[0].suit} ${this.hand[1].rank}${this.hand[1].suit}`)
      if (to_call === 0) {
        this.promptText("".concat(this.name, ", enter 'check', 'fold', or 'bet'"));
      } else {
        this.promptText("It costs $".concat(to_call, " to call"));
      }
    }
  }, {
    key: "resolve_action",
    value: function resolve_action(to_call, betInput, textInput) {
      var sb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

      if (textInput === 'check') {
        return 0;
      } else if (textInput === 'fold') {
        this.folded = true;
        return null;
      } else if (textInput === 'call') {
        this.chipstack -= to_call;
        this.chipsInPot += to_call;
        return to_call;
      } else {
        this.chipstack -= betInput + sb;
        this.chipsInPot += betInput + sb;
        return betInput + sb;
      }
    }
  }, {
    key: "playerName",
    value: function playerName() {
      var playerName = document.querySelector(".player-info-name-".concat(this.side));
      playerName.innerText = "".concat(this.name);
    }
  }, {
    key: "playerChips",
    value: function playerChips() {
      var playerChips = document.querySelector(".player-info-chips-".concat(this.side));
      playerChips.innerText = "".concat(this.chipstack, " chips");
    }
  }, {
    key: "playerCards",
    value: function playerCards() {
      if (this.hand[0]) {
        var playerCard1 = document.querySelector(".player-info-cards-".concat(this.side, "-1"));
        var playerCard2 = document.querySelector(".player-info-cards-".concat(this.side, "-2"));
        this.hand[0].render(playerCard1, "51%", "67%");
        this.hand[1].render(playerCard2, "51%", "67%");
      }
    }
  }, {
    key: "render",
    value: function render() {
      this.playerName();
      this.playerChips();
      this.playerCards();
    }
  }, {
    key: "resetVars",
    value: function resetVars() {
      this.folded = false;
      this.chipsInPot = 0;
      this.hand = [];
    }
  }]);

  return HumanPlayer;
}();



/***/ }),

/***/ "./src/pokerLogic/board.js":
/*!*********************************!*\
  !*** ./src/pokerLogic/board.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Board; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Board = function Board() {// this.suit = suit;

  _classCallCheck(this, Board);
};



/***/ }),

/***/ "./src/pokerLogic/card.js":
/*!********************************!*\
  !*** ./src/pokerLogic/card.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Card; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// DISP_SUITS = ["\u2660", "\u2661", "\u2662", "\u2663"]
var Card =
/*#__PURE__*/
function () {
  function Card(rank, suit, img_pos_x, img_pos_y, revealed) {
    _classCallCheck(this, Card);

    this.suit = suit;
    this.rank = rank;
    this.img_pos_x = img_pos_x;
    this.img_pos_y = img_pos_y;
    this.revealed = revealed;
  }

  _createClass(Card, [{
    key: "display",
    value: function display(element, width, height) {
      element.style.backgroundPosition = "".concat(this.img_pos_x, "px ").concat(this.img_pos_y, "px");
      element.style.width = width; //40%    .1143  .57 * 140 px   80%

      element.style.height = height; //80%  .16

      element.style.backgroundImage = 'url("./image/deck400.png")';
      element.style.borderRadius = "7px";
      element.style.marginLeft = "10px";
    }
  }, {
    key: "hide",
    value: function hide(element, width, height) {
      element.style.backgroundPosition = ' -2px -4px';
      element.style.width = width;
      element.style.height = height;
      element.style.backgroundImage = 'url("./image/cardback_red_acorn2.jpg")';
      element.style.borderRadius = "7px";
      element.style.marginLeft = "10px";
      element.style.backgroundSize = "75px 112px";
    }
  }, {
    key: "render",
    value: function render(element, width, height) {
      this.revealed ? this.display(element, width, height) : this.hide(element, width, height);
    }
  }, {
    key: "unrender",
    value: function unrender(element) {
      element.style.backgroundPositionX = "0px";
      element.style.backgroundPositionY = "0px";
      element.style.width = "0%";
      element.style.height = "0%";
      element.style.borderRadius = "7px";
      element.style.marginLeft = "10px";
    }
  }, {
    key: "show",
    value: function show() {
      return "".concat(this.rank).concat(this.suit);
    }
  }]);

  return Card;
}();



/***/ }),

/***/ "./src/pokerLogic/deck.js":
/*!********************************!*\
  !*** ./src/pokerLogic/deck.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Deck; });
/* harmony import */ var _card__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./card */ "./src/pokerLogic/card.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var Deck =
/*#__PURE__*/
function () {
  function Deck() {
    _classCallCheck(this, Deck);

    this.cards_drawn = 0;
    this.cards = this.newDeck();
  }

  _createClass(Deck, [{
    key: "shuffle",
    value: function shuffle(array) {
      var counter = array.length;

      while (counter > 0) {
        var index = Math.floor(Math.random() * counter);
        counter--;
        var temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
      }

      return array;
    }
  }, {
    key: "newDeck",
    value: function newDeck() {
      var suits = ["s", "h", "d", "c"];
      var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];
      var deck = [];

      for (var i = 0; i < suits.length; i++) {
        for (var j = 0; j < values.length; j++) {
          var pos_x = j * -78 - 6;
          var pos_y = i * -114 - 8;
          deck.push(new _card__WEBPACK_IMPORTED_MODULE_0__["default"](values[j], suits[i], pos_x, pos_y, true));
        }
      }

      return this.shuffle(deck);
    }
  }, {
    key: "draw",
    value: function draw() {
      if (this.cards_drawn > 0 && this.cards_drawn % 52 == 0) {
        this.cards = this.shuffle(this.cards);
      }

      this.cards_drawn += 1;
      return this.cards.pop();
    }
  }, {
    key: "returnCard",
    value: function returnCard(card) {
      this.cards.unshift(card);
    }
  }]);

  return Deck;
}();



/***/ }),

/***/ "./src/pokerLogic/holdem.js":
/*!**********************************!*\
  !*** ./src/pokerLogic/holdem.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./table */ "./src/pokerLogic/table.js");
/* harmony import */ var _playerLogic_humanplayer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../playerLogic/humanplayer */ "./src/playerLogic/humanplayer.js");
/* harmony import */ var _playerLogic_computerplayer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../playerLogic/computerplayer */ "./src/playerLogic/computerplayer.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }





var HoldEm =
/*#__PURE__*/
function () {
  function HoldEm($el) {
    var initialChipstack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5000;

    _classCallCheck(this, HoldEm);

    this.$el = $el;
    this.initialChipstack = initialChipstack;
    this.players = [new _playerLogic_humanplayer__WEBPACK_IMPORTED_MODULE_1__["default"]("sb", initialChipstack), new _playerLogic_computerplayer__WEBPACK_IMPORTED_MODULE_2__["default"]("bb", initialChipstack)]; // this.players = [new ComputerPlayer("sb", initialChipstack), new HumanPlayer("bb", initialChipstack)];
    // this.players = [new HumanPlayer("sb", initialChipstack), new HumanPlayer("bb", initialChipstack)];

    this.dealer_pos = 0;
    this.table = new _table__WEBPACK_IMPORTED_MODULE_0__["default"]($el, this.players);
  }

  _createClass(HoldEm, [{
    key: "playHand",
    value: function playHand() {
      this.table.playHand();
    }
  }, {
    key: "newGame",
    value: function newGame() {
      // while (this.players[0].chipstack > 0 && this.players[1].chipstack > 0) {
      this.table.render();
      this.playHand(); //   this.togglePlayers();
      //   this.resetPlayerVars();
      //   this.table.resetVars();
      // }
      // if (this.players[0].chipstack === 0) {
      //   "Seat 2 has won the match!"
      // } else {
      //   "Seat 1 has won the match!"
      // }
    }
  }]);

  return HoldEm;
}(); // <div class="actions-cont">
//   <div class="actions-cont-text" id="fold">FOLD</div>
//   <div class="actions-cont-text" id="check-call">CHECK/CALL</div>
//   <div class="actions-cont-text" id="bet-raise">BET/RAISE</div>
//   <input class="actions-cont-bet-amt" type="number" value="0">
// </div>


/* harmony default export */ __webpack_exports__["default"] = (HoldEm);

/***/ }),

/***/ "./src/pokerLogic/table.js":
/*!*********************************!*\
  !*** ./src/pokerLogic/table.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _deck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./deck.js */ "./src/pokerLogic/deck.js");
/* harmony import */ var _board_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./board.js */ "./src/pokerLogic/board.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




var Hand = __webpack_require__(/*! pokersolver */ "./node_modules/pokersolver/pokersolver.js").Hand;

var Table =
/*#__PURE__*/
function () {
  function Table($el, players) {
    var sb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 50;
    var bb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;

    _classCallCheck(this, Table);

    this.boardCards = [];
    this.deck = new _deck_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
    this.players = players;
    this.sb = sb;
    this.bb = bb;
    this.pot = 0;
    this.currPlayerPos = 0;
    this.$el = $el;
    this.currBet = this.sb;
    this.streetActions = [];
    this.currStreet = 'preflop';
    this.handNum = 1;
    this.bindEvents = this.bindEvents.bind(this);
  }

  _createClass(Table, [{
    key: "currentPlayer",
    value: function currentPlayer() {
      return this.players[this.currPlayerPos];
    }
  }, {
    key: "otherPlayer",
    value: function otherPlayer() {
      var otherPlayerPos = this.currPlayerPos === 0 ? 1 : 0;
      return this.players[otherPlayerPos];
    }
  }, {
    key: "resetVars",
    value: function resetVars() {
      this.deck = new _deck_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
      this.boardCards = [];
      this.pot = 0;
      this.currPlayerPos = 0;
      this.currBet = this.sb;
      this.streetActions = [];
      this.currStreet = 'preflop';
    }
  }, {
    key: "showDealerBtn",
    value: function showDealerBtn() {
      var dealerButton = $('#table-felt-dealer-btn');
      dealerButton.removeClass();

      if (this.handNum % 2 === 0) {
        this.boardCards.length === 0 ? dealerButton.addClass("table-felt-dealer-btn-left") : dealerButton.addClass("table-felt-dealer-btn-left-board");
      } else {
        this.boardCards.length === 0 ? dealerButton.addClass("table-felt-dealer-btn-right") : dealerButton.addClass("table-felt-dealer-btn-right-board");
      }
    }
  }, {
    key: "resetPlayerVars",
    value: function resetPlayerVars() {
      this.players[0].resetVars();
      this.players[1].resetVars();
    }
  }, {
    key: "playHand",
    value: function playHand() {
      this.dealInPlayers();
      this.takeBlinds();
      this.render();
    }
  }, {
    key: "togglePlayers",
    value: function togglePlayers() {
      this.players.push(this.players.shift());
      this.players[0].position = 'sb';
      this.players[1].position = 'bb';
    }
  }, {
    key: "determineWinner",
    value: function determineWinner() {
      var hand1 = Hand.solve(this.handToStrArr(this.players[0]).concat(this.textBoard()));
      var hand2 = Hand.solve(this.handToStrArr(this.players[1]).concat(this.textBoard()));
      this.outputString = this.boardCards.length > 0 ? "On a board of ".concat(this.textBoard(), ", ") : "Preflop, ";
      var winners = Hand.winners([hand1, hand2]);

      if (!this.players[0].folded && !this.players[1].folded && winners.length === 2) {
        return this.tie(hand1);
      } else if (this.players[1].folded || !this.players[0].folded && winners[0] === hand1) {
        return this.winner(hand1, hand2, 0, 1);
      } else {
        return this.winner(hand2, hand1, 1, 0);
      }
    }
  }, {
    key: "tie",
    value: function tie(hand) {
      alert(this.outputString + "the hand resulted in a tie. Splitting the pot of $".concat(this.pot, " with ").concat(hand.descr, "!"));
      this.players[0].chipstack += Math.floor(this.pot / 2);
      this.players[1].chipstack += Math.floor(this.pot / 2);

      if (!this.pot % 2 === 0) {
        if (Math.random() < .5) {
          this.players[0].chipstack += 1;
        } else {
          this.players[1].chipstack += 1;
        }
      }

      this.gameOver();
    }
  }, {
    key: "winner",
    value: function winner(winHand, loseHand, winPos, losePos) {
      this.outputString += "".concat(this.players[winPos].name, " wins the pot of $").concat(this.pot);
      if (!this.players[losePos].folded) this.outputString += " with hand: ".concat(winHand.descr);
      if (!this.players[losePos].chipstack === 0) this.outputString += "".concat(this.players[losePos].name, " lost with with hand: ").concat(loseHand.descr);
      alert(this.outputString);
      this.players[winPos].chipstack += this.pot;
      this.gameOver();
    }
  }, {
    key: "gameOver",
    value: function gameOver() {
      if (this.players[0].chipstack === 0) {
        this.currentPlayer().promptText("".concat(this.players[1].name, " has won the match!"));
      } else if (this.players[1].chipstack === 0) {
        this.currentPlayer().promptText("".concat(this.players[1].name, " has won the match!"));
      } else {
        this.nextHand();
      }
    }
  }, {
    key: "clearFlop",
    value: function clearFlop() {
      for (var i = 0; i < 3; i++) {
        var card = document.querySelector(".table-felt-board-flop-".concat(i + 1));
        this.boardCards[i].unrender(card);
      }
    }
  }, {
    key: "clearTurnRiver",
    value: function clearTurnRiver(street) {
      var card = document.querySelector(".table-felt-board-".concat(street));
      street === 'turn' ? this.boardCards[3].unrender(card) : this.boardCards[4].unrender(card);
    }
  }, {
    key: "clearBoard",
    value: function clearBoard() {
      if (this.boardCards[0]) this.clearFlop();
      if (this.boardCards[3]) this.clearTurnRiver("turn");
      if (this.boardCards[4]) this.clearTurnRiver("river");
    }
  }, {
    key: "nextHand",
    value: function nextHand() {
      this.togglePlayers();
      this.resetPlayerVars();
      this.clearBoard();
      this.resetVars();
      this.handNum += 1;
      this.playHand();
    }
  }, {
    key: "handToStrArr",
    value: function handToStrArr(player) {
      var playerHand = player.hand.map(function (card) {
        return "".concat(card.rank).concat(card.suit);
      });
      return playerHand;
    }
  }, {
    key: "dealPlayerCard",
    value: function dealPlayerCard(pos, revealed) {
      var card = this.deck.draw();
      card.revealed = revealed;
      this.players[pos].hand.push(card);
    }
  }, {
    key: "dealInPlayers",
    value: function dealInPlayers() {
      this.dealPlayerCard(1, !this.players[1].comp);
      this.dealPlayerCard(0, !this.players[0].comp);
      this.dealPlayerCard(1, !this.players[1].comp);
      this.dealPlayerCard(0, !this.players[0].comp);
    }
  }, {
    key: "takeBlinds",
    value: function takeBlinds() {
      this.players[0].chipstack -= this.sb;
      this.players[0].chipsInPot = this.sb;
      this.players[1].chipstack -= this.bb;
      this.players[1].chipsInPot = this.bb;
      this.pot = this.sb + this.bb;
    }
  }, {
    key: "dealCard",
    value: function dealCard() {
      this.currPlayerPos = 1;
      this.boardCards.push(this.deck.draw());
    }
  }, {
    key: "dealFlop",
    value: function dealFlop() {
      this.currPlayerPos = 1;

      for (var i = 0; i < 3; i++) {
        this.dealCard();
      }
    }
  }, {
    key: "textBoard",
    value: function textBoard() {
      var textBoard = this.boardCards.map(function (card) {
        return "".concat(card.rank).concat(card.suit);
      });
      return textBoard;
    }
  }, {
    key: "showFlop",
    value: function showFlop() {
      var card1 = document.querySelector(".table-felt-board-flop-1");
      this.boardCards[0].render(card1, "17.5%", "52%");
      var card2 = document.querySelector(".table-felt-board-flop-2");
      this.boardCards[1].render(card2, "17.5%", "52%");
      var card3 = document.querySelector(".table-felt-board-flop-3");
      this.boardCards[2].render(card3, "17.5%", "52%");
    }
  }, {
    key: "showTurn",
    value: function showTurn() {
      var card4 = document.querySelector(".table-felt-board-turn");
      this.boardCards[3].render(card4, "17.5%", "52%");
    }
  }, {
    key: "showRiver",
    value: function showRiver() {
      var card5 = document.querySelector(".table-felt-board-river");
      this.boardCards[4].render(card5, "17.5%", "52%");
    }
  }, {
    key: "showBoard",
    value: function showBoard() {
      if (this.boardCards[0]) this.showFlop();
      if (this.boardCards[3]) this.showTurn();
      if (this.boardCards[4]) this.showRiver();
    }
  }, {
    key: "toggleCurrPlayer",
    value: function toggleCurrPlayer() {
      if (this.currPlayerPos === 0) {
        this.currPlayerPos = 1;
      } else {
        this.currPlayerPos = 0;
      }
    }
  }, {
    key: "remainingPlayers",
    value: function remainingPlayers() {
      if (this.players[0].folded === true || this.players[1].folded === true) return false;
      return true;
    }
  }, {
    key: "allIn",
    value: function allIn() {
      if (this.players[0].chipstack === 0 || this.players[1].chipstack === 0) return true;
      return false;
    }
  }, {
    key: "showPot",
    value: function showPot() {
      var currPot = document.querySelector(".table-felt-pot");
      currPot.innerText = "Current pot: $".concat(this.pot);
    }
  }, {
    key: "resolvePlayerPrompt",
    value: function resolvePlayerPrompt(response) {
      if (response[0] === 'fold') {
        this.action(null, 'fold');
      } else if (response[0] === 'call') {
        this.action(null, 'call');
      } else if (response[0] === 'check') {
        this.action(null, 'check');
      } else {
        this.action(null, 'bet', Math.ceil(response[1]));
      }
    }
  }, {
    key: "promptPlayer",
    value: function promptPlayer() {
      var response = this.currentPlayer().promptResponse(this.currBet, this.currentPlayer().chipstack);

      if (response) {
        this.resolvePlayerPrompt(response);
      }
    }
  }, {
    key: "render",
    value: function render() {
      this.showDealerBtn();
      this.showPot();
      this.showBoard();
      this.players[0].render();
      this.players[1].render();
      this.setButtons();
      this.bindEvents();
      if (this.currentPlayer().hand[0]) this.currentPlayer().promptAction(this.currBet, this.currentPlayer.chipstack);
      if (this.currentPlayer().comp && (this.streetActions.length < 2 || this.handChipDiff() !== 0)) this.promptPlayer();
    }
  }, {
    key: "fold",
    value: function fold($outDiv) {
      var $foldDiv = $("<button>");
      $foldDiv.addClass("actions-cont-text");
      $foldDiv.data("action", "fold");
      $foldDiv.html('FOLD');
      $outDiv.append($foldDiv);
    }
  }, {
    key: "callOrCheck",
    value: function callOrCheck($outDiv) {
      var $callDiv = $("<button>");
      $callDiv.addClass("actions-cont-text");

      if (this.currBet === 0) {
        $callDiv.data("action", "check");
        $callDiv.html('CHECK');
      } else {
        $callDiv.data("action", "call");
        $callDiv.html('CALL');
      }

      $outDiv.append($callDiv);
    }
  }, {
    key: "betAmount",
    value: function betAmount($outDiv) {
      var value;

      if (this.currBet > 0) {
        if (this.currBet === this.sb) {
          value = this.bb * 2;
        } else {
          value = this.currBet * 2;
        }
      } else {
        value = this.bb;
      }

      var $betAmtDiv = $("<input/>", {
        type: 'text',
        "class": 'actions-cont-bet-amt',
        value: "".concat(value)
      });
      $outDiv.append($betAmtDiv);
    }
  }, {
    key: "betOrRaise",
    value: function betOrRaise($outDiv) {
      var $betDiv = $("<button>");
      $betDiv.addClass("actions-cont-text");

      if (this.currBet === 0) {
        $betDiv.data("action", "bet");
        $betDiv.html('BET');
      } else {
        $betDiv.data("action", "raise");
        $betDiv.html('RAISE');
      }

      $outDiv.append($betDiv);
    }
  }, {
    key: "setButtons",
    value: function setButtons() {
      var $outDiv = $("<div>");
      $outDiv.addClass("actions-cont");
      this.fold($outDiv);
      this.callOrCheck($outDiv);

      if (!this.allIn() && this.currentPlayer().chipstack > this.currBet) {
        this.betOrRaise($outDiv);
        this.betAmount($outDiv);
      }

      this.$el.empty();
      this.$el.append($outDiv);
    }
  }, {
    key: "renderCurrBet",
    value: function renderCurrBet(amount) {
      if (this.currStreet === 'preflop' && this.streetActions.length === 1) {
        if (amount === 50) {
          this.currBet = 0;
        } else {
          this.currBet = amount - 50;
        }
      } else {
        this.currBet = amount > 0 ? amount : 0;
      }
    }
  }, {
    key: "handChipDiff",
    value: function handChipDiff() {
      return Math.abs(this.players[0].chipsInPot - this.players[1].chipsInPot);
    }
  }, {
    key: "calcBetInput",
    value: function calcBetInput(isSb) {
      var betInput = $('.actions-cont-bet-amt');
      if (betInput.length === 0) return 0;
      var totalBet = Number(betInput[0].value);
      if (totalBet > this.currentPlayer().chipstack) totalBet = this.currentPlayer().chipstack - isSb;
      if (totalBet > this.otherPlayer().chipstack) totalBet = this.otherPlayer().chipstack - isSb;
      return totalBet;
    }
  }, {
    key: "calcCompBetRaise",
    value: function calcCompBetRaise(compBetRaise, isSb) {
      var totalBet;

      if (compBetRaise > this.currentPlayer().chipstack) {
        totalBet = this.currentPlayer().chipstack - isSb;
      } else if (compBetRaise > this.otherPlayer().chipstack) {
        totalBet = this.otherPlayer().chipstack - isSb;
      } else {
        totalBet = compBetRaise;
      }

      return totalBet;
    }
  }, {
    key: "action",
    value: function action($button, compAction, compBetRaise) {
      var playerAction;
      playerAction = $button ? $button.data().action : compAction;

      if (playerAction === 'fold') {
        this.currentPlayer().folded = true;
        return this.determineWinner();
      }

      var isSb = this.currStreet === 'preflop' && this.streetActions.length === 0 ? this.sb : 0;
      var betRaise;

      if (compBetRaise) {
        if (compBetRaise < this.bb) compBetRaise = this.bb;
        betRaise = this.calcCompBetRaise(compBetRaise, isSb);
      } else {
        betRaise = this.calcBetInput(isSb);
      }

      var resolvedAction = this.currentPlayer().resolve_action(this.handChipDiff(), betRaise, playerAction, isSb);

      if (resolvedAction) {
        this.pot += resolvedAction;
      }

      this.streetActions = this.streetActions.concat(resolvedAction);
      this.continueAction();
    }
  }, {
    key: "continueAction",
    value: function continueAction() {
      this.currBet = this.handChipDiff();
      this.toggleCurrPlayer();
      this.render();
      this.nextAction();
    }
  }, {
    key: "nextAction",
    value: function nextAction() {
      var handChipsEqual = this.handChipDiff() === 0;
      var multipleActions = this.streetActions.length > 1;

      if (this.streetActions[this.streetActions - 1] === 'fold') {
        this.determineWinner();
      } else if (handChipsEqual) {
        if (this.allIn()) {
          this.showDown();
          this.determineWinner();
        } else if (this.currStreet === 'river' && multipleActions) {
          this.determineWinner();
        } else if (multipleActions) {
          this.nextStreet();
        }
      }
    }
  }, {
    key: "revealCards",
    value: function revealCards() {
      this.players[0].cards[0].revealed = true;
      this.players[0].cards[1].revealed = true;
      this.players[1].cards[0].revealed = true;
      this.players[1].cards[1].revealed = true;
    }
  }, {
    key: "showDown",
    value: function showDown() {
      this.revealCards();

      while (this.boardCards.length < 5) {
        this.dealCard();
        this.showBoard();
      }
    }
  }, {
    key: "stepStreet",
    value: function stepStreet(flopBool) {
      flopBool ? this.dealFlop() : this.dealCard();
      this.showBoard();
      if (!this.allIn()) this.render();
    }
  }, {
    key: "nextStreet",
    value: function nextStreet() {
      this.streetActions = [];
      this.currBet = 0;

      if (this.currStreet === 'preflop') {
        this.currStreet = 'flop';
        this.stepStreet(true);
      } else if (this.currStreet === 'flop') {
        this.currStreet = 'turn';
        this.stepStreet();
      } else if (this.currStreet === 'turn') {
        this.currStreet = 'river';
        this.stepStreet();
      }
    }
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      var _this = this;

      this.$el.unbind();
      this.$el.on("click", "button", function (event) {
        var $button = $(event.currentTarget);

        _this.action($button);
      });
    }
  }]);

  return Table;
}();

/* harmony default export */ __webpack_exports__["default"] = (Table);

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map