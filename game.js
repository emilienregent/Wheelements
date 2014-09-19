// Game loop
var Game = function() {

	window.game = this;

	this.input = new Input();

	this.player = new Player();
	this.player.initialize();
	this.elapsedTime = 0; // in seconds
	this.time = this.lTime = this.pTime = +new Date();
	this.pRate = 3;

	this.fps = 0;
	this.maxFps = 0;
	this.fpsUnderLimit = 0;
	this.quality = "high";
	this.hasQualitySetting = true;

	this.foes = [];

	this.gameover = false;
	this.canRestart = false;
	this.evtRestart = null;

	this.mix   = 0;
	this.kills = 0;
	this.score = 0;
	this.bestScore = Math.max(localStorage.getItem("score"), 0);

	this.messages = [
		"Protect the life element from red dots !",
		"Turn the wheel of powers with [left-arrow] and [right-arrow].",
		"Use [space] to unleash powers and mix elements !!",
		"Prepare yourself ...",
		"Red dot is coming !",
		"Game Over - Clic to restart"
	];
	this.step = 0;

	this.run = function() {

		this.fps = countFPS();

		if(this.hasQualitySetting) {
			if(this.quality == "high") {
				if(this.fps < this.maxFps/2) {
					this.fpsUnderLimit ++
				}

				if(this.fpsUnderLimit > 10) {
					this.quality = "low";
				}
			}
		}

		this.time = +new Date();
		if (this.time - this.lTime >= 1000 && this.gameover === false) {	

			this.elapsedTime++;
			this.lTime = this.time;

			if(this.elapsedTime%this.pRate === 0) {
				this.pTime = this.time;

				if(this.step == this.messages.length - 2) {
					this.foes.push(new Foe());
				} else {
					this.step ++;
				}
			}

			if(this.fps > this.maxFps) {
				this.maxFps = this.fps;
			}
		}

		R(ctx,cc[7],0,0,canvas.width,canvas.height);

		if(this.gameover === false) {
			for(i=0,c=this.foes.length;i<c;i++) {
				if(this.foes[i].toDelete == false) {
					this.foes[i].update();
				} else {
					this.kills ++;
					this.foes.splice(i, 1);
					
					if(--c <= 0) {
						break;
					}
				}
			}
		} else if(this.step == this.messages.length - 2) {
			this.step ++;
			if(this.score > this.bestScore) {
				localStorage.setItem("score", this.score);
			}
		}

		this.player.update();

		var text = this.messages[this.step];
		var width = this.gameover ? canvas.width : ((this.time-this.pTime)*canvas.width)/(1000*this.pRate);

		R(ctx,"rgba(25,25,25,0.5)",0,canvas.height-80,width,40);
		T(ctx,text,cc[7],50,canvas.height-50,20);

		if(this.canRestart === false && this.gameover === true) {
			this.canRestart = true;
			this.evtRestart = canvas.addEventListener("click",this.restart.bind(this));
		}

		if(this.step == this.messages.length - 2) {
			this.score = this.elapsedTime * (5 - this.player.cPowers) + (this.kills + this.mix * this.mix);
		}

		T(ctx,"Score : " + this.score,cc[1],50,50,20);
		T(ctx,"Best Score : " + this.bestScore,"rgba(255,255,255,.5)",50,75,20);

		requestAnimationFrame(this.run.bind(this));
	}

	this.restart = function() {

		this.step = this.messages.length - 2;

		this.kills = 0;
		this.mix = 0;
		this.elapsedTime = 0;

		this.canRestart = false;
		this.gameover = false;

		this.pTime = this.time;

		for(i=0,c=this.foes.length;i<c;i++) {
			this.foes.splice(i,1);
			if(--c <= 0) {
				break;
			}
		}

		for(i=0,c=this.player.powers.length;i<c;i++) {
			var pow = this.player.powers[i];
			pow.toDelete = false;

			pow.projectiles.splice(0,pow.projectiles.length);
		}

		this.foes = [];

		canvas.removeEventListener("click", this.evtRestart, false);
	}

	this.run();
}