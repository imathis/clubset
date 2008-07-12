SetGame = Class.create();
Object.extend(SetGame.prototype, {
  initialize: function() {
    this.deck = new SetDeck();
  }
});

SetDeck = Class.create();
Object.extend(SetDeck.prototype, {
  initialize: function() {}
});