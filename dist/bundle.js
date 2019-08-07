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

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _pokerLogic_holdem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pokerLogic/holdem */ "./src/pokerLogic/holdem.js");

console.log("Hello World from your main file!");

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
    this.chipstack = chipstack || 1500;
    this.folded = false;
    this.chipsInPot = 0;
    this.hand = [];
    position === 'sb' ? this.name = 'Seat 1' : this.name = 'Seat 2';
  }

  _createClass(HumanPlayer, [{
    key: "action",
    value: function action(to_call) {
      var sb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      console.log("".concat(this.name, ", you have ").concat(this.chipstack, " chips, your hand is ").concat(this.hand[0], " ").concat(this.hand[1]));
      var input;

      if (to_call === 0) {
        input = prompt("Enter 'check', 'fold', or 'bet' followed by an amount i.e. 'bet 100'");
      } else {
        input = prompt("It costs ".concat(to_call, " to call. Enter 'call', 'fold', 'raise' followed by an amount i.e. 'raise 300'"));
      }

      console.log(input);
      return this.resolve_action(to_call, input, sb);
    }
  }, {
    key: "resolve_action",
    value: function resolve_action(to_call, input, sb) {
      input = input.toLowerCase();

      if (!input === "ch" && !input === "ca" && input === !"bet" && !input === "ra") {
        throw "Invalid input provided";
      }

      if (input.startsWith('ch')) return [0, 'check'];
      var wager = Number(input.split(" ")[1]);

      if (input.startsWith("ca")) {
        this.chipstack = this.chipstack - to_call;
        this.chipsInPot = this.chipsInPot + to_call;
        return [to_call, 'call'];
      } else if (input.startsWith("bet")) {
        this.chipstack = this.chipstack - wager;
        this.chipsInPot = wager - sb;
        return [wager, 'bet'];
      }

      if (input.startsWith("ra")) {
        this.chipstack = this.chipstack - wager + sb;
        this.chipsInPot = this.chipsInPot - sb;
        return [wager - to_call, 'raise'];
      }

      if (input.startsWith('fo')) {
        this.folded = true;
        return null;
      }
    }
  }]);

  return HumanPlayer;
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
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// DISP_SUITS = ["\u2660", "\u2661", "\u2662", "\u2663"]
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
      var values = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
      var deck = [];

      for (var i = 0; i < suits.length; i++) {
        for (var j = 0; j < values.length; j++) {
          deck.push(values[j] + suits[i]);
        }
      } // const response = prompt("enter action brah");
      // console.log(response);


      return this.shuffle(deck);
    }
  }, {
    key: "draw",
    value: function draw() {
      if (this.cards_drawn % 52 == 0) {
        this.cards = this.shuffle(this.cards);
      }

      this.cards_drawn = this.cards_drawn + 1;
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
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./table */ "./src/pokerLogic/table.js");
/* harmony import */ var _playerLogic_humanplayer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../playerLogic/humanplayer */ "./src/playerLogic/humanplayer.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




var HoldEm =
/*#__PURE__*/
function () {
  function HoldEm(initialChips) {
    _classCallCheck(this, HoldEm);

    this.initialChips = initialChips;
    this.players = [new _playerLogic_humanplayer__WEBPACK_IMPORTED_MODULE_1__["default"]("sb", initialChips), new _playerLogic_humanplayer__WEBPACK_IMPORTED_MODULE_1__["default"]("bb", initialChips)];
    this.dealer_pos = 0;
    this.table = new _table__WEBPACK_IMPORTED_MODULE_0__["default"](this.players);
  }

  _createClass(HoldEm, [{
    key: "playHand",
    value: function playHand() {
      this.table.playHand();
    }
  }, {
    key: "togglePlayers",
    value: function togglePlayers() {
      this.players.push(this.players.shift());

      if (this.players[0].position === 1) {
        this.players[0].position = 2;
        this.players[1].position = 1;
      } else {
        this.players[0].position = 1;
        this.players[1].position = 2;
      }
    }
  }, {
    key: "resetPlayerVars",
    value: function resetPlayerVars() {
      this.players[0].folded = false;
      this.players[0].chipsInPot = 0;
      this.players[0].hand = [];
      this.players[1].folded = false;
      this.players[1].chipsInPot = 0;
      this.players[1].hand = [];
    }
  }]);

  return HoldEm;
}();

var game = new HoldEm();

while (game.players[0].chipstack > 0 && game.players[1].chipstack > 0) {
  game.playHand();
  game.togglePlayers();
  game.resetPlayerVars();
}

if (game.players[0].chipstack === 0) {
  "Seat 2 has won the match!";
} else {
  "Seat 1 has won the match!";
}

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
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var Table =
/*#__PURE__*/
function () {
  function Table(players) {
    var sb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
    var bb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;

    _classCallCheck(this, Table);

    this.boardCards = [];
    this.deck = new _deck_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
    this.players = players;
    this.sb = sb;
    this.bb = bb;
    this.pot = 0;
    this.currPlayerPos = 0;
  }

  _createClass(Table, [{
    key: "playHand",
    value: function playHand() {
      this.dealInPlayers();
      this.takeBlinds();
      this.bettingRound(this.sb);

      if (this.remainingPlayers()) {
        console.log("*******-FLOP-*******");
        this.dealFlop();
        this.showBoard();
        this.bettingRound();
      }

      if (this.remainingPlayers()) {
        console.log("*******-TURN-*******");
        this.dealTurn();
        this.showBoard();
        this.bettingRound();
      }

      if (this.remainingPlayers()) {
        console.log("*******-RIVER-*******");
        this.dealRiver();
        this.showBoard();
        this.bettingRound();
      }

      this.determineWinner();
    }
  }, {
    key: "determineWinner",
    value: function determineWinner() {// if (this.players[1].folded || ) {
      //   console.log(`Player in seat 1 wins the pot of ${this.pot}`)
      //   this.players[0].chipstack += this.pot;
      //   return [1];
      // } else if (this.players[0].folded || ) {
      //   console.log(`Player in seat 1 wins the pot of ${this.pot}`)
      //   this.players[1].chipstack += this.pot;
      //   return [0];
      // } else {
      //   console.log(`This hand resulted in a tie. Splitting the pot of ${this.pot}!`)
      //   this.players[0].chipstack = this.players[0].chipstack + Math.floor(this.pot / 2);
      //   this.players[1].chipstack = this.players[1].chipstack + Math.floor(this.pot / 2);
      //   if (!this.pot % 2 === 0) {
      //     if (Math.random() < .5) {
      //       this.players[0].chipstack = this.players[0].chipstack + 1;
      //     } else {
      //       this.players[1].chipstack = this.players[1].chipstack + 1;
      //     } 
      //     return [2];
      //   }
      // }
    }
  }, {
    key: "handToStr",
    value: function handToStr(player) {
      var playerHand = player.hand.join(" ");
      return playerHand;
    }
  }, {
    key: "dealInPlayers",
    value: function dealInPlayers() {
      this.players[1].hand.push(this.deck.draw());
      this.players[0].hand.push(this.deck.draw());
      this.players[1].hand.push(this.deck.draw());
      this.players[0].hand.push(this.deck.draw());
    }
  }, {
    key: "takeBlinds",
    value: function takeBlinds() {
      this.players[0].chipstack = this.players[0].chipstack - this.sb;
      this.players[0].chipsInPot = this.players[0].chipsInPot + this.sb;
      this.players[1].chipstack = this.players[0].chipstack - this.sb;
      this.players[1].chipsInPot = this.players[1].chipsInPot + this.sb;
      this.pot = this.sb + this.bb;
    }
  }, {
    key: "dealCard",
    value: function dealCard() {
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
    key: "dealTurn",
    value: function dealTurn() {
      this.currPlayerPos = 1;
      this.dealCard();
    }
  }, {
    key: "dealRiver",
    value: function dealRiver() {
      this.currPlayerPos = 1;
      this.dealCard();
    }
  }, {
    key: "showBoard",
    value: function showBoard() {
      console.log("The board is: ");
      this.boardCards.forEach(function (card) {
        console.log(card);
      });
    }
  }, {
    key: "bettingRound",
    value: function bettingRound() {
      var ifSB = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      // console.log("clear");
      this.showPot();
      var firstBet = this.pAction(ifSB, ifSB);

      if (firstBet === null) {
        return this.pot;
      }

      this.pot = this.pot + firstBet[0];
      this.toggleCurrPlayer(); // console.log("clear");

      this.showPot();
      var prevBet = this.pAction(firstBet[0] - ifSB);

      if (prevBet === null) {
        return this.pot;
      }

      debugger;
      this.pot = this.pot + prevBet[0];

      if (prevBet[1] === 'raise' && ifSB > 0) {
        this.pot = this.pot + firstBet[0];
      }

      this.resolveAddBets(prevBet);
      return this.pot;
    }
  }, {
    key: "resolveAddBets",
    value: function resolveAddBets(prevBet) {
      if (prevBet[1].startsWith('ra')) {
        this.pot = this.pot + prevBet[0];
      }

      while (!this.players[0].chipsInPot === this.players[0].chipsInPot) {
        // console.log('clear');
        this.showPot();
        this.toggleCurrPlayer();
        var bet = this.pAction(prevBet[0]);

        if (bet[1].startsWith('ra')) {
          this.pot = this.pot + prevBet[0];
        }

        if (bet) {
          this.pot = this.pot + bet[0];
        }
      }
    }
  }, {
    key: "showPot",
    value: function showPot() {
      console.log(this.pot);
    }
  }, {
    key: "pAction",
    value: function pAction() {
      var bet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var sb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var toCall = this.players[this.currPlayerPos].action(bet, this.bb);
      if (!toCall) this.players[this.currPlayerPos].folded = true;
      return toCall;
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
      if (this.players[0].chipstack === 0 || this.players[1].chipstack === 0) return false;
      if (this.players[0].folded === true || this.players[1].folded === true) return false;
      return true;
    }
  }]);

  return Table;
}();

/* harmony default export */ __webpack_exports__["default"] = (Table);

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map