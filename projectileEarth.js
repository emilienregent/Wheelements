var ProjectileEarth = function(type) {

	this.x = game.player.powers[type].x;
	this.y = game.player.powers[type].y;
	this.r = 5;
	this.type = type;
	this.name = PowerConf.names[type];
	this.color = PowerConf.colors[type];
	this.angle = game.player.powers[type].angle + (game.player.offset * Math.PI / 180);
  this.speed = PowerConf.speed[type];

  this.fired = false;
  this.splited = false;
  this.exploded = false;

	this.time = game.time + PowerConf.times[type];
	this.toDelete = false;

  this.parts = [];
  this.offset = 0;

  var angle = 0;
  for(var i = 0, c = 8; i < c; i++) {
    this.parts[i] = {
      a : angle,
      p : [],
      s : 3,
      maxl : 4
    };
    angle += (360/(c*rand(0,1)));
  }

  this.update = function() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    this.offset += 5;

    for(j=0;j<game.foes.length;j++) {
      var foe = game.foes[j];
      if(distance(this, foe) < foe.r + this.r ) {

      	if(this.r >= foe.r/4) {

        	foe.destroy();

        	if(this.fired == true && this.exploded == false) {
            game.mix ++;
	        	this.explode();
	        	break;
	        }
        }

        if(this.exploded == false) {
        	this.destroy();
        }

        break;
      }
    }

    if(this.exploded == false && this.splited == false) {
    	for(var i=0;i<game.player.powers[0].projectiles.length;i++) {
        var air = game.player.powers[0].projectiles[i];
        for(var j = 0; j < air.parts.length; j++) {
          var partAir = air.parts[j];
          if(distance(this,partAir) < this.r + air.r) {
            this.split(air);

            air.destroy();
            break;
          }
        }
      }
    }

    if(this.fired == false && this.exploded == false) {
      for(var i=0;i<game.player.powers[2].projectiles.length;i++) {
        var fire = game.player.powers[2].projectiles[i];
        if(fire.smoked == false) {
	        for(var j = 0; j < fire.parts.length; j++) {
	          var partFire = fire.parts[j];
	          if(distance(this,partFire) < this.r + fire.r) {
	            this.fired = true;
	          }
	        }
	    }
      }
    } else if(this.fired == true && this.exploded == true) {
      this.r ++;
    }

	  for(var i=0;i<game.player.powers[1].projectiles.length;i++) {
	    var water = game.player.powers[1].projectiles[i];
        for(var j = 0; j < water.parts.length; j++) {
          var partWater = water.parts[j];
          if(distance(this,partWater) < this.r + partWater.r) {
          	if(this.fired == true) {
          		this.fired = false;
          	}
          	else if(partWater.mud == false && partWater.iced == false) {
            	partWater.mud = true;
            	partWater.r *= 2;
            	partWater.time = game.time + PowerConf.times[1];
            	if(--this.r <= 0) {
            		this.destroy();
            	}
           	}
          }
        }
	  }

    if(this.fired == true && game.quality == "high") {
      for(i=0;i<this.parts.length;i++) {

        var part = this.parts[i];

        var x = this.x + Math.cos(rad(this.parts[i].a + this.offset)) * this.r,
            y = this.y + Math.sin(rad(this.parts[i].a + this.offset)) * this.r;

        for(j=0; j<1; j++) {
          var p = {
            x: x, 
            y: y, 
            xs: (Math.random()*2*part.s-part.s)/2, 
            ys: -Math.random()*2*part.s,
            l: 0
          }
          part.p.push(p);
        }
      }
    }
  }

  this.render = function() {
    this.p = randI(10,20);
    this.m = rand(0.5,0.51);

    if(this.exploded == false) {

      for(var i = 0; i < this.parts.length; i++) {

        var x = this.x + Math.cos(rad(this.parts[i].a + this.offset)) * this.r,
            y = this.y + Math.sin(rad(this.parts[i].a + this.offset)) * this.r;

        var color = this.fired ? PowerConf.colors[2] : this.color;

        C(ctx, color, x, y, this.r/3);

        if(game.quality == "high") {
          for(var j=0; j<this.parts[i].p.length; j++) {
            var p = this.parts[i].p[j];
            var max = this.parts[i].maxl;
            
            var c = "rgba("+(260-(p.l*2))+","+((p.l*2)+127)+","+(p.l*2)+","+(((max-p.l)/max)*0.4)+")";
            
            C(ctx,c,p.x,p.y,(max-p.l)/max*(this.r/6)+(this.r/6));
            
            p.x+=p.xs;
            p.y+=p.ys;

            p.l++;
            if (p.l >= max) {
              this.parts[i].p.splice(j, 1);
              j--;
            }
          }
        }
      }
    }

    C(ctx, this.color, this.x, this.y, this.r);

    if(this.exploded) {
    	var color = cc[12].replace(",1)", ",.5)")
    	C(ctx, color, this.x, this.y, this.r/2);
    }

  }

  this.explode = function() {
    this.color = PowerConf.colors[2];
    this.speed = 0;
    this.exploded = true;
  }

  this.split = function(air) {
  	this.splited = true;

  	for(var i = 0; i < air.parts.length; i++) {
	  	var p = new ProjectileEarth(this.type);

	  	p.x = air.parts[i].x;
	  	p.y = air.parts[i].y;

	  	game.player.powers[this.type].projectiles.push(p);
	}

	this.destroy();
  }

}

ProjectileEarth.prototype = Projectile;