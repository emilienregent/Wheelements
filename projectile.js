var Projectile = {

	update : function() {
		this.x += Math.cos(this.angle) * 5;
		this.y += Math.sin(this.angle) * 5;

		for(i=0;i<game.foes.length;i++) {
			var foe = game.foes[i];

			if(distance(this, foe) < this.r) {
				foe.destroy();
				this.destroy();
				break;
			}
		}
	},

	render : function() {
		C(ctx, this.color, this.x, this.y, this.r, 1);
	},

	destroy : function() {
		this.toDelete = true;
	}
}