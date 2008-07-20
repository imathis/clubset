Game = Class.create({
  initialize: function() {
    this.deck = new Deck();
    this.table = new TableModel();
    this.tableView = new TableView(this.table);
    
    this.table.observe('selectionChanged', this.selectionChanged.bind(this));
    
    this.foundSets = [];
  },
  
  start: function() {
    this.table.placeCards(this.deck.deal());
    this.tableView.runOpeningFx();
  },
  
  selectionChanged: function(event) {
    var selectedCards = event.memo;
    if (selectedCards.length == 3 && this._checkSet(selectedCards)) {
      this.foundSets.push(selectedCards);
      var replacementCards = this.deck.deal(3);
      selectedCards.each(function(card, index) {
        var cardSlot = this.table.cards.indexOf(card);
        this.table.cards[cardSlot] = replacementCards[index];
      }.bind(this));
      this.table.placeCards(this.table.cards);
    }
  },
  
  _checkSet: function(cards) {
    return true;
  }
});

TableModel = Class.create({
  initialize: function() {
    this._observers = new Element('div');
    this.selectedCards = $A();
  },
  
  observe: function(eventName, callback) {
    this._observers.observe('tableModel:' + eventName, callback);
  },
  
  toggleCard: function(card) {
    if (this.selectedCards.include(card))
      this.selectedCards = this.selectedCards.without(card);
    else
      this.selectedCards.push(card);
      
    this._observers.fire('tableModel:selectionChanged', this.selectedCards);
  },
  
  placeCards: function(cards) {
    var memo = {past:this.cards, present:cards};
    this.cards = cards;
    this.selectedCards.clear();
    this._observers.fire('tableModel:cardsChanged', memo);
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

TableView = Class.create({
  initialize: function(tableModel) {
    this.tableModel = tableModel;
    this.tableModel.observe('cardsChanged', this._update.bind(this));
    this._build();
  },
  
  onclick: function(event) {
    var cardElement = event.target.hasClassName('card') ? event.target : event.target.up('.card');
    if (cardElement) {
      this.tableModel.toggleCard(this.tableModel.cards[cardElement.cardSlot-1]);
      cardElement.toggleClassName('selected');
    }
  },
  
  runOpeningFx: function() {
    (function() {this.table.className = 'after-deal'}).bind(this).delay(1.5);
  },
  
  _build: function() {
    this.table = new Element('div', {'id':'table', 'class':'before-deal'});
    for (var cardSlot = 1; cardSlot <= 12; cardSlot++) {
      var card = new Element('div', {'id':'card'+cardSlot, 'class':'card'});
      card.cardSlot = cardSlot;
      this.table.insert(card);
    }
    document.body.insert(this.table);
    this.table.observe('click', this.onclick.bind(this));
  },
  
  _update: function() {
    for (var cardSlot = 0; cardSlot < this.tableModel.cards.length; cardSlot++)
      this._applyFace(this.tableModel.cards[cardSlot], cardSlot+1);
  },
  
  _applyFace: function(card, cardSlot) {
    var face = new Element('div', {'class':'face'});
    card.count.times(function() {
      face.insert(new Element('div', {'class':'mark '+card.image}));
    });
    $('card'+cardSlot).update(face);
  }
});

Array.prototype.shuffle = function(){
  for(var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
};