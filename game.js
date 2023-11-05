window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const startscreenhintergrund = document.getElementById('starthintergrund');
    const highScore = localStorage.getItem('highScore') || 0;
    const ctx = canvas.getContext('2d');

    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight; 
    canvas.width = 1300;
    canvas.height = 620;

    var timerInterval = null;
    
    steueranleitung.width = 250;
    steueranleitung.height = 200;
    gameend.weight = 350;
    gameend.height = 300;
    restartbild.weight = 250;
    restartbild.height = 50;
    startscreenhintergrund.style.width = canvas.width + 'px';
    startscreenhintergrund.style.height = canvas.height + 'px';
    let enemies = [];
    let ghosts = [];

	const font = new FontFace('CustomFont', 'url(PixelGamer/Web-TT/PixelGamer-Extrude.woff2)');
        font.load().then(() => {
        document.fonts.add(font);
        console.log('Font loaded successfully!');
        }).catch((error) => {
        console.log('Error loading font:', error);
        });
        const font2 = new FontFace('CustomFont2', 'url(PixelGamer/Web-TT/PixelGamer-Half.woff2)');
        font2.load().then(() => {
        document.fonts.add(font2);
        console.log('Font loaded successfully!');
        }).catch((error) => {
        console.log('Error loading font:', error);
        });
        const font3 = new FontFace('CustomFont3', 'url(PixelGamer/Web-TT/PixelGamer-Regular.woff2)');
        font3.load().then(() => {
        document.fonts.add(font3);
        console.log('Font loaded successfully!');
        }).catch((error) => {
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
            window.addEventListener('keydown', e => {

                if ((e.key === 's' ||
                    e.key === 'w' ||
                    e.key === 'a' ||
                    e.key === 'd' ||
                    e.key === 'e'
                )
                    && this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key);
                } else if (e.key === 'Enter' && gameOver) {
                    restartGame();
                }
                // console.log(e.key, this.keys);

            });
            window.addEventListener('keyup', e => {

                if (e.key === 's' ||
                    e.key === 'w' ||
                    e.key === 'a' ||
                    e.key === 'd' ||
                    e.key === 'e') {
                    this.keys.splice(this.keys.indexOf(e.key), 1);


                }
                // console.log(e.key, this.keys);


            });
            window.addEventListener('touchstart', e => {
                console.log('start');
                this.touchY = e.changedTouches[0].pageY

            });
            window.addEventListener('touchmove', e => {
                const swipeDistance = e.changedTouches[0].pageY - this.touchY;
                if (swipeDistance < -this.touchTreshold && this.keys.indexOf('swipe up ') === -1) this.keys.splice(this.keys.indexOf('swipe up'), 1, 'swipe up');
                else if (swipeDistance > this.touchTreshold && this.keys.indexOf('swipe down ') === -1) this.keys.splice(this.keys.indexOf('swipe down'), 1, 'swipe down');

                if (gameOver) {



                    restartGame();


                }


                console.log('moving');
            });
            
            window.addEventListener('touchend', e => {

                console.log(this.keys);
                console.log('end');
                this.keys.splice(this.keys.indexOf('swipe up'), 1)
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
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
            this.shoot();



        }
        update(input, enemies) {

            enemies.forEach(enemy => {
                const dx = (enemy.x + enemy.width / 4) - (this.x + this.width / 4);
                const dy = (enemy.y + enemy.height / 4) - (this.y + this.height / 4);
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < enemy.width / 4 + this.width / 4) {
                    score++;
                    const index = enemies.indexOf(enemy)
                    enemies.splice(index, 1);
                    //enemy.drawImage = false;
                    //removeImage();

                }
            });

            ghosts.forEach(ghost => {
                const dx = (ghost.x + ghost.width / 12) - (this.x + this.width / 12);;
                const dy = (ghost.y + ghost.height / 12) - (this.y + this.height / 12);
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < ghost.width / 12 + this.width / 12) {

                    life--;
                    document.getElementById('damage').play();
                    if (life == 0) {
                        document.getElementById('au').play();
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
                this.speed = 3;
            } else if (input.keys.indexOf('a') > -1) {
                this.speed = -3;
                //&& this.onGround()
            } else if (input.keys.indexOf('s',) > -1) {
                this.vy = this.vy + 1;


                // && score > 0
            } /* else if (input.keys.indexOf('e') > - 1 || input.keys.indexOf('touchstart') > - 1) {
                this.shootPressed = true;
                //score -= 1;
                //score--;

                if (score < 0) {
                    score = 0;
                }



            } */
            else if (input.keys.includes('e') || input.keys.includes('e') && input.keys.includes('w') ) {
                this.shootPressed = true;

                if (score < 0) {
                    score = 0;
                }
              }
            else {
                this.speed = 0;
                this.shootPressed = false;

                //this.vy = 0;
            }
            document.addEventListener('touchstart', function(event) {
                // Handle touchstart event for shooting
                this.shootPressed = true;
              }.bind(this));
           

            this.x += this.speed;
            if (this.x < 0) this.x = 0;
            //verschwindet wenn er an denn rechten rand kommt 
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;
            // spirngen
            //this.y += this.vy;
            if (!this.onGround()) {
                this.vy += this.weight;
                this.maxFrame = 5;
            } else if (input.keys.indexOf('w') > -1 || input.keys.indexOf('swipe up') > -1 && this.onGround()) {
                this.vy -= 20;
            } else {
                this.vy = 0;
                this.maxFrame = 8;
            }


            // else if(this.onGround() && input.keys.indexOf('w') > -1){
            //     this.vy -= 20;
            if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;
            //console.log('vy', this.vy);
            this.y += this.vy;


        }
        onGround() {
            return this.y >= this.gameHeight - this.height;
            //console.log("du hurensohn");
        }
        shoot() {

            if (this.shootPressed) {
                console.log("shoot");
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
            this.speed = 3;
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
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
        constructor(gameWidth, gameHeight, spawheigt) {
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
            context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
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


            context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
            if (this.health > 1) {
                ctx.strockStyle = "white";
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
                console.log('markedForDeletion2 ' + this.markedForDeletion);
                //score++;
            }

            console.log("y: " + self.y);

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





    class Bullet {

        color = [

            "blue",
            "purple",
            "yellow",
            "orange",
            "pink",

        ];
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
            if (this.x < sprite.x + sprite.width &&
                this.x + this.width > sprite.x &&
                this.y < sprite.y + sprite.height &&
                this.y + this.height > sprite.y) {
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
                    this.bullets.push(new Bullet(x, y, speed, damage));
                    score -= 1;
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
                bullet.draw(ctx)
            });
        }

        collideWith(sprite) {
            return this.bullets.some(bullet => {
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

        enemies.forEach(enemy => {

            enemy.draw(ctx);
            enemy.update();
        });
        enemies = enemies.filter(enemy => !enemy.markedForDeletion);

    }
    let geistertyp = [
        new Geistertyp(3, 4, this.document.getElementById('ghost1Image'), 40),
        new Geistertyp(1, 3, this.document.getElementById('ghost2Image'), 45),
        new Geistertyp(3, 4, this.document.getElementById('ghost3Image'), 50),
        new Geistertyp(1, 10, this.document.getElementById('ghost4Image'), 60),
        new Geistertyp(1, 6, this.document.getElementById('ghost5Image'), 43),
        new Geistertyp(3, 4, this.document.getElementById('ghost6Image'), 51),
        new Geistertyp(1, 1, this.document.getElementById('ghost7Image'), 75),
        new Geistertyp(1, 2, this.document.getElementById('ghost8Image'), 55),
    ];

    function handleGostes(deltaTime) {
        if (ghostTimer > ghostInterval + randomGhostInterval) {
            ghosts.push(new Ghost(canvas.width, canvas.height, geistertyp[Math.floor(Math.random() * geistertyp.length)]));
            console.log(ghosts);
            randomGhostInterval = Math.random() * 1000 + 500;
            ghostTimer = 0;

        } else {
            ghostTimer += deltaTime;
        }

        ghosts = ghosts.filter(ghost => !ghost.markedForDeletion);
    }



    // function drawLife(context) {
    //     context.fillStyle = 'red';
    //     context.fillRect(0, 0, life, 10);
    // } 


    function displayStatusText(context) {
        

        context.font = '30px CustomFont';
        context.textAlign = 'left';
        context.fillStyle = 'white';
        context.fillText('AMMO: ' , 120, 50);
        context.font = '30px CustomFont3';
        context.fillStyle = '#867ade';
        context.fillText('AMMO: ' , 120, 50);
        context.font = '30px CustomFont2';
        context.fillStyle = '#ae51b6';
        context.fillText('AMMO: ', 120, 50);

        context.font = '30px CustomFont';
        context.textAlign = 'left';
        context.fillStyle = 'white';
        context.fillText('HEALTH: ' , 120, 80);
        context.font = '30px CustomFont3';
        context.fillStyle = '#867ade';
        context.fillText('HEALTH: ' , 120, 80);
        context.font = '30px CustomFont2';
        context.fillStyle = '#ae51b6';
        context.fillText('HEALTH: ', 120, 80);


        
        context.textAlign = 'right';
        context.font = '30px CustomFont';
        context.fillStyle = 'white';
        context.fillText('ENEMIES: '+ geistertot, 1120, 50);
        context.font = '30px CustomFont3';
        context.fillStyle = '#867ade';
        context.fillText('ENEMIES: '+ geistertot, 1120, 50);
        context.font = '30px CustomFont2';
        context.fillStyle = '#ae51b6';
        context.fillText('ENEMIES: '+ geistertot, 1120, 50);


       
        context.lineJoin = "bevel";
        context.lineWidth = 3.5;
        context.strokeStyle = "white";
        context.strokeRect(242, 60, 104, 21);
        context.fillStyle = '#c18178';
        context.lineJoin = "bevel";
        context.fillRect(242, 60, life, 20);
       

        
       /*  context.fillStyle = 'white';
        context.clearRect(200, 48, 105, 25);   */
        /* context.fillStyle = "white";
        context.fillRect(200, 48, 105, 25); */
        context.lineJoin = "bevel";
        context.lineWidth = 3.5;
        context.strokeStyle = "white";
        context.strokeRect(242, 30, 104, 21);
        context.fillStyle = '#867ade';
        context.lineJoin = "bevel";
        context.fillRect(242, 30, score, 20);
        
        context.fillStyle = 'black';
       
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';

        const minutes = Math.floor(gametimerstart/60);
		let seconds = gametimerstart % 60;

        ctx.fillText(`${minutes}: ${seconds}` , 500, 50, 200 , 50 );








        if (gameOver) {
            let endscrem = document.getElementById('gameend');
            endscrem.style.display = "block";
            var gameOverButton = document.getElementById("spenden");
            gameOverButton.style.width = "200px";
            gameOverButton.style.height = "50px";
            gameOverButton.style.top = "65%";
            gameOverButton.style.display = "block";

            document.getElementById('hintergrunsound').pause();
            var restartbild = document.getElementById('restartbild');
            restartbild.style.display = "block";
            var restartButton = document.getElementById('restart');
            restartButton.style.display = "block";

            document.getElementById('restart').addEventListener('click', function () {
                restartGame();
                restartButton.style.display = "none";
                restartbild.style.display = "none";
                endscrem.style.display = "none";
                gameOverButton.style.display = "none";


            }, { once: true });



            /* context.textAlign = 'center';
            context.fillStyle = 'white';
            context.fillText('GAME OVER', canvas.width / 2, 200); */

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
        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
        player.restart();
        background.restart();
        enemies = [];
        ghosts = [];
        document.getElementById('startsound').play();
        document.getElementById('hintergrunsound').play();
        //document.getElementById('startsound').volume=50;
        gametimerstart = 0;
        score = 0;
        life = 100;
        geistertot = 0;
        gameOver = false;
        animate(0);

    }
    function updateTimer() {
		const minutes = Math.floor(gametimerstart/60);
		let seconds = gametimerstart % 60;
		gametimerstart++;
        /* gametimerstart = gametimerstart + 1;
        if (gametimerstart >= 50000) {
            ghostInterval -= Math.floor(gametimerstart / 10)
            if (ghostInterval <= 50) {
                ghostInterval = 50;

            }
            if (gametimerstart >= 70000) {
                ghostInterval -= 400;
            }
            if (gametimerstart >= 100000) {
                ghostInterval -= 10000;
                if(gameOver){
                    ghostInterval = 0;
                }
            }
        }

        console.log("intervale: " + ghostInterval); */
    }
    function showImageForSeconds(imageId, seconds) {
        let steueranleitung = document.getElementById('steueranleitung');
        steueranleitung.style.display = "block";
        setTimeout(function () {
            steueranleitung.style.display = "none";
        }, seconds * 1000);
    }
    const input = new InputHandler();
    const bulletController = new BulletController(canvas);
    const player = new Player(canvas.width, canvas.height, bulletController);
    const background = new Background(canvas.width, canvas.height);

    let lastTime = 0;
    let enemyTimer = 0;
    let enemyInterval = 80;
    let randomEnemyInterval = Math.random() * 1000 + 500;
    let ghostTimer = 0;
    let ghostInterval = 2780;
    let randomGhostInterval = Math.random() * 1080 + 470;


    // video.onended = function() {
    //     button.style.display = 'block';
    // };


    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        
        updateTimer();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background.draw(ctx);
        background.update(input);
        bulletController.draw(ctx);
        player.draw(ctx);
        player.update(input, enemies);
        ghosts.forEach(ghost => {
            if (bulletController.collideWith(ghost)) {
                if (ghost.health <= 0) {
                    const index = ghosts.indexOf(ghost)
                    ghosts.splice(index, 1);
                    document.getElementById('geistertot').play();
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

        handleEnemies(deltaTime);
        handleGostes(deltaTime);



        if (!gameOver) requestAnimationFrame(animate);



    }
    document.getElementById('startButton').addEventListener('click', function () {
        // Insert game start logic here
        showImageForSeconds("steueranleitung", 5);
        document.getElementById('startsound').play();
        document.getElementById('hintergrunsound').play();
        animate(0);
		timerInterval = setInterval(updateTimer, 1000);
        console.log('Game Started!');
        this.disabled = true; // Disables the button after one click
        this.style.display = 'none';
        if (startscreenhintergrund) {
            startscreenhintergrund.style.display = "none"; // This will make the image disappear entirely
        }

    });

});



