var Player = function() {

	this.x = canvas.width/2;
	this.y = canvas.height/2;
	this.r = 40;

	this.offset = 0;
	this.angularSpeed = .25;

	this.powers = [];

	this.cPowers = 3;

	this.alpha = 0;
	this.coef = 0.01;

	this.initialize = function() {
		for(i=0;i<4;i++) {
			this.powers[i] = new Power(i);
		}
	}

	this.update = function() {
		if(game.step > 0) {

			if(game.input.left === 1) {
				this.angularSpeed = Math.min(this.angularSpeed + .1, 10);
				this.offset = (this.offset + this.angularSpeed) % 360;
			} else if(game.input.right === 1) {
				this.angularSpeed = Math.min(this.angularSpeed + .1, 10);
				this.offset = (this.offset - this.angularSpeed) % 360;
			} else {
				this.angularSpeed = .25;
			}

			this.cPowers = 0;

			for(var i = 0, c = this.powers.length; i < c; i ++) {
				if(this.powers[i].toDelete == false) {
					this.powers[i].update();
					this.cPowers ++;
				}
			}
		}

		this.alpha += this.coef;

		if(this.alpha >= 1 && this.coef > 0) {
			this.coef = -this.coef;
			this.alpha = 1;
		} else if(this.alpha <= 0.1 && this.coef < 0) {
			this.coef = -this.coef;
			this.alpha = 0.1;
		}

		this.render();
	}

	this.render = function() {
		C(ctx,"rgba(255,255,255,.3",this.x,this.y,this.r,1);

		if(game.gameover == false && game.step > 0) {
			for(var i = 0, c = this.powers.length; i < c; i ++) {
				var color = this.powers[i].toDelete ? cc[1] : this.powers[i].color;
				var a = deg(PowerConf.angles[i]);
				A(ctx,color,this.x,this.y,this.r,3,a - 45 + this.offset,a + 45 + this.offset);
			}

			for(var j = 0, c = this.powers.length; j < c; j ++) {
				if(this.powers[j].toDelete == false) {
					this.powers[j].render();
				}
			}
		}

		var color = game.gameover ? "rgba(221,0,72,"+this.alpha+")" : "rgba(131,245,44,"+this.alpha+")";
		C(ctx,color,this.x,this.y,this.r/4);
	}
}