var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext('2d');

var mouse = {
    x: innerWidth/2,
    y: innerHeight/2
}

window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
});


var cor = [
    '#ffaa33',
    '#99ffaaa',
    '#00ff00', 
    '#4411aa',
    '#ff1100',
]

function Pegardistancia(x1,y1,x2,y2){
    let distanciax= x2-x1;
    let distanciay=y2-y1;

    return Math.sqrt(Math.pow(distanciax, 2) + Math.pow(distanciay,2));
}

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

function resolveCollision(Particula, otherParticle) {
    const xVelocityDiff = Particula.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = Particula.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - Particula.x;
    const yDist = otherParticle.y - Particula.y;

    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        const angle = -Math.atan2(otherParticle.y - Particula.y, otherParticle.x - Particula.x);

        const m1 = Particula.mass;
        const m2 = otherParticle.mass;

        const u1 = rotate(Particula.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        Particula.velocity.x = vFinal1.x;
        Particula.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}

function Particula(x, y,radius){
    this.x = x;
    this.y = y;
    this.velocity = {
        x: (Math.random()-0.5)*8,
        y: (Math.random()-0.5)*8
    }
    this.radius= radius;
    this.color = cor[Math.floor(Math.random()* cor.length)];
    this.mass = 1;
    this.opacity = 0;
    this.update = particulas => {
        this.draw();
        for(let i = 0; i< particulas.length; i++){
            if( this === particulas[i]) continue;
            if(Pegardistancia(this.x,this.y,particulas[i].x,particulas[i].y)- this.radius * 2 < 0){
                resolveCollision(this, particulas[i]);
        }

    }
    if(Pegardistancia(mouse.x,mouse.y, this.x, this.y) < 30 && this.opacity <0.2){
           this.opacity+= 0.02;    
    }else if(this.opacity > 0){
        this.opacity-=0.02;
        this.opacity = Math.max(0, this.opacity);
    }
    if(this.x + this.radius > innerWidth || this.x - this.radius < 0 ){
        this.velocity.x = -this.velocity.x;
    }
    if(this.y + this.radius > innerHeight || this.y - this.radius < 0){
        this.velocity.y = -this.velocity.y;
    }
    this.x+= this.velocity.x;
    this.y+=this.velocity.y;
    };
    this.draw = function(){
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); 
        c.save();
        c.globalAlpha = this.opacity;
        c.fillStyle = this.color;
        c.fill();
        c.restore();
        c.strokeStyle = this.color;
        c.stroke();
        c.closePath();
    }
};


let particulas
function init(){
    particulas=[];
    for(var i =0; i < 150; i++){
        var x = Math.random()*(innerWidth - radius *2) + radius;
        var y = Math.random()*(innerHeight - radius *2) + radius;
        var radius = 15;
        
        if(i!== 0){
            for(let j =0; j<particulas.length; j++){
                if(Pegardistancia(x,y,particulas[j].x,particulas[j].y) -radius*2<0){
                    x = Math.random()*(innerWidth - radius *2) + radius;
                    y = Math.random()*(innerHeight - radius *2) + radius;
                }
            }
        }
        particulas.push(new Particula(x,y,radius));
    }

};


function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0, innerWidth, innerHeight);
    particulas.forEach(Particula =>{
        Particula.update(particulas);
    })
    
};
init();
animate();





