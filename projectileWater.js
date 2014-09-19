var ProjectileWater = function(type) {

  var that = this;

	this.x = game.player.powers[type].x;
	this.y = game.player.powers[type].y;
	this.r = 3;
	this.name = PowerConf.names[type];
	this.color = PowerConf.colors[type];
	this.angle = game.player.powers[type].angle + (game.player.offset * Math.PI / 180);
  this.speed = PowerConf.speed[type];
  this.iced = false;

  this.parts = [];

  for(var i = 0, ci = 10; i < ci; i++) {

    var offset = i < ci/2 ? 0 : ci/2;
    var direction = i < ci/2 ? 1 : -1;

    this.parts[i] = {
      x : this.x + Math.cos(this.angle + rad(45)) * randI(-that.r, that.r * 3), 
      y : this.y + Math.sin(this.angle + rad(45)) * randI(-that.r, that.r * 3),
      sx : rand(this.speed,this.speed+1),
      sy : rand(this.speed,this.speed+1),
      r : rand(that.r/2,that.r*2),
      time : game.time + PowerConf.times[type] + rand(0, 1000),
      iced : false,
      mud : false
    }
  }

	this.time = game.time + PowerConf.times[type];

	this.toDelete = false;

  this.update = function() {
    for(var i = 0, c = this.parts.length; i < c; i++) {

      var partWater = this.parts[i];

      if(game.time - partWater.time > 0) {
        this.parts.splice(i, 1);

        c--;
        continue;
      }

      if(partWater.mud == false) {
        partWater.x += Math.cos(this.angle) * partWater.sx;
        partWater.y += Math.sin(this.angle) * partWater.sy;

        for(var j=0;j<game.player.powers[0].projectiles.length;j++) {
          var air = game.player.powers[0].projectiles[j];
          for(var k = 0; k < air.parts.length; k++) {
            var partAir = air.parts[k];
            if(distance(partWater,partAir) < partWater.r + air.r) {
              partWater.iced=true;
            }
          }
        }

        for(var j=0;j<game.player.powers[2].projectiles.length;j++) {
          var fire = game.player.powers[2].projectiles[j];
          for(var k = 0; k < fire.parts.length; k++) {
            var partFire = fire.parts[k];
            if(distance(partFire,partWater) < partWater.r + fire.r) {
              fire.smoke();
              
              this.parts.splice(i, 1);

              c--;
              break;
            }
          }
        }
      }
      

      for(var l = 0; l < game.foes.length; l++) {
        var foe = game.foes[l];
        if(distance(partWater,foe) < partWater.r + foe.r) {
          if(partWater.iced) {
            foe.freeze();
          } else if(partWater.mud) {
            foe.slowdown(foe.s/2);
          } else {
            foe.slowdown(partWater.r/10000);
          }

          this.parts.splice(i, 1);

          c --;
          return;
        }
      }

      if(c <= 0) {
        break;
      }

    }
  }

  this.render = function() {
    for(var i = 0, c = this.parts.length; i < c; i++) {

      var partWater = this.parts[i];

      if(partWater.iced) {
        var r = 7;
        S(ctx,partWater.x,partWater.y,r,5,0.5,cc[2]);
        S(ctx,partWater.x,partWater.y,r,10,0.3,cc[9]);
      }
      else {
        var color = partWater.mud ? cc[10] : this.color;
        C(ctx, color, partWater.x, partWater.y, partWater.r, 0);        
      }

      if(partWater.mud && game.quality == "high") {
        ctx.moveTo(partWater.x,partWater.y);
        ctx.lineWidth = 1;
        ctx.beginPath();

        for (j=partWater.r/2; j < partWater.r*4; j++) {
          a=0.5*j;
          x=(a/2)*Math.cos(a+((partWater.time-game.time)/50))+partWater.x;
          y=(a/2)*Math.sin(a+((partWater.time-game.time)/50))+partWater.y;
          ctx.lineTo(x, y);
        }

        ctx.closePath();
        ctx.strokeStyle = cc[11];
        ctx.stroke();
      }
    } 
  }
}

ProjectileWater.prototype = Projectile;