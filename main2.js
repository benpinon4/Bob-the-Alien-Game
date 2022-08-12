let canvas = document.querySelector("#canvas1");
let ctx = canvas.getContext('2d')
let CANVAS_WIDTH = canvas.width = 2400;
let CANVAS_HEIGHT = canvas.height = 1400;
let gameSpeed = 5;


let backgroundLayer1 = new Image();
backgroundLayer1.src = '-6.png'
let backgroundLayer2 = new Image();
backgroundLayer2.src = '-5.png'
let backgroundLayer3 = new Image();
backgroundLayer3.src = 'r-4.redrawn3.png'
let backgroundLayer4 = new Image();
backgroundLayer4.src = '-3.png'
let backgroundLayer5 = new Image();
backgroundLayer5.src = '-2.png'
let backgroundLayer6 = new Image();
backgroundLayer6.src = '-1.png'
let backgroundLayer7 = new Image();
backgroundLayer7.src = '0.png'
let backgroundLayer8 = new Image();
backgroundLayer8.src = 'Section 1_desert1-1.png'

window.addEventListener('load' , function(){
    let slider = document.querySelector("#slider")
slider.value = gameSpeed;
let showGameSpeed = document.querySelector("#showGameSpeed")
showGameSpeed.innerText = gameSpeed;
slider.addEventListener('change', function(event){
    gameSpeed = event.target.value
    showGameSpeed.innerText = gameSpeed;
})

class Layer {
    constructor(image, speedModifier){
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 1400;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;
    }
    update(){
        this.speed = gameSpeed * this.speedModifier;
        if(this.x <= -this.width){
            this.x = 0
        }
        
        this.x = this.x - this.speed;
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}
let layer1 = new Layer(backgroundLayer1, 0.2);
let layer2 = new Layer(backgroundLayer2, .2);
let layer3 = new Layer(backgroundLayer3, .2);
let layer4 = new Layer(backgroundLayer4, 0.6);
let layer5 = new Layer(backgroundLayer5, .6);
let layer6 = new Layer(backgroundLayer6, .8);
let layer7 = new Layer(backgroundLayer7, 1);
let layer8 = new Layer(backgroundLayer8, 1);

gameObjects = [layer1,layer2,layer3,layer4,layer5,layer6,layer7,layer8]

function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)//Clear previous loop frames and only plays the current looping frames
    gameObjects.forEach(object => {
        object.update();
        object.draw();
    })
   
    requestAnimationFrame(animate)
}
animate()
})





// let x = 0
// let x2 = 2400


// ctx.drawImage(backgroundLayer5 ,x ,0);
    // ctx.drawImage(backgroundLayer5 ,x2 ,0);
//     if (x < -2400){
//          x = 2400 + x2 - gameSpeed
//     } else { 
//         x -= gameSpeed
//     }
//     if (x2 < -2400){
//         x2 = 2400 + x - gameSpeed
//    } else { 
//        x2 -= gameSpeed
//    }