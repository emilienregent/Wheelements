var Foe = function() {

	a = randI(0,359);
	this.x = game.player.x + (canvas.width * 0.5 * Math.cos(a));
	this.y = game.player.y + (canvas.height * 0.5 * Math.sin(a));

	this.r = rand(10, 20);
	this.s = rand(0.0015, 0.0055);
	this.c = cc[12];
	this.f = false;
	this.ft = null;

	this.toDelete = false;
	this.reversed = false;

	this.update = function() {
		if (this.f && game.time - this.ft > 2000)
			this.unfreeze();

		x = game.player.x - this.x;
		y = game.player.y - this.y;
		d = Math.sqrt(x*x+y*y);
		if (d > 1) {
			if(this.reversed) {
				this.x -= x * (this.s/10);
				this.y -= y * (this.s/10);
			} else {
				this.x += x * (this.s/10);
				this.y += y * (this.s/10);
			}
			if (!this.f)
				this.s += 0.00005;
		}

		if(distance(this, game.player) < game.player.r/4 + this.r) {
			this.destroy();

			game.gameover = true;
		}
		else {
			for(var i = 0, c = game.player.powers.length; i < c; i ++) {
				var p = game.player.powers[i];
				if(p.toDelete === false && distance(p, this) < p.r * 2 + this.r) {
					p.destroy();
					this.destroy();
					break;
				}
			}
		}

		if(this.reversed == true) {
			if(this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
				this.reverse();
			}
		}

		this.render();
	}

	this.render = function() {
		C(ctx,this.c,this.x,this.y,this.r,1);
	}

	this.destroy = function() {
		this.toDelete = true;
	}

	this.knockback = function(distance) {
		x = game.player.x - this.x;
		y = game.player.y - this.y;
		this.s -= 0.0005;
		d = Math.sqrt(x*x+y*y);
		if (d > 1) {
			this.x -= x * (this.s*distance);
			this.y -= y * (this.s*distance);
		}
	}

	this.slowdown = function(speed) {
		this.s -= speed;
	}

	this.freeze = function() {
		this.c = cc[2];
		this.f = true;
		this.s = 0;
		this.ft = +new Date();
	}

	this.unfreeze = function() {
		this.c = cc[12];
		this.f = false;
		this.ft = null;
	}

	this.reverse = function() {
		this.reversed = !this.reversed;
		this.c = this.reversed ? cc[8] : cc[12];
	}
}