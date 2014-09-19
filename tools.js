if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = (function() {
		return window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function (callback, elements) {
					window.setTimeout(callback, 1000/40);
				}
	})();
}

/*METHODS*/
/*Draw a circle*/
function C(ctx,c,x,y,r,l) {

	if(r > 0) {
		var cl = l > 0 ? "rgba(0,0,0,.1)" : c;

		// Create stroke arc
		CS(ctx,cl,x,y,r,l);

		ctx.fillStyle = c;
		ctx.fill();
	}
}
function CS(ctx,c,x,y,r,l) {

	// Create path
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2*Math.PI);
	// Set graphics & draw
	ctx.lineWidth = l;
	// Close path
	ctx.closePath();
	
	ctx.strokeStyle = c;
	ctx.stroke();
}
/*Draw an arc*/
function A(ctx,c,x,y,r,l,as,ae){ctx.beginPath();ctx.arc(x,y,r,(Math.PI/180)*as, (Math.PI/180)*ae, false);ctx.lineWidth=l;ctx.strokeStyle=c;ctx.stroke();ctx.closePath();}
/*Draw a rectangle*/
function R(ctx,c,x,y,w,h){ctx.fillStyle=c;ctx.fillRect(x,y,w,h)}
/*Draw a line*/
function L(ctx,c,o1,o2){ctx.beginPath();ctx.moveTo(o1.x,o1.y);ctx.lineTo(o2.x,o2.y);ctx.strokeStyle=c;ctx.stroke();}
/*Draw a star */
function S(ctx,x,y,r,p,m,c){ctx.save();ctx.beginPath();ctx.translate(x,y);ctx.fillStyle=c;ctx.moveTo(0,0-r);for (var i = 0; i < p; i++) {ctx.rotate(Math.PI/p);ctx.lineTo(0,0-(r*m));ctx.rotate(Math.PI/p);ctx.lineTo(0,0-r);}ctx.fill();ctx.restore();}
/*Draw text*/
function T(ctx,t,c,x,y,s){ctx.fillStyle=c; ctx.font = s+"pt Arial"; ctx.fillText(t, x, y);}
function ucfirst(string) { return string.charAt(0).toUpperCase() + string.slice(1);}

function isWebkit(){return (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) || (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor))}
function isMoz(){return navigator.userAgent.toLowerCase().indexOf('firefox') > -1}

function rand(n,x) {return Math.random() * (x - n) + n;}
function randI(n,x) {return Math.floor(Math.random() * (x - n + 1)) + n;}

function distance(a, b) {return Math.sqrt((a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y));}

function rad(deg) {return deg * (Math.PI / 180)}
function deg(rad) {return rad * (180/Math.PI)}

window.countFPS = (function () {
  var lastLoop = (new Date()).getMilliseconds();
  var count = 1;
  var fps = 0;

  return function () {
    var currentLoop = (new Date()).getMilliseconds();
    if (lastLoop > currentLoop) {
      fps = count;
      count = 1;
    } else {
      count += 1;
    }
    lastLoop = currentLoop;
    return fps;
  };
}());

/*CONF PROPERTIES*/
/*Colors*/
cc = [
	/* 0 - black*/"rgb(0,0,0)",
	/* 1 - white*/"rgb(255,255,255)",
	/* 2 - blue*/"rgba(0,128,255,1)",
	/* 3 - orange*/"rgba(255,127,0,1)",
	/* 4 - lightblue*/"rgba(196,226,255,1)",
	/* 5 - brown*/"rgba(160,82,45,1)",
	/* 6 - magenta*/"rgb(255,0,255)",
	/* 7 - grey*/"rgb(51,51,51)",
	/* 8 - lightgrey*/"rgb(120,120,120)",
	/* 9 - ice*/"rgb(247,251,255)",
	/*10 - sand*/"rgb(244,164,96)",
	/*11 - lightsand*/"rgb(247,185,133)",
	/*12 - red*/"rgba(221,0,72,1)"
];