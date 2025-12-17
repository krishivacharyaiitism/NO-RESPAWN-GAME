const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

//CANVAS SIZE
canvas.width = 1024;
canvas.height = 576;

const gravity =0.3;
const MOVE_LIMIT = canvas.width * 0.08; // ~82px

//GAME STATE
let currentPlayer = 'player'; // player | enemy
let gameState = 'playing'; // playing | projectile
let projectile = null;
let winner = '';

//PLAYER CLASS
class Player {
    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.health = 100;
        this.startX = position.x;
    }
    draw() {
        //DRAW TANK
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x, this.position.y, 50, 25);

        //HEALTH BAR
        ctx.fillStyle = 'green';
        ctx.fillRect(this.position.x, this.position.y - 10, this.health * 0.5, 5);
    }
    update() {
        //UPDATE POSITION
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        //GRAVITY
        if(this.position.y + 25 + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
            this.position.y = canvas.height - 25;
        } else {this.velocity.y += gravity;}
        
        //CANVAS BOUNDARIES AND MOVE LIMIT
        this.position.x = Math.max(0, Math.min(this.position.x, canvas.width - 50));
    }
    
    //MOVE METHOD WITH LIMIT
    move(dx){
    const minX = this.startX - MOVE_LIMIT;
    const maxX = this.startX + MOVE_LIMIT;
    this.position.x += dx;
    
    if(this.position.x < minX) this.position.x = minX;
    if(this.position.x > maxX) this.position.x = maxX;

    if(this.position.x < 0) this.position.x = 0;
    if(this.position.x + 50 > canvas.width) this.position.x = canvas.width - 50;
    }
}

//PROJECTILE CLASS
class Projectile {
    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 5;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.y += gravity;
    }
}

//PLAYERS
const player = new Player({position: {x: 200, y: 501}, velocity: {x: 0, y: 0}});
const enemy = new Player({position: {x: 674, y: 501}, velocity: {x: 0, y: 0}});

//ANIMATION LOOP
function animate() {
    window.requestAnimationFrame(animate);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if(gameState === 'gameOver'){
        ctx.fillStyle = 'white';
        ctx.font = '48px Arial';
        ctx.fillText(`${winner} Wins!`, canvas.width / 2 - 100, canvas.height / 2);
        return;
    }
    player.update();
    enemy.update();

    if(projectile){
        projectile.update();
        if(projectile.position.y > canvas.height ||
           projectile.position.x < 0 ||
           projectile.position.x > canvas.width){
            projectile = null;
            switchTurn();
            return;
        }
    const target = currentPlayer === 'player' ? enemy : player;
    checkHit(projectile, target);
}
}
animate();

//SHOOT
function shootProjectile(shooter){
    if(projectile || gameState === 'gameOver') return;

    projectile = new Projectile({
        position: {
            x: shooter.position.x + 25,
            y: shooter.position.y
        },
        velocity: {
            x: currentPlayer === 'player' ? 7 : -7,
            y: -10
        }
    });
}
    
//COLLISION DETECTION
function detectCollision(proj, target){
    return target.position.x < proj.position.x + proj.radius &&
    target.position.x + 50 > proj.position.x - proj.radius &&
    target.position.y < proj.position.y + proj.radius &&
    target.position.y + 25 > proj.position.y - proj.radius;
}

//CHECK HIT
function checkHit(proj, target){
    if(detectCollision(proj, target)){
        target.health -= 20;
        projectile = null;
        if(target.health <= 0){
            gameState = 'gameOver';
            winner = currentPlayer === 'player' ? 'Player' : 'Enemy';
        }
        else{
            switchTurn();
        }
        return true;
    }
    return false;
}

// if(projectile){
//     if(projectile.position.y > canvas.height ||
//        projectile.position.x < 0 ||
//        projectile.position.x > canvas.width){
//         projectile = null;
//         switchTurn();
//     }        
// }

//SWITCH TURN
function switchTurn(){
    if(gameState === 'gameOver') return;
    currentPlayer = currentPlayer === 'player' ? 'enemy' : 'player';
    gameState = 'playing';
    player.startX = player.position.x;
    enemy.startX = enemy.position.x;
}

//KEY EVENTS
window.addEventListener('keydown', (event) => {
    if(gameState === 'gameOver') return;
    
    if(event.key === ' '){
        const shooter = currentPlayer === 'player' ? player : enemy;
        shootProjectile(shooter);
    }

    if(currentPlayer === 'player'){
        if(event.key === 'd'){
            player.move(10);
        }  
        if(event.key === 'a'){
            player.move(-10);
        }
        if(event.key === 'w'){
            if(player.velocity.y === 0){
                player.velocity.y = -15;
            }
        }
        if(event.key === 'f'){
            shootProjectile(player);
        }
    }
    else{
        if(event.key === 'ArrowRight'){
            enemy.move(10);
        }
        if(event.key === 'ArrowLeft'){
            enemy.move(-10);
        }
        if(event.key === 'ArrowUp'){
            if(enemy.velocity.y === 0){
                enemy.velocity.y = -15;
            }
        }
        if(event.key === 'Enter'){
            shootProjectile(enemy);
        }
    }
});
