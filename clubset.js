Game = Class.create();
Object.extend(Game.prototype, {
  initialize: function() {
    this.tableModel = new TableModel();
  }
});

TableModel = Class.create();
Object.extend(TableModel.prototype, {
  initialize: function() {
    this._observers = new Object();
    this.selectedCards = new Array();
    
    this.deck = new Deck();
    this._setCards(this.deck.deal());
  },
  
  observe: function(eventName, callback) {
    if (!this._observers[eventName]) this._observers[eventName] = [];
    this._observers[eventName].push(callback);
  },
  
  selectCard: function(card) {
    this.selectedCards.push(card);
  },
  
  _setCards: function(cards) {
    this.cards = cards;
    for (var i=0; i<(this._observers.cardsChanged || []).length; i++)
      this._observers.cardsChanged[i](this.cards);
  }
});

TableView = Class.create();
Object.extend(TableView.prototype, {
  initialize: function(tableModel) {
    this.tableModel = tableModel;
    this.tableModel.observe('cardsChanged', this._update.bind(this));
    
    this._build();
    this._update();
    this.fx = new Fx(this.table);
    setTimeout(this.fx.runOpeningFx.bind(this.fx), 1500);
  },
  
  onclick: function(event) {
    var cardElement = event.target;
    while (cardElement.parentNode && cardElement.className != 'card')
      cardElement = cardElement.parentNode;
    if (cardElement && cardElement.cardIndex)
      this.tableModel.selectCard(this.tableModel.cards[cardElement.cardIndex-1])
  },
  
  _build: function() {
    this.table = document.createElement('div');
    this.table.id = 'table';
    for(var cardIndex = 1; cardIndex<=12; cardIndex++) {
      var cardElement = document.createElement('div');
      cardElement.className = 'card';
      cardElement.id = 'card'+cardIndex;
      cardElement.cardIndex = cardIndex;
      this.table.appendChild(cardElement);
    }
    document.body.appendChild(this.table);
    this.table.addEventListener('click', this.onclick.bind(this), false);
  },
  
  _update: function() {
    for (var cardIndex = 0; cardIndex < this.tableModel.cards.length; cardIndex++)
      this._applyFace(this.tableModel.cards[cardIndex], cardIndex+1);
  },
  
  _applyFace: function(card, cardIndex) {
    var face = document.createElement('div');
    face.className = 'face';
    for (var imageIndex = 0; imageIndex < card.count; imageIndex++) {
      var img = document.createElement('div');
      img.className = 'mark '+card.image;
      face.appendChild(img);
    }
    var cardElement = $('card'+cardIndex);
    cardElement.innerHTML = '';
    cardElement.appendChild(face);
  }
});

Deck = Class.create();
Object.extend(Deck.prototype, {
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

Card = Class.create();
Object.extend(Card.prototype, {
  initialize: function(shape, color, fill, count) {
    this.shape = shape, this.color = color, this.fill = fill, this.count = count;
    this.image = this.shape + ' ' + this.color + '-' + this.fill;
  }
});

Fx = Class.create();
Object.extend(Fx.prototype, {
  initialize:function(table){
    this.table = table;
  },
  runOpeningFx: function() {
    this.table.className = 'hot';
  }
});

Array.prototype.shuffle = function(){
  for(var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
};