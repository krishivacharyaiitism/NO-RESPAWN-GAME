const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);
const gravity =0.3;
class Player {
    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
    }
    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x, this.position.y, 50, 25);
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if(this.position.y + 25 + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else {this.velocity.y += gravity;}
        if(this.position.x + 50 + this.velocity.x >= canvas.width || this.position.x + this.velocity.x <= 0) {
            this.velocity.x = -this.velocity.x;
        }else {this.position.x += this.velocity.x;}
    }
}

const player = new Player({position: {x: 200, y: 501}, velocity: {x: 0, y: 0}});
const enemy = new Player({position: {x: 674, y: 501}, velocity: {x: 0, y: 0}});
console.log(player);
console.log(enemy);
;

function animate() {
    window.requestAnimationFrame(animate);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();
}
animate();

window.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'd':
            player.position.x += 10;
            break;
        case 'a':
            player.position.x += -10;
            break;
        case 'w':
            if(player.velocity.y === 0) {
                player.velocity.y = -15;
            }
            break; 
        case 's':
            //player.velocity.y = 2;
            break; 
    }
});
window.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowRight':
            enemy.position.x += 10;
            break;
        case 'ArrowLeft':
            enemy.position.x += -10;
            break;
        case 'ArrowUp':
            if(enemy.velocity.y === 0) {
                enemy.velocity.y = -15;
            }
            break; 
        case 'ArrowDown':
            //enemy.velocity.y = 2;
            break; 
    }
});
animate();
