// // * BASE

// const stats1 = { pfAgg: 1, pfCall: 1, pfHigh: 1, pfPair: 1, pfSuit: 1, pfConn: 1, 
//       flopAgg: 1, flopCall: 1, turnAgg: 1, turnCall: 1, riverAgg: 1, riverCall: 1,
//       semiBluff: 1, drawCall: 1, threeAgg: 1, threeCall: 1, overCards: 1,
//       betSize: 1
//     }

// // * CHART READER
// // * 5x all preflop values

// const stats1 = { pfAgg: 5, pfCall: 5, pfHigh: 5, pfPair: 5, pfSuit: 5, pfConn: 5, 
//       flopAgg: 1, flopCall: 1, turnAgg: 1, turnCall: 1, riverAgg: 1, riverCall: 1,
//       semiBluff: 1, drawCall: 1, threeAgg: 1, threeCall: 1, overCards: 1,
//       betSize: 1
//     }

// // * Post Flop All 2

// const stats1 = { pfAgg: 1, pfCall: 1, pfHigh: 1, pfPair: 1, pfSuit: 1, pfConn: 1, 
//       flopAgg: 2, flopCall: 2, turnAgg: 2, turnCall: 2, riverAgg: 2, riverCall: 2,
//       semiBluff: 1, drawCall: 1, threeAgg: 1, threeCall: 1, overCards: 1,
//       betSize: 1
//     }

// // * Post Flop All 5

// const stats1 = { pfAgg: 1, pfCall: 1, pfHigh: 1, pfPair: 1, pfSuit: 1, pfConn: 1, 
//       flopAgg: 5, flopCall: 5, turnAgg: 5, turnCall: 5, riverAgg: 5, riverCall: 5,
//       semiBluff: 1, drawCall: 1, threeAgg: 1, threeCall: 1, overCards: 1,
//       betSize: 1
//     }

// // * Post Flop All Inf

// const stats1 = { pfAgg: 1, pfCall: 1, pfHigh: 1, pfPair: 1, pfSuit: 1, pfConn: 1, 
//       flopAgg: Infinity, flopCall: Infinity, turnAgg: Infinity, turnCall: Infinity, riverAgg: Infinity, riverCall: Infinity,
//       semiBluff: 1, drawCall: 1, threeAgg: 1, threeCall: 1, overCards: 1,
//       betSize: 1
//     }

// // * Potential Peter

// const stats1 = { pfAgg: 1, pfCall: 1, pfHigh: 1, pfPair: 1, pfSuit: 1, pfConn: 1, 
//       flopAgg: 1, flopCall: 1, turnAgg: 1, turnCall: 1, riverAgg: 1, riverCall: 1,
//       semiBluff: 1, drawCall: 1, threeAgg: 1, threeCall: 1, overCards: 1,
//       betSize: 1
//     }

// // * Double Dutch

// const stats1 = { pfAgg: 2, pfCall: 2, pfHigh: 2, pfPair: 2, pfSuit: 2, pfConn: 2, 
//       flopAgg: 2, flopCall: 2, turnAgg: 2, turnCall: 2, riverAgg: 2, riverCall: 2,
//       semiBluff: 2, drawCall: 2, threeAgg: 2, threeCall: 2, overCards: 2,
//       betSize: 2
//     }

// // * Inf Dutch

// const stats1 = { pfAgg: Infinity, pfCall: Infinity, pfHigh: Infinity, pfPair: Infinity, pfSuit: Infinity, pfConn: Infinity, 
//       flopAgg: Infinity, flopCall: Infinity, turnAgg: Infinity, turnCall: Infinity, riverAgg: Infinity, riverCall: Infinity,
//       semiBluff: Infinity, drawCall: Infinity, threeAgg: Infinity, threeCall: Infinity, overCards: Infinity,
//       betSize: Infinity
//     }

// // * Big Bet Berky

// const stats1 = { pfAgg: 1, pfCall: 1, pfHigh: 1, pfPair: 1, pfSuit: 1, pfConn: 1, 
//       flopAgg: 1, flopCall: 1, turnAgg: 1, turnCall: 1, riverAgg: 1, riverCall: 1,
//       semiBluff: 1, drawCall: 1, threeAgg: 1, threeCall: 1, overCards: 1,
//       betSize: 3
//     }


export default {
  base: {
    pfAgg: 1, pfCall: 1, pfHigh: 1, pfPair: 1, pfSuit: 1, pfConn: 1,
    flopAgg: 1, flopCall: 1, turnAgg: 1, turnCall: 1, riverAgg: 1, riverCall: 1,
    semiBluff: 1, drawCall: 1, threeAgg: 1, threeCall: 1, overCards: 1,
    betSize: 1
  },
  chart:  {
    pfAgg: 5, pfCall: 5, pfHigh: 5, pfPair: 5, pfSuit: 5, pfConn: 5,
    flopAgg: 1, flopCall: 1, turnAgg: 1, turnCall: 1, riverAgg: 1, riverCall: 1,
    semiBluff: 1, drawCall: 1, threeAgg: 1, threeCall: 1, overCards: 1,
    betSize: 1
  }
}

// // * Post Flop All 2

// const stats1 = {
//   pfAgg: 1, pfCall: 1, pfHigh: 1, pfPair: 1, pfSuit: 1, pfConn: 1,
//   flopAgg: 2, flopCall: 2, turnAgg: 2, turnCall: 2, riverAgg: 2, riverCall: 2,
//   semiBluff: 1, drawCall: 1, threeAgg: 1, threeCall: 1, overCards: 1,
//   betSize: 1
// }

// // * Post Flop All 5

// const stats1 = {
//   pfAgg: 1, pfCall: 1, pfHigh: 1, pfPair: 1, pfSuit: 1, pfConn: 1,
//   flopAgg: 5, flopCall: 5, turnAgg: 5, turnCall: 5, riverAgg: 5, riverCall: 5,
//   semiBluff: 1, drawCall: 1, threeAgg: 1, threeCall: 1, overCards: 1,
//   betSize: 1
// }

// // * Post Flop All Inf

// const stats1 = {
//   pfAgg: 1, pfCall: 1, pfHigh: 1, pfPair: 1, pfSuit: 1, pfConn: 1,
//   flopAgg: Infinity, flopCall: Infinity, turnAgg: Infinity, turnCall: Infinity, riverAgg: Infinity, riverCall: Infinity,
//   semiBluff: 1, drawCall: 1, threeAgg: 1, threeCall: 1, overCards: 1,
//   betSize: 1
// }

// // * Potential Peter

// const stats1 = {
//   pfAgg: 1, pfCall: 1, pfHigh: 1, pfPair: 1, pfSuit: 1, pfConn: 1,
//   flopAgg: 1, flopCall: 1, turnAgg: 1, turnCall: 1, riverAgg: 1, riverCall: 1,
//   semiBluff: 1, drawCall: 1, threeAgg: 1, threeCall: 1, overCards: 1,
//   betSize: 1
// }

// // * Double Dutch

// const stats1 = {
//   pfAgg: 2, pfCall: 2, pfHigh: 2, pfPair: 2, pfSuit: 2, pfConn: 2,
//   flopAgg: 2, flopCall: 2, turnAgg: 2, turnCall: 2, riverAgg: 2, riverCall: 2,
//   semiBluff: 2, drawCall: 2, threeAgg: 2, threeCall: 2, overCards: 2,
//   betSize: 2
// }

// // * Inf Dutch

// const stats1 = {
//   pfAgg: Infinity, pfCall: Infinity, pfHigh: Infinity, pfPair: Infinity, pfSuit: Infinity, pfConn: Infinity,
//   flopAgg: Infinity, flopCall: Infinity, turnAgg: Infinity, turnCall: Infinity, riverAgg: Infinity, riverCall: Infinity,
//   semiBluff: Infinity, drawCall: Infinity, threeAgg: Infinity, threeCall: Infinity, overCards: Infinity,
//   betSize: Infinity
// }

// // * Big Bet Berky

// const stats1 = {
//   pfAgg: 1, pfCall: 1, pfHigh: 1, pfPair: 1, pfSuit: 1, pfConn: 1,
//   flopAgg: 1, flopCall: 1, turnAgg: 1, turnCall: 1, riverAgg: 1, riverCall: 1,
//   semiBluff: 1, drawCall: 1, threeAgg: 1, threeCall: 1, overCards: 1,
//   betSize: 3
// }