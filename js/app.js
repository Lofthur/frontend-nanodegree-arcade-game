// Enemies our player must avoid
//I added the different variables that has to be instanciated when
//the Enemy object is created.
var Enemy = function (xPos, yPos, speed) {
	// Variables applied to each of our instances go here,
	// we've provided one for you to get started
	this.x = xPos;
	this.y = yPos;
	this.speed = speed;
	// The image/sprite for our enemies, this uses
	// a helper we've provided to easily load images
	this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
	// You should multiply any movement by the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.
	this.x += this.speed * dt;

	if(this.x > 500)
		this.reset();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//This function resets the Enemy object back to the "start" x position.
//and gives it a new y position and a new speed
Enemy.prototype.reset = function () {
	this.x = -100;
	this.y = randomPosition();
	this.speed = randomSpeed();
};

//This function returns a value that is used to set the y value on the Enemy object
function randomPosition () {
	var posArr = [60, 145, 225];
	var randomPos = (Math.random() * 2).toFixed(0);

	return posArr[randomPos];
}

//This function returns a random number that is the speed of the Enemy object
function randomSpeed () {
	var randSpeed = ((Math.random() * 200) + 100 ) ;
	return randSpeed;
}

//This function creates Enemy objects for the game and push them to the allEnemies array
function createEnemy () {
	for(var i = 0; i < 2; i++) {
		allEnemies.push(new Enemy(-100, randomPosition(), randomSpeed()));
	}
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function ()  {
	this.x = 200;
	this.y = 400;
	this.sprite = 'images/char-boy.png';
	this.isScore = false;
	this.score = 0;
	this.life = 3;
};

Player.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.update = function () {
		this.checkPosition(this.x, this.y);
		colission();
		this.checkScore();
		gameElements.checkLevel();
};

Player.prototype.handleInput = function (key) {
	if(key == 'left')
		this.x -= 100;

	if(key == 'right')
		this.x += 100;

	if(key == 'up')
		this.y -= 90;

	if(key == 'down')
		this.y += 90;
};

//This function sets boundaries to the canvas.
Player.prototype.checkPosition = function (xPos, yPos) {
	if(yPos < 0){
		this.reset();
	}

	if(yPos > 400)
		this.y = 400;

	if(xPos < 0)
		this.x = 0;

	if (xPos > 400)
		this.x = 400;
};

//This function resets the player object back to it's start position
//If the reset was caused by a enemy hitting the player, the player score will be subracted by 100
Player.prototype.reset = function () {
	this.x = 200;
	this.y = 400;

	if(!this.isScore && this.life !== 0) {
		this.life -= 1;
			if(this.score >= 100) {
				this.score -= 100;
			}
	}

};

//This checks if the player has arrived to the water, and sets isScore equal to true
//The if statement checks if the isScore is true and if the y value of the player is 400.
//I did this so that the player.score just got increased the right way.
Player.prototype.checkScore = function () {
		if(this.y === 40){
			this.isScore = true;
		}

		if(this.isScore === true && this.y === 400) {
			this.score += 100;
			this.isScore = false;
		}
	};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];

// Place the player object in a variable called player
var player = new Player();

var gameElements = new HandleElements();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};

	player.handleInput(allowedKeys[e.keyCode]);
});

//This put an event listener on the window object, and makes it so that the
//arrow keys does not make the screen go up and down.
window.addEventListener('keydown', function (e){
	if([37, 38, 39, 40].indexOf(e.keyCode) > -1)
		e.preventDefault();
}, false);

//This function checks if there is a colission between the player and the enemy objects
//I added this function into the player update function, and not in the enemy update.
//The reason for this is that i thought it's better to check if the player hits anything.
//When i did it this way I could also check if the player hit any gems also.
function colission () {
	for(var i = 0; i < allEnemies.length; i++) {
		if(player.x <= (allEnemies[i].x + 45) &&
			allEnemies[i].x <= (player.x + 45) &&
			player.y <= (allEnemies[i].y + 45) &&
			allEnemies[i].y <= (player.y + 45)) {
				player.isScore = false;
				player.reset();
			}
	}

	if(player.x <= (gem.x + 45) &&
		gem.x <= (player.x + 45) &&
			player.y <= (gem.y + 45) &&
			gem.y <= (player.y +45)) {

			gem.collected = true;
			gem.reposition();
			player.score += 100;
		}
}

//This sets up the Gems for the game
var Gems = function () {
	this.gemSprite = ['images/Gem Blue.png', 'images/Gem Green.png', 'images/Gem Orange.png'];
	this.gemX = [0, 101, 202, 303, 404];
	this.gemY = [50, 130, 215];
	this.collected = false;

	this.sprite = this.randomSprite();
	this.rndX = this.randomX();
	this.rndY = this.randomY();

	this.x = this.gemX[this.rndX];
	this.y = this.gemY[this.rndY];
};


Gems.prototype.render = function() {
	ctx.drawImage(Resources.get(this.gemSprite[this.sprite]), this.x, this.y);
};

//When this function is called it gives the gem object a new sprite and position.
Gems.prototype.reposition = function () {
	if(this.collected) {
		this.sprite = this.randomSprite();
		this.x = this.gemX[this.randomX()];
		this.y = this.gemY[this.randomY()];
		this.collected = false;
	}
};

Gems.prototype.randomSprite = function () {
	return (Math.random() * 2).toFixed(0);
};

Gems.prototype.randomX = function () {
	return (Math.random() * 4).toFixed(0);
};

Gems.prototype.randomY =function () {
	return (Math.random() * 2).toFixed(0);
};

var gem = new Gems();

//This class handles the level and how many lives the player has left.
function HandleElements () {
	this.levelThreshold = [200, 600, 1000, 1500, 2000];
	this.sprite = 'images/Heart_small.png';
}

//This function call the createNewLvl
HandleElements.prototype.checkLevel = function () {
	this.createNewLvl(0);
	this.createNewLvl(1);
	this.createNewLvl(2);
	this.createNewLvl(4);
};

//This function checks the curret score of the player. If the score is equal
//to the array element in the levelThreshold array it calls the createEnemy function,
//and sets the current levelThreshol element equal to -1. This is a number that
//player.score never will get and the level is "used up" (can't be called again).
HandleElements.prototype.createNewLvl = function (cellNumber) {
	if(player.score === this.levelThreshold[cellNumber]){
		createEnemy();
		this.levelThreshold[cellNumber] = -1;
	}
};

//This function output the score and how many lives the player has left on the screen.
//When the player has noe more lives left, it will show a game over screen.
HandleElements.prototype.render = function () {
	ctx.font = '35px Arial';
	ctx.fillStyle = 'black';
	ctx.fillText('Score: ' + player.score, 5, 40);

	if(player.life === 0) {
		ctx.fillRect(0, 0, 505, 606);
		ctx.fillStyle = 'white';
		ctx.font = '50px Arial';
		ctx.fillText('Game Over!' , 100, 100);
		ctx.font = '40px Arial';
		ctx.fillText('Your score was: ' + player.score, 75, 300);
	}

	this.lives();
};

//This function handles how many and where the hearts representing the
//remaing lives is printed to the screen.
HandleElements.prototype.lives = function () {
	var x = 380;

	for(var i = 0; i < player.life; i++) {
		ctx.drawImage(Resources.get(this.sprite), x, -10);
		x += 40;
	}
};