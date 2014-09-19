var ProjectileFire = function(type) {

  this.angle = game.player.powers[type].angle + rad(game.player.offset);
  this.x = game.player.powers[type].x + game.player.r * Math.cos(this.angle);
  this.y = game.player.powers[type].y + game.player.r * Math.sin(this.angle);

  this.r = 3;

  this.parts = [];

  for(var i = 0, c = 8; i < c; i++) {

    var direction = i < c/2 ? 1 : -1;

    this.parts[i] = {
      x : this.x + 50 * Math.cos(this.angle + rad(i%4 * 15) * direction),
      y : this.y + 50 * Math.sin(this.angle + rad(i%4 * 15) * direction),
      p : [],
      s : 3,
      maxl : 10,
      r : this.r/2
    }
  }

  this.name = PowerConf.names[type];
  this.color = PowerConf.colors[type];

  this.time = game.time + PowerConf.times[type];

  this.toDelete = false;

  this.smoked = false;

  this.update = function() {

    for(i=0;i<this.parts.length;i++) {

      var direction = i < c/2 ? 1 : -1;

      var part = this.parts[i];

      for(j=0;j<game.foes.length;j++) {
        var foe = game.foes[j];
        if(distance(part, foe) < foe.r) {
          if(this.smoked) {
            foe.reverse();
          } else {
            foe.destroy();
          }
          break;
        }
      }

      if(game.quality == "high") {
        var c = this.smoked ? randI(-5,2) : 1;
        for(j=0; j<c; j++) {
          var p = {
            x: part.x, 
            y: part.y, 
            xs: (Math.random()*2*part.s-part.s)/2, 
            ys: -Math.random()*2*part.s,
            l: 0
          }

          if(this.smoked) {
            p.xs =p.xs/2;
            p.ys =p.ys/2;
          }

          part.p.push(p);
        }
      }
    }
  }

  this.render = function() {
    
    for(var i=0;i<this.parts.length;i++) {

      if(game.quality == "high") {
        for(var j=0; j<this.parts[i].p.length; j++) {

            var p = this.parts[i].p[j];
            var max = this.parts[i].maxl;
            
            var c = this.smoked 
              ? "rgba("+(120-(p.l*2))+","+(120-(p.l*2))+","+(120-(p.l*2))+","+(((max-p.l)/max)*0.4)+")"
              : "rgba("+(260-(p.l*2))+","+((p.l*2)+127)+","+(p.l*2)+","+(((max-p.l)/max)*0.4)+")";
            
            C(ctx,c,p.x,p.y,(max-p.l)/max*(this.r/2)+(this.r/2));
            
            p.x+=p.xs;
            p.y+=p.ys;

            p.l++;
            if(p.l >= max) {
                this.parts[i].p.splice(j, 1);
                j--;
            }
        }
      } else {
        var color = this.smoked ? cc[8] : this.color;

        C(ctx, color, this.parts[i].x, this.parts[i].y, this.r);
      }
    }
  }

  this.smoke = function() {
    
    this.smoked = true;
    for(var i=0;i<this.parts.length;i++) {
      this.parts[i].maxl = 30;
    }
  }
}

ProjectileFire.prototype = Projectile;