var Combinator = new Object();
Combinator.setup = function(){
  this.init = function(data, size){
    this.data = data;
  	this.n = data.length;
  	this.k = (size && size <= this.n) ? size : this.n;
  	this.comb = new Array(size);
  	for(i=0;i<this.comb.length;i++) this.comb[i] = i;
  	this.total = this.factorial(this.n) / (this.factorial(size) * this.factorial(this.n - size))
  	this.left = this.total;
  }
  this.hasMore = function(){
    return this.left > 0;
  }
	this.current = function(){
		// create current data combination
		var data = new Array(this.k);
		for (i=0; i<this.k; i++) {
			data[i] = this.data[this.comb[i]];
		}
		return data;
	}
	this.next = function(){
		if (this.left > 0) {
			if (this.left-- < this.total) {
				var p = this.k - 1;
				while (this.comb[p] == this.n - this.k + p) p--;
				this.comb[p]++;
				
				for (r = p + 1; r < this.k; r++) {
					this.comb[r] = this.comb[p] + r - p;
				}
			}
			return this.current();
		}
	}
  this.generate = function(data,size){
    this.init(data,size);
		var result = new Array();
		while (this.hasMore()) {
			result.push(this.next());
		}
		return result;
  }
	this.factorial = function(n){
		var val = 1;
		for (i = n; i > 1; i--) val *= i;
		return val;
	}
}