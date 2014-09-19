var ProjectileAir = function(type) {

	this.angle = game.player.powers[type].angle + (game.player.offset * Math.PI / 180);
  this.x = game.player.powers[type].x + game.player.r * Math.cos(this.angle);
  this.y = game.player.powers[type].y + game.player.r * Math.sin(this.angle);
  this.r = 20;
  this.name = PowerConf.names[type];
  this.color = PowerConf.colors[type];
  this.parts =  [
    {x:this.x - 50 * Math.cos(this.angle + rad(45)),y:this.y - 50 * Math.sin(this.angle + rad(45)),p:[]},
    {x:this.x - 25 * Math.cos(this.angle + rad(30)),y:this.y - 25 * Math.sin(this.angle + rad(30)),p:[]},
    {x:this.x - 25 * Math.cos(this.angle - rad(30)),y:this.y - 25 * Math.sin(this.angle - rad(30)),p:[]},
    {x:this.x - 50 * Math.cos(this.angle - rad(45)),y:this.y - 50 * Math.sin(this.angle - rad(45)),p:[]},
  ];
  this.s = PowerConf.speed[type];

  this.maxl = 5;

	this.time = game.time + PowerConf.times[type];

	this.toDelete = false;

  this.fired = false;

  this.update = function() {
    for(var p = 0, c = this.parts.length; p < c; p++) {
      var part = this.parts[p];
      part.x += Math.cos(this.angle) * this.s;
      part.y += Math.sin(this.angle) * this.s;

      for(var l = 0; l < game.foes.length; l++) {
        var foe = game.foes[l];
        if(distance(part,foe) < this.r + foe.r) {
          if(this.fired) {
            game.mix ++;
            foe.destroy();
          } else {
            foe.slowdown(foe.s);
          }
        }
      }

      if(this.fired == true) {
        for(j=0; j<c; j++) {
          part.p.push({
            x: (this.r/2)*Math.cos(this.r+((this.time-game.time)/50))+part.x, 
            y: (this.r/2)*Math.sin(this.r+((this.time-game.time)/50))+part.y, 
            xs: (Math.random()*2*this.s-this.s)/2, 
            ys: -Math.random()*2*this.s,
            l: 0
          });
        }
      } else {
        for(var j=0;j<game.player.powers[2].projectiles.length;j++) {
          var fire = game.player.powers[2].projectiles[j];
          if(fire.smoked == false) {
            for(var k = 0; k < fire.parts.length; k++) {
              var partFire = fire.parts[k];
              if(distance(partFire,part) < partFire.r + this.r/2) {
                this.fired = true;
                break;
              }
            }
          }
        }
      }

    }
  }

  this.render = function() {

    for(var i = 0, c = this.parts.length; i < c; i++) {

      if(game.quality == "high") {
        ctx.moveTo(this.x,this.y);
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (j=this.r/2; j < this.r*2; j++) {
          a=0.5*j;
          x=(a/2)*Math.cos(a+((this.time-game.time)/50))+this.parts[i].x;
          y=(a/2)*Math.sin(a+((this.time-game.time)/50))+this.parts[i].y;
          ctx.lineTo(x, y);
        }
        ctx.closePath();

        if(this.fired) {
          ctx.fillStyle = cc[3];
          ctx.fill();
        }

        ctx.strokeStyle = cc[4];
        ctx.stroke();

        for(var j=0; j<this.parts[i].p.length; j++) {

            var p = this.parts[i].p[j];
            var max = this.maxl;
            
            var color = "rgba("+(260-(p.l*2))+","+((p.l*2)+127)+","+(p.l*2)+","+(((max-p.l)/max)*0.4)+")";
            
            C(ctx,color,p.x,p.y,(max-p.l)/max+1);
            
            p.x+=p.xs;
            p.y+=p.ys;

            p.l++;
            if(p.l >= max) {
                this.parts[i].p.splice(j, 1);
                j--;
            }
        }
      } else {
        var color = this.fired ? cc[3] : this.color;

        C(ctx, color, this.parts[i].x, this.parts[i].y, this.r/2);
      }
    }
  }

}

ProjectileAir.prototype = Projectile;