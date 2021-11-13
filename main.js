"use strict";

console.log("===JavaScriptで学ぶオブジェクト指向===");

// -----------------------------------

class JankenHand {
  constructor(char) {
    this.char = char;
  }

  toString() {
    return this.char;
  }

  static fromInt(index) {
    switch(index) {
      case 0:
        return JankenHandEnum.Rock;
        break;
      case 1:
        return JankenHandEnum.Scissors;
        break;
      case 2:
        return JankenHandEnum.Paper;
        break;
      default:
        throw new Error("indexが不正です。" + index);
    }
  }

  winTo(hisHand) {
    switch(this) {
      case JankenHandEnum.Rock:
        return hisHand === JankenHandEnum.Scissors;
        break;
      case JankenHandEnum.Scissors:
        return hisHand === JankenHandEnum.Paper;
        break;
      case JankenHandEnum.Paper:
        return hisHand === JankenHandEnum.Rock;
        break;
      default:
        throw new Error("hisHandが不正です。" + hisHand);
    }
  }

  loseTo(hisHand) {
    return this !== hisHand && !this.winTo(hisHand);
  }
}

const JankenHandEnum = {};
JankenHandEnum.Rock     = new JankenHand("✊");
JankenHandEnum.Scissors = new JankenHand("✌");
JankenHandEnum.Paper    = new JankenHand("✋");

console.log("じゃんけん", JankenHandEnum.Rock, JankenHandEnum.Scissors, JankenHandEnum.Paper);

// -----------------------------------

class JankenStrategy {
  nextHand() {
    // なにもしない
  }

  prevHands() {
    // なにもしない
  }
}

class RandomStrategy extends JankenStrategy {
  nextHand() {
    // じゃんけんは3パターンなので、[0−2]の範囲でランダムな値を返すようにする
    const index = Math.round(Math.random() * 2);
    return JankenHand.fromInt(index);
  }
}

class FixedHandStrategy extends JankenStrategy {
  constructor(hand) {
    super();
    this.hand = hand;
  }

  nextHand() {
    // いつも決まった手を返すようにする
    return this.hand;
  }
}

class ChottoKashikoiStrategy extends JankenStrategy {
  prevHands(myHand, hisHand) {
    this.myHand = myHand;
    this.hisHand = hisHand;
  }

  nextHand() {
    // 初回は前回の手がないためランダムとする
    if(!this.myHand || !this.hisHand) {
      return new RandomStrategy().nextHand();
    }

    if(this.myHand.winTo(this.hisHand)) {
      // 自分が勝った場合は、同じ手を使う
      return this.myHand;
    } else if(this.myHand.loseTo(this.hisHand)) {
      // あいてが勝った場合は、あいての手を使う
      return this.hisHand;
    } else {
      return new RandomStrategy().nextHand();
    }
  }
}

// -----------------------------------

class Player {
  constructor(name, strategy = new RandomStrategy()) {
    this.name = name;
    this.strategy = strategy;
  }

  getName() {
    return this.name;
  }

  nextHand() {
    return this.strategy.nextHand();
  }

  prevHands(myHand, hisHand) {
    this.strategy.prevHands(myHand, hisHand);
  }
}

// -----------------------------------

const player1 = new Player("Taro");
const player2 = new Player("Hanako", new ChottoKashikoiStrategy());

let player1Win = 0;
let player2Win = 0;

// 10回じゃんけんをする
for(let i = 0; i < 10; i++) {
  const hand1 = player1.nextHand();
  const hand2 = player2.nextHand();

  const result = hand1.winTo(hand2) ? "勝ち" :　hand1.loseTo(hand2) ? "負け" : "あいこ";

  if(hand1.winTo(hand2)) {
    player1Win++;
  }

  if(hand1.loseTo(hand2)) {
    player2Win++;
  }

  // 前の手を覚えておく
  player1.prevHands(hand1, hand2);
  player2.prevHands(hand2, hand1);

  // ここで結果を出力する
  console.log(player1.getName(), hand1, " - ", hand2, player2.getName(), result);
}

const finalResult = player1Win > player2Win ? `${player1.getName()}の勝ち` :
                    player1Win < player2Win ? `${player2.getName()}の勝ち` : "引き分け";

// ここで最終結果を出力する
console.log(player1Win, " - ", player2Win, finalResult);
