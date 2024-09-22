let field;
let lightBalls;
let heavyBall;
//колличество допустимых столкновений со стенами
let score = 7;

class GameScene extends Phaser.Scene {
    preload() {
        this.load.image('field', 'assets/field.png');
        this.load.image('ball', 'assets/ball.png');
    }

    create() {
        // Поле
        field = this.add.image(config.width / 2, config.height / 2, 'field')
        field.setDisplaySize(config.width, config.height);

        //Легкие мячи
        lightBalls = this.physics.add.group();
        this.createBall(Phaser.Math.Between(0, config.width), Phaser.Math.Between(0, config.height), score);
        this.physics.add.collider(lightBalls, lightBalls);

        // Создание тяжелого мяча
        heavyBall = this.physics.add.sprite(Phaser.Math.Between(0, config.width), Phaser.Math.Between(0, config.height), 'ball')
        heavyBall.setBounce(1)
        heavyBall.setCollideWorldBounds(true)
        heavyBall.setVelocity(Phaser.Math.Between(-300, 300), Phaser.Math.Between(-300, 300))
        heavyBall.setScale(0.3);
        heavyBall.body.mass = 5;
        this.physics.add.collider(lightBalls, heavyBall, this.addBall, null, this);
    }
    // Создание легкого мяча
    createBall(x, y, score) {
        const ball = lightBalls.create(x, y, 'ball');
        ball.setBounce(1)
        ball.setCollideWorldBounds(true)
        ball.setVelocity(Phaser.Math.Between(-300, 300), Phaser.Math.Between(-300, 300))
        ball.setScale(0.2);
        ball.score = score;
        ball.scoreText = this.add.text(x, y, score, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        ball.iswallCollision = false;
    }
    // добавление легкого мяча при столкновении с тяжелым
    addBall(Ball1,Ball2) {
        this.createBall(Ball1.x, Ball1.y, score);
    }
    

    update() {
        lightBalls.children.iterate((ball) => {
            //проерка на наличие мяча, так как если ее нету то scoreText.setPosition(); пытается обновиться у мяча которого нету и ловится ошибка
            if(ball) {
                ball.scoreText.setPosition(ball.x, ball.y);
                //пришлось проверять находится мячик в столкновении с границами или нет, а то отнималось большечем 1
                let wallCollision = ball.body.blocked.left || ball.body.blocked.right || ball.body.blocked.up || ball.body.blocked.down;
                if (wallCollision && !ball.isWallCollision) {
                    ball.score--;
                    ball.scoreText.setText(ball.score);
                    ball.isWallCollision = true;
                    if (ball.score <= 0) {
                        ball.scoreText.destroy();
                        ball.destroy();
                    }
                } else if (!wallCollision) {
                    ball.isWallCollision = false;
                }
            }
        });
    }
}

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: new GameScene(),
    physics: {
        default: 'arcade'
    }
};

let game = new Phaser.Game(config);