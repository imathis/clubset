Game = Class.create({
  initialize: function() {
    this.table = new TableModel();
  },
  
  start: function() {
    this.table = new TableModel();
    this.tableView = new TableView(this.table);
  }
});

TableModel = Class.create({
  initialize: function() {
    this._observers = new Element('div');
    this.selectedCards = $A();
    
    this.deck = new Deck();
    this.placeCards(this.deck.deal());
  },
  
  observe: function(eventName, callback) {
    this._observers.observe('tableModel:' + eventName, callback);
  },
  
  toggleCard: function(card) {
    if (this.selectedCards.include(card)) {
      this.selectedCards = this.selectedCards.without(card);
      return false;
    }
    this.selectedCards.push(card);
    return true;
  },
  
  placeCards: function(cards) {
    this.cards = cards;
    this._observers.fire('tableModel:cardsChanged', this.cards);
  }
});

Deck = Class.create({
  initialize: function() {
    var shapes = ['club', 'diamond', 'heart'],
        colors = ['green', 'blue', 'red'],
        fills  = ['full', 'stripe', 'empty'];
        
    this.cards = new Array();
    shapes.forEach(function(shape) {
      colors.forEach(function(color) {
        fills.forEach(function(fill) {
          this.cards.push(new Card(shape, color, fill, 1));
          this.cards.push(new Card(shape, color, fill, 2));
          this.cards.push(new Card(shape, color, fill, 3));
        }, this)
      }, this)
    }, this);
    this.shuffle();
  },
  
  shuffle: function() {
    this.cards.shuffle();
  },
  
  deal: function (){
    return this.cards.splice(0,12);
  }
});

Card = Class.create({
  initialize: function(shape, color, fill, count) {
    this.shape = shape, this.color = color, this.fill = fill, this.count = count;
    this.image = this.shape + ' ' + this.color + '-' + this.fill;
  }
});

Fx = Class.create({
  initialize:function(table){
    this.table = table;
  },
  runOpeningFx: function() {
    this.table.className = 'after-deal';
  }
});

TableView = Class.create({
  initialize: function(tableModel) {
    this.tableModel = tableModel;
    this.tableModel.observe('cardsChanged', this._update.bind(this));
    
    this._build();
    this._update();
    this.fx = new Fx(this.table);
    setTimeout(this.fx.runOpeningFx.bind(this.fx), 1500);
  },
  
  onclick: function(event) {
    var cardElement = event.target.hasClassName('card') ? event.target : event.target.up('.card');
    if (cardElement) {
      var selected = this.tableModel.toggleCard(this.tableModel.cards[cardElement.cardIndex-1]);
      if (selected)
        cardElement.addClassName('selected');
      else
        cardElement.removeClassName('selected');
    }
  },
  
  _build: function() {
    this.table = new Element('div', {'id':'table', 'class':'before-deal'});
    for (var cardIndex = 1; cardIndex <= 12; cardIndex++) {
      var card = new Element('div', {'id':'card'+cardIndex, 'class':'card'});
      card.cardIndex = cardIndex;
      this.table.insert(card);
    }
    document.body.insert(this.table);
    this.table.observe('click', this.onclick.bind(this));
  },
  
  _update: function() {
    for (var cardIndex = 0; cardIndex < this.tableModel.cards.length; cardIndex++)
      this._applyFace(this.tableModel.cards[cardIndex], cardIndex+1);
  },
  
  _applyFace: function(card, cardIndex) {
    var face = new Element('div', {'class':'face'});
    card.count.times(function() {
      face.insert(new Element('div', {'class':'mark '+card.image}));
    });
    $('card'+cardIndex).update(face);
  }
});

Array.prototype.shuffle = function(){
  for(var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
};