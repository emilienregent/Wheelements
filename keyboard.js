var Input = function() {

	this.up = 0;
	this.right = 0;
	this.down = 0;
	this.left = 0;
	this.space = 0;

	var that = this;

	document.addEventListener('keydown', function(evt) {

		that.up = evt.keyCode == 38 || evt.keyCode == 90 || evt.keyCode == 87 ? 1 : that.up;
		that.right = evt.keyCode == 39 || evt.keyCode == 68 ? 1 : that.right;
		that.down = evt.keyCode == 40 || evt.keyCode == 83 ? 1 : that.down;
		that.left = evt.keyCode == 37 || evt.keyCode == 81 || evt.keyCode == 65 ? 1 : that.left;
		that.space = evt.keyCode == 32 ? 1 : that.space;

	}, false);

	document.addEventListener('keyup', function(evt) {

		that.keypressed = true;

		that.up = evt.keyCode == 38 || evt.keyCode == 90 || evt.keyCode == 87 ? 0 : that.up;
		that.right = evt.keyCode == 39 || evt.keyCode == 68 ? 0 : that.right;
		that.down = evt.keyCode == 40 || evt.keyCode == 83 ? 0 : that.down;
		that.left = evt.keyCode == 37 || evt.keyCode == 81 || evt.keyCode == 65  ? 0 : that.left;
		that.space = evt.keyCode == 32 ? 0 : that.space;

	}, false);

	this.keyboardEventsSet = true;
}