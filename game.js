window.addEventListener('load', function () {
	const canvas = document.getElementById('canvas1');
	const startscreenhintergrund = document.getElementById('starthintergrund');
	const restartButton = document.getElementById('restart');
	const highScore = localStorage.getItem('highScore') || 0;
	const ctx = canvas.getContext('2d');

	//canvas.width = window.innerWidth;
	// canvas.height = window.innerHeight;
	canvas.width = 1300;
	canvas.height = 620;
	Audiomute = false;
	var timerInterval = null;
	coinwert = 2;
	steueranleitung.width = 350;
	steueranleitung.height = 200;
	//to do handy größe
	
	if (
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		)
	) {
		gameend.weight = 250;
	   gameend.height = 200;
	   restartButton.style.width = '70px';
		restartButton.style.height = '20px';
		
	}else {
		restartButton.style.width = '170px';
		restartButton.style.height = '50px';
		gameend.weight = 350;
	   gameend.height = 300;
	}

	gameplay = false;
	//restartbild.weight = 250;
	//restartbild.height = 50;
	startscreenhintergrund.style.width = canvas.width + 'px';
	startscreenhintergrund.style.height = canvas.height + 'px';
	
	let coins = [];
	let ghosts = [];

	const font = new FontFace(
		'CustomFont',
		'url(PixelGamer/Web-TT/PixelGamer-Extrude.woff2)'
	);
	font
		.load()
		.then(() => {
			document.fonts.add(font);
			// console.log('Font loaded successfully!');
		})
		.catch((error) => {
			console.log('Error loading font:', error);
		});
	const font2 = new FontFace(
		'CustomFont2',
		'url(PixelGamer/Web-TT/PixelGamer-Half.woff2)'
	);
	font2
		.load()
		.then(() => {
			document.fonts.add(font2);
			console.log('Font loaded successfully!');
		})
		.catch((error) => {
			console.log('Error loading font:', error);
		});
	const font3 = new FontFace(
		'CustomFont3',
		'url(PixelGamer/Web-TT/PixelGamer-Regular.woff2)'
	);
	font3
		.load()
		.then(() => {
			document.fonts.add(font3);
			console.log('Font loaded successfully!');
		})
		.catch((error) => {
			console.log('Error loading font:', error);
		});

	let gametimer = 0;
	let gametimerstart = gametimer * 60;

	const countdownEl = document.getElementById('countdown');

	let score = 0;
	let life = 100;
	let geistertot = 0;
	let gameOver = false;

	let actions = {
		run: false,
		onGround: true,
  		shoot: false
	};

	class InputHandler {
		constructor() {
			this.keys = [];
			this.touchY = '';
			this.touchTreshold = 30;
			window.addEventListener('keydown', (e) => {
				if (
					(e.key === 's' ||
						e.key === ' ' ||
						e.key === 'a' ||
						e.key === 'd' ||
						e.key === 'e' ||
						e.key === 'ArrowRight' ||
						e.key === 'ArrowLeft' ||
						e.key === 'Enter') &&
					this.keys.indexOf(e.key) === -1
				) {
					this.keys.push(e.key);
				} 
				// console.log(e.key, this.keys);
			});
			window.addEventListener('keyup', (e) => {
				if (
					e.key === 's' ||
					e.key === ' ' ||
					e.key === 'a' ||
					e.key === 'd' ||
					e.key === 'e' ||
					e.key === 'ArrowRight' ||
					e.key === 'ArrowLeft' ||
					e.key === 'Enter'
				) {
					this.keys.splice(this.keys.indexOf(e.key), 1);
				}
				// console.log(e.key, this.keys);
			});
			window.addEventListener('touchstart', (e) => {
				// console.log('start');
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

				if (gameOver) {
					restartGame();
				}

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
		update(input, coins) {
			coins.forEach((coin) => {
				const dx = coin.x + coin.width / 4 - (this.x + this.width / 4);
				const dy = coin.y + coin.height / 4 - (this.y + this.height / 4);
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (distance < coin.width / 4 + this.width / 4) {
					console.log('schuss');
					score ++;
					score ++;
					console.log('ammo' + score);
					if(!Audiomute){
					document.getElementById('item').pause();
					document.getElementById('item').currentTime = 0;
					document.getElementById('item').play();
					}
					console.log('munition' + score);
					const index = coins.indexOf(coin);
					coins.splice(index, 1);

					//enemy.drawImage = false;
					//removeImage();
				}
			});

			ghosts.forEach((ghost) => {
				const dx = ghost.x + ghost.width / 12 - (this.x + this.width / 12);
				const dy = ghost.y + ghost.height / 12 - (this.y + this.height / 12);
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (distance < ghost.width / 12 + this.width / 12) {
					life--;
					if(!Audiomute){
					document.getElementById('damage').play();
					}
					if (life == 0) {
						if(!Audiomute){
						document.getElementById('au').play();
						}
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

			if (
				input.keys.indexOf('d') > -1 ||
				input.keys.indexOf('ArrowRight') > -1
			) {
				this.speed = 3;
			} else if (
				input.keys.indexOf('a') > -1 ||
				input.keys.indexOf('ArrowLeft') > -1
			) {
				this.speed = -3;
				//&& this.onGround()
			} else if (input.keys.indexOf('s') > -1) {
				this.vy = this.vy + 1;

				// && score > 0
			} /* else if (input.keys.indexOf('e') > - 1 || input.keys.indexOf('touchstart') > - 1) {
                this.shootPressed = true;
                //score -= 1;
                //score--;

                if (score < 0) {
                    score = 0;
                }



            } */ else if (
				input.keys.includes('e') ||
				(input.keys.includes('e') && input.keys.includes(' ')) ||
				(input.keys.indexOf('d') > -1 && input.keys.includes('e')) ||
				(input.keys.indexOf('ArrowRight') > -1 && input.keys.includes('e'))
			) {
				this.shootPressed = true;

				if (score < 0) {
					score = 0;
				}
			} else {
				this.speed = 0;
				this.shootPressed = false;

				//this.vy = 0;
			}
			document.addEventListener(
				'touchstart',
				function (event) {
					this.shootPressed = true;
					// Handle touchstart event for shooting
				}.bind(this)
			);

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
				input.keys.indexOf(' ') > -1 ||
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
				const speed = 5;
				const delay = 4;
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
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.image = document.getElementById('backgroundImage');
			this.x = 0;
			this.y = 0;
			this.width = gameWidth;
			this.height = gameHeight;
			this.speed = 3;
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
	class Coin {
		constructor(gameWidth, gameHeight) {
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.width = 160;
			this.height = 170;
			this.image = document.getElementById('enemyImage');
			this.x = this.gameWidth;
			this.y = this.gameHeight - this.height - Math.random() * 467;
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
				// console.log('markedForDeletion ' + this.markedForDeletion);
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

	class Geistertyp {
		constructor(health, speed, image, spanhoehe) {
			this.health = health;
			this.speed = speed;
			this.spanhoehe = spanhoehe;
			this.image = image;
		}
	}

	class Ghost {
		constructor(gameWidth, gameHeight, geistertyp) {
			this.gameWidth = gameWidth;
			this.gameHeight = gameHeight;
			this.width = 160;
			this.height = 150;
			this.image = geistertyp.image;
			this.x = this.gameWidth;
			this.y = this.gameHeight - this.height - geistertyp.spanhoehe;
			this.frameX = 0;
			this.speed = geistertyp.speed;
			this.health = geistertyp.health;
			this.markedForDeletion = false;
			this.initialY = this.y;
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
			this.initialY = this.initialY;
			// var step = -1
			this.x -= this.speed;
			if (this.x < 0 - this.width) {
				this.markedForDeletion = true;
				// console.log('markedForDeletion2 ' + this.markedForDeletion);
				//score++;
			}

			// console.log('y: ' + this.y);

			//self.y = -self.y;
			this.y = this.initialY + Math.sin(this.x / 200) * 25;
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
	function drawbullets(ctx){
		
		
			

	}

	class Bullet {
		color = [  'yellow', 'orange', 'white'];
		constructor(x, y, speed, damage) {
			this.x = x;
			this.y = y;
			this.speed = speed;
			this.damage = damage;

			this.width = 25;
			this.height = 10;
			this.color = this.color[Math.floor(Math.random() * this.color.length)];
		}
		draw(ctx) {
			
			ctx.fillStyle = this.color;
			this.x += this.speed;
			ctx.shadowColor = this.color;
			ctx.shadowBlur = 10;
			/* ctx.shadowOffsetX = 5;
			ctx.shadowOffsetY = 5; */
			ctx.lineJoin = 'bevel';
			ctx.fillRect(this.x, this.y, this.width, this.height);
			
			ctx.shadowColor = "transparent";
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
				if (score > 0) {
					if(this.bullets.length < 3){
					this.bullets.push(new Bullet(x, y, speed, damage));
					return;
					}
					score -= 1;
					
				}

				this.timerTillNextBullet = delay;
			}

			this.timerTillNextBullet--;
		}

		isBulletOffScreen(bullet) {
			console.log(this.bullets.length);
			return bullet.x >= canvas.width;
		}
		
		draw(ctx) {
			// console.log(this.bullets.length);
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

		/* isBulletOffScreen(bullet) {
			console.log(this.bullets.length);
			return bullet.x >= canvas.width;
		} */
		
	}
	
	function handleCoins(deltaTime) {
		if (coinTimer > coinInterval + randomCoinInterval) {
			coins.push(new Coin(canvas.width, canvas.height));
			// console.log(enemies);
			randomCoinInterval = Math.random() * 1000 + 500;
			coinTimer = 0;
		} else {
			coinTimer += deltaTime;
		}

		coins.forEach((coin) => {
			coin.draw(ctx);
			coin.update();
		});
		coins = coins.filter((coin) => !coin.markedForDeletion);
	}

	const geistertyp = [
		new Geistertyp(3, 4, this.document.getElementById('ghost1Image'), 40),
		new Geistertyp(1, 3, this.document.getElementById('ghost2Image'), 45),
		new Geistertyp(3, 4, this.document.getElementById('ghost3Image'), 50),
		new Geistertyp(1, 10, this.document.getElementById('ghost4Image'), 60),
		new Geistertyp(1, 6, this.document.getElementById('ghost5Image'), 43),
		new Geistertyp(3, 4, this.document.getElementById('ghost6Image'), 51),
		new Geistertyp(1, 1, this.document.getElementById('ghost7Image'), 75),
		new Geistertyp(1, 2, this.document.getElementById('ghost8Image'), 55),
	];

	function handleGhosts(deltaTime) {
		if (ghostTimer > ghostInterval + randomGhostInterval) {
			ghosts.push(
				new Ghost(
					canvas.width,
					canvas.height,
					geistertyp[Math.floor(Math.random() * geistertyp.length)]
				)
			);
			// console.log(ghosts);
			randomGhostInterval = Math.random() * 1000 + 500;
			ghostTimer = 0;
		} else {
			ghostTimer += deltaTime;
		}

		ghosts = ghosts.filter((ghost) => !ghost.markedForDeletion);
	}

	// function drawLife(context) {
	//     context.fillStyle = 'red';
	//     context.fillRect(0, 0, life, 10);
	// }
	



	function drawFancyText(text, x, y, alignment) {
		// ammo
		ctx.font = '30px CustomFont';
		ctx.textAlign = alignment;
		ctx.fillStyle = 'white';
		ctx.fillText(text, x, y);
		ctx.font = '30px CustomFont3';
		ctx.fillStyle = '#867ade';
		ctx.fillText(text, x, y);
		ctx.font = '30px CustomFont2';
		ctx.fillStyle = '#ae51b6';
		ctx.fillText(text, x, y);
		ctx;
	}

	function displayStatusText(context) {
		
		// ammo
		drawFancyText('AMMO: ', 120, 50, 'left');

		// health
		drawFancyText('HEALTH: ', 120, 80, 'left');

		// score
		drawFancyText(`ENEMIES: ${geistertot}`, 1120, 50, 'right');

		// time
		let minutes = Math.floor(gametimerstart / 60) % 60;
		let seconds = Math.floor(gametimerstart) % 60;

		context.fillStyle = '40px CustomFont';
		ctx.fillStyle = 'white';
		//context.fillText('__ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ __ ', 1160,120);

		if (seconds < 10) {
			seconds = `0${seconds}`;
		}

		if (minutes < 10) {
			minutes = `0${minutes}`;
		}

		drawFancyText(`TIME: ${minutes}:${seconds}`, 700, 50, 'right');

		// health bar
		context.lineJoin = 'bevel';
		context.lineWidth = 3.5;
		context.strokeStyle = 'white';
		context.strokeRect(242, 60, 104, 21);
		context.fillStyle = '#c18178';
		context.lineJoin = 'bevel';
		context.fillRect(242, 60, life, 20);

		/*  context.fillStyle = 'white';
        context.clearRect(200, 48, 105, 25);   */
		/* context.fillStyle = "white";
        context.fillRect(200, 48, 105, 25); */

		// ammo bar
		context.lineJoin = 'bevel';
		context.lineWidth = 3.5;
		context.strokeStyle = 'white';
		context.strokeRect(242, 30, 104, 21);
		context.fillStyle = '#867ade';
		context.lineJoin = 'bevel';
		/* if(score >= 104){
			context.fillRect(242, 30, 104, 20);
		}else{
			context.fillRect(242, 30, score, 20);
		} */
		const x = 242;
		const y = 30;
		const minWidth = 104;
		const width = Math.min(minWidth, score);

		context.fillRect(x, y, width, 20);

		
		window.addEventListener('blur', function() {
		document.getElementById('startsound').pause();
		document.getElementById('au').pause();
		document.getElementById('damage').pause();
		document.getElementById('geistertot').pause();
		document.getElementById('hintergrunsound').pause();
		document.getElementById('item').pause();
			
		  });
		  
		// timer

		if (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			)
		) {
			document.querySelector('body').style.overscrollBehaviorY = 'contain';
			window.scrollTo(0, 1);
		}

		if (gameOver) {
			let endscrem = document.getElementById('gameend');
			endscrem.style.display = 'block';
			var gameOverButton = document.getElementById('spenden');
			gameOverButton.style.outline = 'transparent';
			if (
				/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
					navigator.userAgent
				)
			) {
				gameOverButton.style.width = '245px';
				gameOverButton.style.height = '200px';
				
			}else{
				gameOverButton.style.width = '375px';
				gameOverButton.style.height = '300px';

			}
	
			

			gameOverButton.style.display = 'block';

			document.getElementById('hintergrunsound').pause();
			//var restartbild = document.getElementById('restartbild');
			//restartbild.style.display = 'block';
			
			
	
			restartButton.style.width = '170px';
			restartButton.style.height = '50px';

			restartButton.style.display = 'block';

			document.getElementById('restart').addEventListener(
				'click',
				function () {
					restartGame();
					restartButton.style.display = 'none';
					restartbild.style.display = 'none';
					endscrem.style.display = 'none';
					gameOverButton.style.display = 'none';
				},
				{ once: true }
			);

			/* context.textAlign = 'center';
            context.fillStyle = 'white';
            context.fillText('GAME OVER', canvas.width / 2, 200); */
		}
	}
	
	const soundbutton = document.getElementById("soundbutton");
	soundbutton.style.position = 'absolute';
	
	
	
	
    soundbutton.style.top = '27%';
    soundbutton.style.left = '90%';
    soundbutton.style.transform = 'translate(-50%, -50%)';
	soundbutton.style.width = '70px';
    soundbutton.style.height = '20px';
	
	soundbutton.style.fontFamily = "CustomFont3";
	soundbutton.style.color = '#ae51b6';
	soundbutton.style.fontSize = "10px";


	
	
	soundbutton.addEventListener("click", function() {
		Audiomute = true;
		document.getElementById('startsound').pause();
		document.getElementById('au').pause();
		document.getElementById('damage').pause();
		document.getElementById('geistertot').pause();
		document.getElementById('hintergrunsound').pause();
		document.getElementById('item').pause();
		soundbutton.innerHTML = "Sound";
		
		
		
	});
   


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
		document.getElementById("soundbutton").disabled = false;
		clearInterval(timerInterval);
		timerInterval = setInterval(updateTimer, 1000);
		player.restart();
		background.restart();
		coins = [];
		ghosts = [];
		Audiomute = false;
		document.getElementById('startsound').play();
		document.getElementById('hintergrunsound').play();
		//document.getElementById('startsound').volume=50;
		ghostInterval = 2780;
		gametimerstart = 0;
		score = 0;
		life = 100;
		geistertot = 0;
		gameOver = false;
		animate(0);
	}
	function updateTimer() {
		console.log('tick');
		console.log('interval ' + ghostInterval);
		gametimerstart++;
		gametimerstart = gametimerstart + 1;
			if (geistertot >= 5 ) {
			ghostInterval = 1000;
			if (geistertot >= 15) {
				console.log('hiiii');
				ghostInterval = 100;
				if (geistertot >= 20 ) {
					ghostInterval -= 200;
					/* if (geistertot >= Math.random() * 18 + 78 ) {
						console.log('yes');
						ghostInterval -= 10000;
						if (gameOver) {
							ghostInterval = 0;
						}
					} */
				
				}
			}
			
		
		}
        
		//console.log("intervale: " + ghostInterval);
	}

	const input = new InputHandler();
	const bulletController = new BulletController(canvas);
	const player = new Player(canvas.width, canvas.height, bulletController);
	const background = new Background(canvas.width, canvas.height);

	let lastTime = 0;
	let coinTimer = 0;
	let coinInterval = 80;
	let randomCoinInterval = Math.random() * 1000 + 500;
	let ghostTimer = 0;
	let ghostInterval = 2780;
	let randomGhostInterval = Math.random() * 1080 + 470;

	// video.onended = function() {
	//     button.style.display = 'block';
	// };

	function animate(timeStamp) {
		const deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;
		gameplay = true;
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		background.draw(ctx);
		background.update(input);
		bulletController.draw(ctx);
		player.draw(ctx);
		player.update(input, coins);
		soundbutton.style.display = 'block'
		ghosts.forEach((ghost) => {
			if (bulletController.collideWith(ghost)) {
				if (ghost.health <= 0) {
					const index = ghosts.indexOf(ghost);
					ghosts.splice(index, 1);
					if(!Audiomute){
					document.getElementById('geistertot').play();
					}
					geistertot++;
				}
			} else {
				ghost.draw(ctx);
				ghost.update();
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
		/* setInterval
                if (gameOver) {
                    endGame();
                } */
		setTimeout(function () {
			handleGhosts(deltaTime);
		}, 5000);
		handleCoins(deltaTime);
		if (!gameOver) requestAnimationFrame(animate);
	}

	// Apply the new size and position to the button
	var starten = document.getElementById('startButton');

	document.getElementById('startButton').addEventListener('click', function () {
		let steueranleitung = document.getElementById('steueranleitung');
		let steueranleitunghandy = document.getElementById('steueranleitunghandy');
		
		
		// Insert game start logic here
		
		
		if (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			)
		) {
			background.draw(ctx);
			background.update(input);
			steueranleitunghandy.style.display = 'block';
		} else {
			background.draw(ctx);
			background.update(input);
			steueranleitung.style.display = 'block';
		}

		

		document.addEventListener('keydown', function (event) {
			if (event.code === 'Enter') {
				steuerungbackground.style.display = 'none';
				steueranleitung.style.display = 'none';
				steueranleitunghandy.style.display = 'none';
				if (gameplay == false) {
					document.getElementById('startsound').play();
				document.getElementById('hintergrunsound').play();
				timerInterval = setInterval(updateTimer, 1000);
					animate(0);
				}
			}
		});
		document.addEventListener(
			'touchstart',
			function (event) {
				steueranleitung.style.display = 'none';
				steueranleitunghandy.style.display = 'none';
				

				if (gameplay == false) {
					timerInterval = setInterval(updateTimer, 1000);
				document.getElementById('startsound').play();
				document.getElementById('hintergrunsound').play();
					animate(0);
				}
			}.bind(this)
		);

		
		console.log('Game Started!');
		this.disabled = true; // Disables the button after one click
		this.style.display = 'none';
		if (startscreenhintergrund) {
			startscreenhintergrund.style.display = 'none'; // This will make the image disappear entirely
		}
	});
});
