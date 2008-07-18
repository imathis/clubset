Game = Class.create();
Object.extend(Game.prototype, {
  initialize: function() {
    this.table = new Table();
    this.table.build();
  }
});
Table = Class.create();
Object.extend(Table.prototype, {
  initialize: function() {
      this.deck = new Deck();
      this.fx = new Fx();
      if(table = document.getElementById('table')){
        document.body.removeChild(table); //removes old table if a new game is started
      }
  },
  
  build: function() {
    this.cards = this.deck.deal();
    var table = document.createElement('div');
    table.id = 'table';
    this.fx.setOpeningFx(table);
    var count = 1;
    for(var i = 0; i<this.cards.length; i++) {
      card = this.cards[i];
      var face = document.createElement('div');
      face.className = 'face';
      for (var index = 0; index < card.count; index++) {
        var img = document.createElement('div');
        img.className = 'mark '+card.image;
        face.appendChild(img);
      }
      var cardElement = document.createElement('div');
      cardElement.className = 'card';
      cardElement.id = 'card'+(count++);
      cardElement.appendChild(face);
      table.appendChild(cardElement);
    }
    document.body.appendChild(table);
    setTimeout(this.fx.runOpeningFx, 1500);
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
  initialize:function(){
  },
  runOpeningFx: function() {
    table = document.getElementById("table");
    table.className = '';
  },
  setOpeningFx: function (table) {
    table.className = 'mixed';
  }
});

Array.prototype.shuffle = function(){
  for(var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
};