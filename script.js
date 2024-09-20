let field;
let bolls;
let bollCount = 3;
let footboller;

class GameScene extends Phaser.Scene {
    preload() {
        this.load.image('field', 'assets/field.png');
        this.load.image('boll', 'assets/boll.png');
        this.load.image('footboller', 'assets/footboller.png');
    }

    create() {
        // field
        field = this.add.image(config.width / 2, config.height / 2, 'field');
        field.height = config.height;
        field.width = config.width;
        
        // bolls
        bolls = this.physics.add.group({
            key: 'boll',
            repeat: bollCount - 1,
        });
        bolls.children.iterate((child) => {
            child.setBounce(1);
            child.setCollideWorldBounds(true);
            child.x = Phaser.Math.Between(0, config.width);
            child.y = Phaser.Math.Between(0, config.height);
            child.setVelocity(Phaser.Math.Between(-300, 300), Phaser.Math.Between(-300, 300));
            child.setScale(Phaser.Math.Between(1, 4) / 10);
        });
        this.physics.add.collider(bolls, bolls);

        // footboller
        footboller = this.physics.add.staticGroup();
        footboller.create(config.width / 2, config.height / 2, 'footboller').setScale(2);
        this.physics.add.collider(bolls, footboller);
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