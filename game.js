window.addEventListener('load', function () {
	const canvas = document.getElementById('canvas1');
	const startscreenhintergrund = document.getElementById('starthintergrund');
	const highScore = localStorage.getItem('highScore') || 0;
	const ctx = canvas.getContext('2d');
	// canvas.width = window.innerWidth;
	// canvas.height = window.innerHeight;
	canvas.width = 1300;
	canvas.height = 620;
	startscreenhintergrund.style.width = canvas.width + 'px';
	startscreenhintergrund.style.height = canvas.height + 'px';
	let enemies = [];
	let ghosts = [];
	let ghosts2 = [];
	let ghosts3 = [];

	let score = 0;
	let life = 100;
	let geistertot = 0;
	let gameOver = false;

	let actions = {
		run: false,
		onGround: true,
		shoot: false,
	};

	class InputHandler {
		constructor() {
			this.keys = [];
			this.touchY = '';
			this.touchTreshold = 30;
			window.addEventListener('keydown', (e) => {
				if (
					(e.key === 's' ||
						e.key === 'w' ||
						e.key === 'a' ||
						e.key === 'd' ||
						e.key === 'e') &&
					this.keys.indexOf(e.key) === -1
				) {
					this.keys.push(e.key);
				} else if (e.key === 'Enter' && gameOver) {
					restartGame();
				}
				// console.log(e.key, this.keys);
			});
			window.addEventListener('keyup', (e) => {
				if (
					e.key === 's' ||
					e.key === 'w' ||
					e.key === 'a' ||
					e.key === 'd' ||
					e.key === 'e'
				) {
					this.keys.splice(this.keys.indexOf(e.key), 1);
				}
				// console.log(e.key, this.keys);
			});
			window.addEventListener('touchstart', (e) => {
				console.log('start');
				this.touchY = e.changedTouches[0].pageY;
			});
			window.addEventListener('touchmove', (e) => {
				const swipeDistance = e.changedTouches[0].pageY - this.touchY;
				if (
					swipeDistance < -this.touchTreshold &&
					this.keys.indexOf('swipe up ') === -1
				)
					this.keys.splice(this.keys.indexOf('swipe up'), 1, 'swipe up');
				else if (
					swipeDistance > this.touchTreshold &&
					this.keys.indexOf('swipe down ') === -1
				)
					this.keys.splice(this.keys.indexOf('swipe down'), 1, 'swipe down');

				if (gameOver) restartGame();

				console.log('moving');
			});
			window.addEventListener('touchend', (e) => {
				console.log(this.keys);
				console.log('end');
				this.keys.splice(this.keys.indexOf('swipe up'), 1);
				this.keys.splice(this.keys.indexOf('swipe down'), 1);
			});
		}
	}
	class Player {
		constructor(gameWidth, gameHeight, bulletController) {
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.width = 200;
			this.height = 200;
			this.x = 0;
			this.y = this.gameHeight - this.height;
			this.bulletController = bulletController;
			this.image = document.getElementById('playerImage');
			this.frameX = 0;
			//this.maxFrame = 8;
			this.frameY = 0;
			//this.fps = 20;
			// this.frameTimer = 0;
			// this.frameInterval = 1000/this.fps;
			this.speed = 0;
			this.vy = 0;
			this.weight = 0.5;
		}
		restart() {
			this.x = 100;
			this.y = this.gameHeight - this.height;
		}
		draw(context) {
			/* context.strokeStyle = 'pink';
            context.strokeRect(this.x,this.y, this.width, this.height);
            context.beginPath();
            context.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
            context.stroke(); */
			//context.drawImage(this.image, 0 * this.width, 0 * this.height, this.width, this.height, this.x, this.y, this.width, this.height);

			//für frames animierte bewegung
			context.drawImage(
				this.image,
				this.frameX * this.width,
				this.frameY * this.height,
				this.width,
				this.height,
				this.x,
				this.y,
				this.width,
				this.height
			);
			this.shoot();
		}
		update(input, enemies) {
			enemies.forEach((enemy) => {
				const dx = enemy.x + enemy.width / 2 - (this.x + this.width / 2);
				const dy = enemy.y + enemy.height / 2 - (this.y + this.height / 2);
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (distance < enemy.width / 2 + this.width / 2) {
					score++;
					const index = enemies.indexOf(enemy);
					enemies.splice(index, 1);
					//enemy.drawImage = false;
					//removeImage();
				}
			});

			ghosts.forEach((ghost) => {
				const dx = ghost.x + ghost.width / 2 - (this.x + this.width / 2);
				const dy = ghost.y + ghost.height / 2 - (this.y + this.height / 2);
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (distance < ghost.width / 2 + this.width / 2) {
					life--;
					if (life == 0) {
						gameOver = true;
					}
				}
			});

			ghosts2.forEach((ghost2) => {
				const dx = ghost2.x + ghost2.width / 2 - (this.x + this.width / 2);
				const dy = ghost2.y + ghost2.height / 2 - (this.y + this.height / 2);
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (distance < ghost2.width / 2 + this.width / 2) {
					life -= 1;
					console.log(life + ' leben');
					if (life == 0) {
						gameOver = true;
					}
				}
			});

			ghosts3.forEach((ghost3) => {
				const dx = ghost3.x + ghost3.width / 2 - (this.x + this.width / 2);
				const dy = ghost3.y + ghost3.height / 2 - (this.y + this.height / 2);
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (distance < ghost3.width / 2 + this.width / 2) {
					life -= 1;
					console.log(life + ' leben');
					if (life == 0) {
						gameOver = true;
					}
				}
			});

			/*  if(this.frameTimer > this.frameInterval){
                 if(this.frameX >= this.maxFrame)this.frameX = 0;
                 else this.frameX++;
                 this.frameTimer = 0;
             }else{
                 this.frameTimer += deltaTime;
             } */

			if (input.keys.indexOf('d') > -1) {
				this.speed = 5;
			} else if (input.keys.indexOf('a') > -1) {
				this.speed = -5;
				//&& this.onGround()
			} else if (input.keys.indexOf('s') > -1) {
				this.vy = this.vy + 1;

				// && score > 0
			} else if (input.keys.indexOf('e') > -1) {
				this.shootPressed = true;
				//score -= 1;
				//score--;

				if (score < 0) {
					score = 0;
				}
			} else {
				this.speed = 0;
				this.shootPressed = false;

				//this.vy = 0;
			}

			this.x += this.speed;
			if (this.x < 0) this.x = 0;
			//verschwindet wenn er an denn rechten rand kommt
			else if (this.x > this.gameWidth - this.width)
				this.x = this.gameWidth - this.width;
			// spirngen
			//this.y += this.vy;
			if (!this.onGround()) {
				this.vy += this.weight;
				this.maxFrame = 5;
			} else if (
				input.keys.indexOf('w') > -1 ||
				(input.keys.indexOf('swipe up') > -1 && this.onGround())
			) {
				this.vy -= 20;
			} else {
				this.vy = 0;
				this.maxFrame = 8;
			}

			// else if(this.onGround() && input.keys.indexOf('w') > -1){
			//     this.vy -= 20;
			if (this.y > this.gameHeight - this.height)
				this.y = this.gameHeight - this.height;
			//console.log('vy', this.vy);
			this.y += this.vy;
		}
		onGround() {
			return this.y >= this.gameHeight - this.height;
			//console.log("du hurensohn");
		}
		shoot() {
			if (this.shootPressed) {
				console.log('shoot');
				const speed = 5;
				const delay = 2;
				const damage = 1;
				const bulletX = this.x + this.width;
				const bulletY = this.y + this.height / 2;

				this.bulletController.shoot(bulletX, bulletY, speed, damage, delay);
			}
			/*  if(this.score > 0 ){
                 this.shootPressed = true;
             }
             
             else {
                 console.log("You can't shoot because your score is zero or below.");
              */
		}
		/* collideWith(sprite){
            return this.player.some(player =>{
                if(player.collideWith(sprite)){
                    this.player.splice(this.player.indexOf(player),1);
                    return true;
                }
                return false;
            });
        }
            */
	}

	class Background {
		constructor(gameWidth, gameHeight) {
			this.gameWidth = canvas.width;
			this.gameHeight = canvas.height;
			this.image = document.getElementById('backgroundImage');
			this.x = 0;
			this.y = 0;
			this.width = 1200;
			this.height = 620;
			this.speed = 2;
		}
		draw(context) {
			context.drawImage(this.image, this.x, this.y, this.width, this.height);
			context.drawImage(
				this.image,
				this.x + this.width - this.speed,
				this.y,
				this.width,
				this.height
			);
		}
		update() {
			this.x -= this.speed;
			if (this.x < 0 - this.width) this.x = 0;
		}
		restart() {
			this.x = 0;
		}
	}
	class Enemy {
		constructor(gameWidth, gameHeight) {
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.width = 160;
			this.height = 170;
			this.image = document.getElementById('enemyImage');
			this.x = this.gameWidth;
			this.y = this.gameHeight - this.height;
			this.frameX = 0;
			this.speed = 4;
			this.markedForDeletion = false;
		}
		draw(context) {
			/* context.strokeStyle = 'white';
            context.strokeRect(this.x, this.y, this.width, this.height );
            context.beginPath();
            context.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
            context.stroke(); */
			context.drawImage(
				this.image,
				this.frameX * this.width,
				0,
				this.width,
				this.height,
				this.x,
				this.y,
				this.width,
				this.height
			);
		}
		update() {
			this.x -= this.speed;
			if (this.x < 0 - this.width) {
				this.markedForDeletion = true;
				console.log('markedForDeletion ' + this.markedForDeletion);
				//score++;
			}
		}
		/* collideWith(sprite){
            if(this.x < sprite.x + sprite.width &&
                this.x + this.width > sprite.x &&
                this.y < sprite.y + sprite.height &&
                this.y + this.height > sprite.y){
                   return true;
                }
                return false;
        }  */
	}

	class Ghost {
		constructor(gameWidth, gameHeight) {
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.width = 160;
			this.height = 150;
			this.image = document.getElementById('ghost1Image');
			this.image.classList.add('scroll-animation');
			this.x = this.gameWidth;
			this.y = this.gameHeight - this.height;
			this.frameX = 0;
			this.speed = 4;
			this.health = 5;
			this.markedForDeletion = false;
		}
		draw(context) {
			context.drawImage(
				this.image,
				this.frameX * this.width,
				0,
				this.width,
				this.height,
				this.x,
				this.y,
				this.width,
				this.height
			);
			if (this.health > 1) {
				ctx.strockStyle = 'white';
			} else {
				ctx.strockStyle = this.color;
			}
		}
		update() {
			this.x -= this.speed;
			if (this.x < 0 - this.width) {
				this.markedForDeletion = true;
				console.log('markedForDeletion2 ' + this.markedForDeletion);
				//score++;
			}
		}

		takeDamage(damage) {
			this.health -= damage;
		}
		/* collideWith(sprite){
           if(
               this.x < sprite.x + sprite.width &&
               this.x + this.width > sprite.x &&
               this.y < sprite.y + sprite.height &&
               this.y + this.height > sprite.y
           ){
               sprite.takeDamage(this.damage);
               return true;
           }
           return false; 
       }  */
	}

	class Ghost2 {
		constructor(gameWidth, gameHeight) {
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.width = 160;
			this.height = 200;
			this.image = document.getElementById('ghost2Image');
			this.x = this.gameWidth;
			this.y = this.gameHeight - this.height;
			this.frameX = 0;
			this.speed = 4;
			this.health = 1;
			this.markedForDeletion = false;
		}
		draw(context) {
			context.drawImage(
				this.image,
				this.frameX * this.width,
				0,
				this.width,
				this.height,
				this.x,
				this.y,
				this.width,
				this.height
			);
			if (this.health > 1) {
				ctx.strockStyle = 'white';
			} else {
				ctx.strockStyle = this.color;
			}
		}
		update() {
			this.x -= this.speed;
			if (this.x < 0 - this.width) {
				this.markedForDeletion = true;
				console.log('markedForDeletion2 ' + this.markedForDeletion);
				//score++;
			}
		}

		takeDamage(damage) {
			this.health -= damage;
		}
	}

	class Ghost3 {
		constructor(gameWidth, gameHeight) {
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.width = 250;
			this.height = 250;
			this.image = document.getElementById('ghost3Image');
			this.x = this.gameWidth;
			this.y = this.gameHeight - this.height;
			this.frameX = 0;
			this.speed = 2;
			this.health = 10;
			this.markedForDeletion = false;
		}
		draw(context) {
			context.drawImage(
				this.image,
				this.frameX * this.width,
				0,
				this.width,
				this.height,
				this.x,
				this.y,
				this.width,
				this.height
			);
			if (this.health > 1) {
				ctx.strockStyle = 'white';
			} else {
				ctx.strockStyle = this.color;
			}
		}
		update() {
			this.x -= this.speed;
			if (this.x < 0 - this.width) {
				this.markedForDeletion = true;
				console.log('markedForDeletion2 ' + this.markedForDeletion);
				//score++;
			}
		}

		takeDamage(damage) {
			this.health -= damage;
		}
	}

	class Bullet {
		color = ['blue', 'purple', 'yellow', 'orange', 'pink'];
		constructor(x, y, speed, damage) {
			this.x = x;
			this.y = y;
			this.speed = speed;
			this.damage = damage;

			this.width = 15;
			this.height = 5;
			this.color = this.color[Math.floor(Math.random() * this.color.length)];
		}
		draw(ctx) {
			ctx.fillStyle = this.color;
			this.x += this.speed;
			/* ctx.shadowBlur = 20;
            ctx.shadowColor = "red"; */

			ctx.fillRect(this.x, this.y, this.width, this.height);
			/* ctx.shadowColor = "#d53";
            ctx.shadowBlur = 20;
            ctx.lineJoin = "bevel";
            ctx.lineWidth = 2; */
		}
		collideWith(sprite) {
			if (
				this.x < sprite.x + sprite.width &&
				this.x + this.width > sprite.x &&
				this.y < sprite.y + sprite.height &&
				this.y + this.height > sprite.y
			) {
				sprite.takeDamage(this.damage);
				return true;
			}
			return false;
		}
	}

	class BulletController {
		bullets = [];
		timerTillNextBullet = 0;
		constructor(canvas) {
			this.canvas = canvas;
		}

		shoot(x, y, speed, damage, delay) {
			if (this.timerTillNextBullet <= 0) {
				if (this.bullets.length < 3) {
					if (score > 0) {
						this.bullets.push(new Bullet(x, y, speed, damage));
						score -= 1;
					}
				}

				this.timerTillNextBullet = delay;
			}

			this.timerTillNextBullet--;
		}

		isBulletOffScreen(bullet) {
			return bullet.y <= -bullet.height;
		}
		draw(ctx) {
			console.log(this.bullets.length);
			this.bullets.forEach((bullet) => {
				if (this.isBulletOffScreen(bullet)) {
					const index = this.bullets.indexOf(bullet);
					this.bullets.splice(index, 1);
				}
				bullet.draw(ctx);
			});
		}

		collideWith(sprite) {
			return this.bullets.some((bullet) => {
				if (bullet.collideWith(sprite)) {
					this.bullets.splice(this.bullets.indexOf(bullet), 1);
					return true;
				}
				return false;
			});
		}

		isBulletOffScreen(bullet) {
			return bullet.y <= -bullet.height;
		}
	}

	function handleEnemies(deltaTime) {
		if (enemyTimer > enemyInterval + randomEnemyInterval) {
			enemies.push(new Enemy(canvas.width, canvas.height));
			console.log(enemies);
			randomEnemyInterval = Math.random() * 1000 + 500;
			enemyTimer = 0;
		} else {
			enemyTimer += deltaTime;
		}

		enemies.forEach((enemy) => {
			enemy.draw(ctx);
			enemy.update();
		});
		enemies = enemies.filter((enemy) => !enemy.markedForDeletion);
	}

	function handleGostes(deltaTime) {
		if (ghostTimer > ghostInterval + randomGhostInterval) {
			ghosts.push(new Ghost(canvas.width, canvas.height));
			console.log(ghosts);
			randomGhostInterval = Math.random() * 1000 + 500;
			ghostTimer = 0;
		} else {
			ghostTimer += deltaTime;
		}

		ghosts = ghosts.filter((ghost) => !ghost.markedForDeletion);
	}
	function handleGostes2(deltaTime) {
		if (ghost2Timer > ghost2Interval + randomGhost2Interval) {
			ghosts2.push(new Ghost2(canvas.width, canvas.height));
			console.log(ghosts2);
			randomGhost2Interval = Math.random() * 1000 + 500;
			ghost2Timer = 0;
		} else {
			ghost2Timer += deltaTime;
		}

		ghosts2 = ghosts2.filter((ghost2) => !ghost2.markedForDeletion);
	}

	function handleGostes3(deltaTime) {
		if (ghost3Timer > ghost3Interval + randomGhost3Interval) {
			ghosts3.push(new Ghost3(canvas.width, canvas.height));
			console.log(ghosts2);
			randomGhost3Interval = Math.random() * 1000 + 500;
			ghost3Timer = 0;
		} else {
			ghost3Timer += deltaTime;
		}

		ghosts2 = ghosts2.filter((ghost3) => !ghost3.markedForDeletion);
	}

	// function drawLife(context) {
	//     context.fillStyle = 'red';
	//     context.fillRect(0, 0, life, 10);
	// }

	function displayStatusText(context) {
		context.font = '40px Helvetica';
		context.fillStyle = 'white';
		context.fillText('Waffenladung: ' + score, 20, 50);
		context.fillStyle = 'black';
		context.fillText('Waffenladung: ' + score, 22, 52);
		context.font = '40px Helvetica';
		context.fillStyle = 'white';
		/* context.fillText('life: ' + life, 50, 85);
        context.fillStyle = 'black';
        context.fillText('life: ' + life, 52, 87);
        context.font = '40px Helvetica';
        context.fillStyle = 'white'; */
		context.fillText(geistertot + ' Geister', 1000, 50);
		context.fillStyle = 'black';
		context.fillText(geistertot + ' Geister', 1002, 52);
		context.fillStyle = 'white';
		context.clearRect(50, 85, 105, 25);
		context.fillStyle = 'white';
		context.fillRect(50, 85, 105, 25);
		context.fillStyle = 'red';
		context.fillRect(52, 87, life, 20);

		if (gameOver) {
			context.textAlign = 'center';
			context.fillStyle = 'white';
			context.fillText('GAME OVER', canvas.width / 2, 200);
		}
	}

	/* function endGame() {
        if (score > highScore) {
            highScore = score;
            document.getElementById('highScoreDisplay').innerText = 'High Score: ' + highScore;
            localStorage.setItem('highScore', highScore);
            console.log("highscore: " + highScore);
        }
    } */

	/* function removeImage(){
        var  enemy=document.getElementById("geld2.png");
        enemy.remove();
    
    }
     */
	function restartGame() {
		player.restart();
		background.restart();
		enemies = [];
		ghosts = [];
		ghosts2 = [];
		ghosts3 = [];

		score = 0;
		life = 100;
		geistertot = 0;
		gameOver = false;
		animate(0);
	}
	const input = new InputHandler();
	const bulletController = new BulletController(canvas);
	const player = new Player(canvas.width, canvas.height, bulletController);
	const background = new Background(canvas.width, canvas.height);

	let lastTime = 0;
	let enemyTimer = 0;
	let enemyInterval = 280;
	let randomEnemyInterval = Math.random() * 1000 + 500;
	let ghostTimer = 0;
	let ghostInterval = 7780;
	let randomGhostInterval = Math.random() * 1080 + 470;
	let ghost2Timer = 0;
	let ghost2Interval = 1780;
	let randomGhost2Interval = Math.random() * 1080 + 470;
	let ghost3Timer = 0;
	let ghost3Interval = 15780;
	let randomGhost3Interval = Math.random() * 1080 + 470;

	// video.onended = function() {
	//     button.style.display = 'block';
	// };

	function animate(timeStamp) {
		const deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		background.draw(ctx);
		background.update(input);
		bulletController.draw(ctx);
		player.draw(ctx);
		player.update(input, enemies);
		ghosts.forEach((ghost) => {
			if (bulletController.collideWith(ghost)) {
				if (ghost.health <= 0) {
					const index = ghosts.indexOf(ghost);
					ghosts.splice(index, 1);
					geistertot++;
				}
			} else {
				ghost.draw(ctx);
				ghost.update();
			}
		});
		ghosts2.forEach((ghost2) => {
			if (bulletController.collideWith(ghost2)) {
				if (ghost2.health <= 0) {
					const index = ghosts2.indexOf(ghost2);
					ghosts2.splice(index, 1);
					geistertot++;
				}
			} else {
				ghost2.draw(ctx);
				ghost2.update();
			}
		});
		ghosts3.forEach((ghost3) => {
			if (bulletController.collideWith(ghost3)) {
				if (ghost3.health <= 0) {
					const index = ghosts3.indexOf(ghost3);
					ghosts3.splice(index, 1);
					geistertot++;
				}
			} else {
				ghost3.draw(ctx);
				ghost3.update();
			}
		});
		/* enemies.forEach(enemy => {
           if(player.collideWith(enemy)){
            const index = enemies.indexOf(enemy)
            enemies.splice(index,1);
           }else{
            enemy.draw(ctx);
            enemy.update();
           }
    
        }); */

		displayStatusText(ctx);

		if (gameOver) {
			endGame();
		}

		handleEnemies(deltaTime);
		handleGostes(deltaTime);
		handleGostes2(deltaTime);
		handleGostes3(deltaTime);

		if (!gameOver) requestAnimationFrame(animate);
	}
	document.getElementById('startButton').addEventListener('click', function () {
		// Insert game start logic here
		animate(0);
		console.log('Game Started!');
		this.disabled = true; // Disables the button after one click
		this.style.display = 'none';
		if (startscreenhintergrund) {
			startscreenhintergrund.style.display = 'none'; // This will make the image disappear entirely
		}
	});
});
