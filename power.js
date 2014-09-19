var Power = function(type) {

	this.type = type;	
	this.name = PowerConf.names[type];
	this.color = PowerConf.colors[type];

	this.cd = PowerConf.cd[type];
	this.rof = PowerConf.rofs[type];
	this.angle = PowerConf.angles[type];

	this.projectiles = [];

	this.x = 0;
	this.y = 0;
	this.r = game.player.r/4;
	this.lastShoot = +new Date();

	this.toDelete = false;

	this.update = function() {
		var offset = rad(game.player.offset);
		this.x = game.player.x + Math.cos(this.angle + offset) * game.player.r;
		this.y = game.player.y + Math.sin(this.angle + offset) * game.player.r;

		if(game.step > 1 && game.input.space === 1 && game.time - this.lastShoot >= this.rof && game.gameover === false) {
			this.lastShoot = game.time;
			this.projectiles.push(new window["Projectile" + ucfirst(PowerConf.names[this.type])](this.type));
		}

		for(var i = 0, c = this.projectiles.length; i < c; i ++) {
			if(this.projectiles[i].toDelete == false) {
				if(game.time - this.projectiles[i].time < 0 || i !== 1) {
					this.projectiles[i].update();
				} else {
					this.projectiles[i].destroy();
				}
			} else {
				this.projectiles.splice(i,1);
				if(--c <= 0) {
					break;
				}
			}
		}
	}

	this.render = function() {
		
		C(ctx,this.cd,this.x,this.y,this.r,1);
		A(ctx,this.color,this.x,this.y,this.r,3,0,((game.time-this.lastShoot)*360)/this.rof);

		for(var i = 0, c = this.projectiles.length; i < c; i ++) {
			this.projectiles[i].render();
		}
	}

	this.destroy = function() {
		this.toDelete = true;
	}
}

var PowerConf = {
	names 	: ["air",	"water", 	"fire", 	"earth"],
	times 	: [10000,		10000,			6000,			3000],
	speed 	: [1,		.1,			0,			3],
	colors 	: [cc[4], cc[2], cc[3], cc[5]],
	angles 	: [0, 		3*(Math.PI/2), Math.PI/2, 	Math.PI],
	rofs	: [2000, 250, 2000, 1000],
	cd		: ["rgba(196,226,255,0.8)", 	"rgba(0,128,255,0.8)", 		"rgba(255,127,0,0.8)", 		"rgba(160,82,45,0.8)"]
}