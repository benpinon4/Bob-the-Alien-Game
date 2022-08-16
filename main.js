window.addEventListener("load", function () {
  let canvas = document.querySelector("#canvas1");
  let backGround = document.querySelector("#fullBackground")
  let bob = document.querySelector("#playerImage")
  let gameOverImage = document.querySelector("#gameOver")
  let arrowKeyImage = document.querySelector('#arrowKeys')
  let scoreImage = document.querySelector('#score')
  let instructMessage = document.querySelector('#instructMessage')
  let ctx = canvas.getContext("2d");

  canvas.width = 1100;
  canvas.height = 700;
  let gameSpeed = 3;
  let enemies = [];
  let score = 0;
  let gameOver = false;
  let start = document.querySelector("#startImage")








  let backgroundLayer1 = new Image();
  backgroundLayer1.src = "-6.png";
  let backgroundLayer2 = new Image();
  backgroundLayer2.src = "-5.png";
  let backgroundLayer3 = new Image();
  backgroundLayer3.src = "r-4.redrawn3.png";
  let backgroundLayer4 = new Image();
  backgroundLayer4.src = "-3.png";
  let backgroundLayer5 = new Image();
  backgroundLayer5.src = "-2.png";
  let backgroundLayer6 = new Image();
  backgroundLayer6.src = "-1.png";
  let backgroundLayer7 = new Image();
  backgroundLayer7.src = "0.png";



  class InputHandler {
    ///Key Inputs
    constructor() {
      this.keys = [];
      window.addEventListener("keydown", (event) => {

        if (
          (event.key === "ArrowDown" ||
            event.key === "ArrowUp" ||
            event.key === "ArrowLeft" ||
            event.key === "ArrowRight") &&
          this.keys.indexOf(event.key) === -1
        ) {
          this.keys.push(event.key);
        }

        console.log(event.key, this.keys);
      });
      window.addEventListener("keyup", (event) => {

        if (
          event.key === "ArrowDown" ||
          event.key === "ArrowUp" ||
          event.key === "ArrowLeft" ||
          event.key === "ArrowRight"
        ) {
          this.keys.splice(this.keys.indexOf(event.key), 1);
        }

        console.log(event.key, this.keys);
      });
    }
  }

  class Player {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 240;
      this.height = 310;
      this.x = 0;
      this.y = this.gameHeight - this.height;
      this.image = document.querySelector("#playerImage");
      this.frameX = 0;
      this.maxFrame = 0;
      this.frameY = 0;
      this.fps = 20;
      this.frameTimer = 0;
      this.frameInterval = 1000/this.fps;
      this.speed = 0;
      this.vy = 0;
      this.weight = 1;
    }
    draw(context) {
        context.strokeStyle = "transparent";
        context.strokeRect(this.x + 90, this.y + 170, this.width - 100, this.height-195);
        context.beginPath();
        context.arc(this.x + this.width/1.5, this.y + this.height/1.4, this.width/4 + 1, 0, Math.PI * 2)
        context.stroke();
        // context.strokeStyle = "blue";
        // context.beginPath();
        // context.arc(this.x + 60, this.y, this.width/2, 0, Math.PI * 2)
        // context.stroke();
        context.drawImage(
        this.image,
        this.frameX * this.width,
        this.frameY * this.height,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height - 30
      );
    }
    update(input, deltaTime, enemies) {
      // Collision Detections
      enemies.forEach(enemy => {
          let dx = enemy.x - this.x;
          let dy = enemy.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy)
          if(distance < enemy.width/3.5 + this.width/3.5) {
              gameOver = true
          }
      })
      //sprite Animation
      if(this.frameTimer > this.frameInterval){
      if(this.frameX >= this.maxFrame) this.frameX = 0;
      else this.frameX++
      this.frameTimer = 0
      } else {
        this.frameTimer += deltaTime
      }
      //Controls
      if(input.keys.indexOf("ArrowRight") > -1 && input.keys.indexOf("ArrowUp") > -1 && this.onGround()) {
        this.vy -= 27
        gameSpeed = 4
        this.speed = 5;
      } else if (input.keys.indexOf("ArrowLeft") > -1 && input.keys.indexOf("ArrowUp") > -1 && this.onGround()) {
        this.vy -= 27
        gameSpeed = 2
        this.speed = -1;
      } else if (input.keys.indexOf("ArrowRight") > -1 ) {
        gameSpeed = 4
        this.speed = 5;
      } else if (input.keys.indexOf("ArrowLeft") > -1) {
        gameSpeed = 1
        this.speed = -1;
      } else if (input.keys.indexOf("ArrowUp") > -1 && this.onGround()) {
        this.vy -= 27
      } else {
        gameSpeed = 3
        this.speed = 0;
      }

      //Horizontal Movement
      this.x += this.speed;
      if (this.x < 0) {
        this.x = 0;
      } else if (this.x > this.gameWidth - this.width) {
        this.x = this.gameWidth - this.width;

      } 
      //Vertical Movement
        this.y += this.vy; //Jump
      if (this.onGround() === false) { //in air condition
        this.vy += this.weight;
        this.frameY = 2;
        this.maxFrame = 0;
      } else if (this.onGround() === true && gameSpeed === 4) {//on ground and right arrow pressed condition
        // this.vy = 0;
        this.frameY = 3;
        this.maxFrame = 7;
      } else if (this.onGround() === true) {
        // this.vy = 0;
        this.frameY = 1;
        this.maxFrame = 5;
      }
   
      if (this.y > this.gameHeight - this.height) {
        this.y = this.gameHeight - this.height;
      }
    }
    onGround() {
      return this.y >= this.gameHeight - this.height;
    }
  }

  //Background
  class Layer {
    constructor(image, speedModifier) {
      this.x = 0;
      this.y = 0;
      this.width = 1100;
      this.height = 700;
      this.image = image;
      this.speedModifier = speedModifier;
      this.speed = gameSpeed * this.speedModifier;
    }
    update() {
      this.speed = gameSpeed * this.speedModifier
      if (this.x <= -this.width) {
        this.x = 0;
      }

      this.x = this.x - this.speed;
      
    }
    draw() {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      ctx.drawImage(
        this.image,
        this.x + this.width - .5,
        this.y,
        this.width,
        this.height
      );
    }
  }

  class Enemy {
      constructor (gameWidth, gameHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.width = 310;
        this.height = 200;
        this.image = document.querySelector("#enemy1")
        this.x = this.gameWidth;
        this.y = this.gameHeight - this.height;
        this.frameX = 0;
        this.maxFrame = 5;
        this.fps = 20;
        this.frameTimer = 0;
        this.frameInterval = 1000/this.fps;
        this.speed = .5 + (Math.random()) * 5;
        this.markedForDeletion = false 
      }
      draw(context){
        context.strokeStyle = "transparent";
        context.strokeRect(this.x + 60, this.y, this.width - 120, this.height);
        context.beginPath();
        context.arc(this.x + this.width/2, this.y + this.height/2, this.width/3.4, 0, Math.PI * 2)
        context.stroke();
        // context.strokeStyle = "blue";
        // context.beginPath();
        // context.arc(this.x + 60, this.y, this.width/2, 0, Math.PI * 2)
        // context.stroke();
        context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height - 30)
      }
      update(deltaTime){
        if(this.frameTimer > this.frameInterval){
            if (this.frameX >= this.maxFrame)this.frameX = 0
            else this.frameX++;
            this.frameTimer = 0;
        } else {
          this.frameTimer += deltaTime;
        }  
        
        this.x -= this.speed;
        if (this.x < 0 - this.width) { 
        this.markedForDeletion = true
        score++;
        }

  }}
      
  function handleEnemies(deltaTime){
    if(enemyTimer > enemyInterval + randomEnemyInterval){
      enemies.push(new Enemy(canvas.width, canvas.height))
      randomEnemyInterval = Math.random() * 1000 + 500
      console.log(enemyTimer)   
      enemyTimer = 0; 
    } else {
      enemyTimer += deltaTime;
    }
    enemies.forEach(enemy => {
      enemy.draw(ctx);
      enemy.update(deltaTime);
    })
    enemies = enemies.filter(enemy => !enemy.markedForDeletion)
  }

  function displayStatusText(context) {
      context.drawImage(scoreImage,0,20,196,76)
      context.font = '40px OCR A Std, monospace';  
      context.fillStyle = 'lightgrey bolder';
      context.fillText(score, 200, 65)
      context.drawImage(instructMessage,canvas.width/4,0,587,39)
      // context.fillStyle = 'darkgrey bolder';
      // context.fillText(score, 82, 52)
      context.drawImage(arrowKeyImage,canvas.width - 200,0,200,200)
      if(gameOver === true){
        context.drawImage(gameOverImage,0,0,canvas.width,canvas.height)
       
        canvas.addEventListener("click", () => {
          location.reload(true);
        })

      }
  }

  let input = new InputHandler(); //Substationting inputHandler Class console log display what key value is being pressed
  let player = new Player(canvas.width, canvas.height);
 
  let layer1 = new Layer(backgroundLayer1, 0.2);
  let layer2 = new Layer(backgroundLayer2, 0.2);
  let layer3 = new Layer(backgroundLayer3, 0.2);
  let layer4 = new Layer(backgroundLayer4, 0.6);
  let layer5 = new Layer(backgroundLayer5, 0.6);
  let layer6 = new Layer(backgroundLayer6, 0.8);
  let layer7 = new Layer(backgroundLayer7, 1);

  gameObjects = [
    layer1,
    layer2,
    layer3,
    layer4,
    layer5,
    layer6,
    layer7,
  ];

  let lastTime = 0;
  let enemyTimer = 1;
  let enemyInterval = 2000;
  let randomEnemyInterval = Math.random() * 10 //Have not seen this syntax

  
  ctx.fillStyle = 'Black'
  ctx.font = '100px virgo_01regular'
  ctx.textAlign = 'center'
  ctx.drawImage(backGround, 0, 0, canvas.width, canvas.height)
  ctx.drawImage(start,0, 0, canvas.width, canvas.height)
  // ctx.fillText("Click Here" , canvas.width/2, canvas.height/2.7)
  // ctx.fillText("To Start Game!" , canvas.width/2, canvas.height/2)
  // ctx.fillStyle = 'White'
  // ctx.fillText("Click Here" , canvas.width/2 + 2, (canvas.height/2.7) + 2)
  // ctx.fillText("To Start Game!" , canvas.width/2 + 2, (canvas.height/2) + 2)
  ctx.drawImage (bob,-30,0,240,310, canvas.width/3, canvas.height/1.7, 240, 310)
  let boo1 = false
  canvas.addEventListener('click', () => {
   if (boo1 === false) {
   function animate(timeStamp) {  //animation loop
    // start.drawImage(start)
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp //setting to last timestamp
    // console.log(deltaTime)
    ctx.clearRect(0, 0, canvas.width, canvas.height);// clears each canvas every loop cycle for new images
    gameObjects.forEach((object) => {//animation loop for parallax background
        object.update();
        object.draw();
      });
    player.draw(ctx);
    player.update(input, deltaTime, enemies);
    handleEnemies(deltaTime)
    displayStatusText(ctx)  
    if(gameOver === false)
    {requestAnimationFrame(animate);}

  }
  boo1 = true
}
  animate(0);
  // canvas.removeEventListener('click',  )
});

})
