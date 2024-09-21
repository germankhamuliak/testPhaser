let field;
let balls;
let ballCount = 4;
let footballer;

class GameScene extends Phaser.Scene {
    preload() {
        this.load.image('field', 'assets/field.png');
        this.load.image('ball', 'assets/ball.png');
        this.load.image('footballer', 'assets/footballer.png');      
    }

    create() {
        // field
        field = this.add.image(config.width / 2, config.height / 2, 'field');
        field.setDisplaySize(config.width, config.height);
        
        // balls
        balls = this.physics.add.group({
            key: 'ball',
            repeat: ballCount - 1,
        });
        balls.children.iterate((child) => {
            child.x = Phaser.Math.Between(0, config.width);
            child.y = Phaser.Math.Between(0, config.height);
            child.setVelocity(Phaser.Math.Between(-300, 300), Phaser.Math.Between(-300, 300));
            child.setScale(Phaser.Math.Between(1, 4) / 10);
        });
        this.physics.add.collider(balls, balls, this.ballCollision, null, this);

        // footballer
        footballer = this.physics.add.staticGroup(); 
        footballer.create(config.width / 2, config.height / 2, 'footballer').setScale(2);
        this.physics.add.collider(balls, footballer, this.ballFootballerCollision, null, this);
    }


    update() {
        balls.children.iterate((ball) => {
            this.checkWallCollisions(ball);
        });
    }

    // Проверка столкновений со стенами
    checkWallCollisions(ball) {
        balls.children.iterate((child) => {
            const size = child.displayWidth * 0.5;
            const ballLeft = child.x - size;
            const ballRight = child.x + size;
            const ballTop = child.y - size;
            const ballBot = child.y + size;
            if (ballLeft <= 0) {
                child.setVelocityX(Phaser.Math.Between(200, 300));
            } 
            if (ballRight >= config.width) {
                child.setVelocityX(Phaser.Math.Between(-300, -200));
            }
            if (ballBot >= config.height) {
                child.setVelocityY(Phaser.Math.Between(-300, -200));
            } 
            if (ballTop <= 0) {
                child.setVelocityY(Phaser.Math.Between(200, 300));
            }
        });
    }

    // Проверка столкновений шариков
    ballCollision(ball1, ball2) {
        const dx = ball1.x - ball2.x;
        const dy = ball1.y - ball2.y;
        const angle = Math.atan2(dy, dx);
        ball1.setVelocity(500 * Math.cos(angle), 500 * Math.sin(angle));
        ball2.setVelocity(-500 * Math.cos(angle), -500 * Math.sin(angle));
    }
    
    // Проверка столкновений с футболитом
    ballFootballerCollision(ball, player) {
        const dx = ball.x - player.x;
        const dy = ball.y - player.y;
        const angle = Math.atan2(dy, dx);
        ball.setVelocity(500 * Math.cos(angle), 500 * Math.sin(angle));
    }
}

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: new GameScene(),
    physics: {
        default: 'arcade',
    }
}

let game = new Phaser.Game(config);