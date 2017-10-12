var height = window.innerHeight,
	width = window.innerWidth,
	time = 1500,
	game = new Phaser.Game(width, height, Phaser.CANVAS, 'game', {
		preload: preload,
		update: update,
		create: create
	}, false, false);

function preload() {
	game.load.image('rata', 'img/rata.png');
	game.load.image('queso', 'img/queso.png');
	game.load.image('caca', 'img/poop.png');
	game.stage.backgroundColor = '#000';
}

function create() {
	self = this;
	game.physics.startSystem(Phaser.Physics.ARCADE);
	this.cheeseGroup = game.add.group();
	this.poopGroup = game.add.group();
	this.rata = game.add.sprite(width / 2, height - game.cache.getImage('rata').height + 50, 'rata');
	this.rata.scale.setTo(0.3);
	game.physics.arcade.enable(this.rata);
	this.rata.body.collideWorldBounds = true;
	this.timer = game.time.events.loop(time, function() {
		if (Math.random() < 0.6) {
			var cheese = game.add.sprite(Math.floor(Math.random() * width) + 1, 0, 'queso');
			game.physics.arcade.enable(cheese);
			cheese.checkWorldBounds = true;
			cheese.events.onOutOfBounds.add(function(cheese) {
				cheese.kill();
			});
			cheese.body.velocity.y = 150;
			self.cheeseGroup.add(cheese);
		} else {
			var poop = game.add.sprite(Math.floor(Math.random() * width) + 1, 0, 'caca');
			game.physics.arcade.enable(poop);
			poop.checkWorldBounds = true;
			poop.events.onOutOfBounds.add(function(poop) {
				poop.kill();
			});
			poop.body.velocity.y = 150;
			self.poopGroup.add(poop);
		}
	}, this);
	game.time.events.loop(5000, function() {
		time -= 100;
		self.timer.delay = time;
	}, this);
	this.score = 0;
	this.scoretxt = game.add.text(20, 30, this.score.toString(),{ font: "65px Arial", fill: "#ff0044", align: "center" })
}

function update() {

	if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
		this.rata.body.velocity.x += -100;
	} else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
		this.rata.body.velocity.x += 100;
	} else {
		this.rata.body.velocity.x = 0;
	}
	game.physics.arcade.overlap(this.rata, this.cheeseGroup, function(rata, cheese){
		this.score++;
		this.scoretxt.text = this.score.toString()
		cheese.kill();
	}, null, this)
	game.physics.arcade.overlap(this.rata, this.poopGroup, function(rata, poop){
		this.score--
		this.scoretxt.text = this.score.toString()
		poop.kill();
	}, null, this)

}