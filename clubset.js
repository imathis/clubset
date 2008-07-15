Game = Class.create();
Object.extend(Game.prototype, {
  initialize: function() {
    this.table = new Table();
  }
});
Table = Class.create();
Object.extend(Table.prototype, {
  initialize: function() {
      this.deck = new Deck();
      this.fx = new Fx();
  },
  deal: function() {
    this.deck.shuffle();
    this.cards = this.deck.cards.splice(0,12);
  },
  
  build: function() {
    var table = document.createElement('div');
    table.id = 'table';
    var count = 1;
    for(var i = 0; i<this.cards.length; i++) {
      card = this.cards[i];
      var face = document.createElement('div');
      face.className = 'face';
      for (var index = 0; index < card.count; index++) {
        var img = document.createElement('img');
        img.src = Game.imagePath + card.image;
        img.className = 'mark';
        face.appendChild(img);
      }
      var cardElement = document.createElement('div');
      cardElement.className = 'card';
      cardElement.id = 'card'+(count++);
      cardElement.appendChild(face);
      this.fx.mix(cardElement);
      table.appendChild(cardElement);
    }
    document.body.appendChild(table);
    setInterval(this.fx.showAllCards, 10);
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
  },
  
  shuffle: function() {
    this.cards.shuffle();
  }
});

Card = Class.create();
Object.extend(Card.prototype, {
  initialize: function(shape, color, fill, count) {
    this.shape = shape, this.color = color, this.fill = fill, this.count = count;
    this.image = this.shape + '-' + this.color + '-' + this.fill + '.png';
  }
});

Fx = Class.create();
Object.extend(Fx.prototype, {
  initialize:function(){
  },
  hideCard: function(cardId){
    card = document.querySelector('#'+cardId);
    card.className = "card hidden";
  },
  showCard: function(cardId){
    card = document.querySelector('#'+cardId);
    card.className = "card visible";
  },
  showAllCards: function() {
    var cards = document.querySelectorAll(".card");
    for(card=0;card<cards.length; card++){
      cards[card].className = "card";
      // cards[card].style.webkitTransform='rotate(0deg)';
      cards[card].style.webkitTransform='scale(1)';
    }
  },
  hideAllCards: function () {
    var cards = document.querySelectorAll(".card");
    for(card=0;card<cards.length; card++){
      cards[card].className = "card hidden";
    }
  },
  mix: function (card) {
    card.className = 'card hidden mixed';
    // var random = 20 + Math.floor(Math.random()*100);
    // var value = (random%2) ? '-' : '';
    // card.style.webkitTransform='rotate('+value+random+'deg)';
    card.style.webkitTransform='scale(0.1)';
  }
});

Array.prototype.shuffle = function(){
  for(var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
};