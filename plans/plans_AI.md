//Computer Player

//Postflop

first define things like if the board is a certain hand based on the rank of the board cards
  also check if board is 3 to a suit, 3 to a straight etc.
**Handled in texture object, straight tbd

second step is to check for best hands on down for return value
  straight flush plus returns Infinity

Ideas:
slowplay a certain % 
  flop only?
never fold option but no bets/raises
  Get teir function returns an array of 2 elements
    first is the number used for calculations
    second is one of: foldChk, callChk, betRaise
  **implemented in postflop
straight draw
  iterate through cards and see if adding one would make the hand into a straight
    if 2 cards would do the trick, then we know we have a double belly buster
      Also need to determine if we have the sucker end draw vs. nut etc.
        could we do this by seeing where the cards we are playing fall within the cards?
          playing 1 card at bottom, 2 cards at bottom, vs 1 at top, 2 at top
Straight possible / 3+ to a flush
PromptResonse
  Adjust to .5 (not fold) and .8 (bet/raise)
If straights (or higher hands possible) bet bigger with hands above (flush, house etc.)

Pair
  if board makes a pair and we dont beat board...

No Pair
  Don't call (maybe bet) when no pair can't beat board except maybe ace/king highs sometimes

General Danger factors to board to know how strong hands need to be
  Thought: Dry: No pairs, 3 straights, 3 flushes, trips, 2 pairs
    Can use rank of the board cards help classify
  If have pair, fear all of the factors
  if have 2 pair, fear less but similar to pair but pair on board obv. treated differently
  if have trips, dont fear a pair on the board
  If have straight, pair on board diminishes value but less so, fear 3+ flush cards
  Flush - dont fear flush cards
  Full House, don't fear flush cards, pair, trips the same way
  Quads, straight flushes don't have fears (simpler implementation)

  
Straight Draws
  Have an array of ranks of the cards
  Map the cards to the gaps to the next card
    Rejecting elements based on number of cards
      Board: if gaps length is 5 then remove highest gap
      Wrong? Player (Turn or pre): If count hand + board > 5, reject 2 biggests gaps
    Take the sum of the gaps, if 4 then 4 straight
      *Gap will be 0 for pairs, hence ignore
        *Diminish value if 1 gap straight draw includes an ace
      *Last element/gap will always equal 1
      *Ace can't start a new chain check unless it has an index of 0
      *Ace for low

Idea bubble: Key in on different values for gaps
  On flop, having a 2 or 3 has some backdoor straight value
    Simple version, just give this an adjusted bonus, discounted if an ace is needed
    Having a 1 is some strength
    having a 1 + 2 is a 3 straight with a gap
    having a 1 + 1 + 1 is a 3 straight
    having a 3 1's and a 2 is a 4 straight w/ a gap
      on the turn this is minimum for a straight draw
    having four 1s is a 4 straight
    Issue: double belly busters
      6 cards with a total of 2 2's
      AQ on J 10 8 -> K or 9    [1],2,1,1,2
        Top card can only tolerate one 2 before it is rejected > need to see 3 elements with 1 or 0 2+'s
          Not MVP: having a 3 would be a backdoor
          MVP: Having a 2 is a gutter
            Need to consider that the card can come above the highest/lowest ranked cards
              Unless ace this is ok that there will be a 1
              Unless K or a 2 could have 2 gappers at poles to consider
              Possible straights
                3 straight w/ a gap
3 straight extra equity




  
Flop
  Check If board is a pair or trips
  Check If board is 3 to flush
  If hand val is pair or trips, check if 1st, 2nd or 3rd
  

Kicker function
  calc nut kicker
  doesnt bluff if it's kicker is the board and it doesnt have a quad card in hand 
  if card in hand better than best card not included in pair/trips

Full house, doesnt bluff is full house on board, if board is a house and hand beats board, return infinity


Weaknesses:
Always call on fullhouse if not beating board
Computerplayer promptresponse static values
if auto is call and its put all in it folds
Straight value by num outs
  Will try to weigh nut v. sucker end



Comp v. Comp
  1 comp is right but thinks its left
  render and non render

//Add object to computer when created so stats can be changed more dynamically

//add value for overcards

Methods:

// loLoHigh(){};
  Unpaired, contains one card jack or higher and 2 cards 6 or lower
    some value offset by presence of straight draws

//need to add checks for 4 flushes to below flush hands (higher than pair)

//Barreling off too often

TO DO:
Straight draws: Determine where the card(s) enabling the draw falls within the cards

Slowplay x%? Currently trying to protect value range by including enough bluffs

//Barreling off too often

//Cap the amount that pot odds can favor a situation
  //or maybe tilt it towards calling when benefitting from big pot odds

//check for length of board actions or previous raises etc. beyond the .85 threshhold in comp player

//Adjust for position?

//Rotating AI 