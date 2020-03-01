import socket from '../../ws';

let player_jump = true;

export default class Player extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key);
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);

        this.setScale(.5);
        this.body.setBounce(0.2);
        this.body.setCollideWorldBounds(true);
        this.create();
    }

    create() {
        this.scene.anims.create({
            key: 'sheep-turn',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 0 }),
            frameRate: 10,
        });
        this.scene.anims.create({
            key: 'sheep-slide',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
    }

    update(player_cursors) {
        // Jump
        if (player_cursors.up.isDown) {
            if (player_jump) {
                this.body.setVelocityX(200);
                this.body.setVelocityY(-400);
                player_jump = false;
                
                socket.emit('jump', {
                    setVelocityX: 200,
                    setVelocityY: -400,
                    locationX: this.body.x,
                    locationY: this.body.y
                });
            }
        } else {
            player_jump = true;
        }

        // Rotation
        if (this.body.newVelocity.y > 1) {
            this.body.rotation = 10;
        } else if (this.body.newVelocity.y < -1) {
            this.body.rotation = -10;
        } else {
            this.body.rotation = 0;
        }

        // Slide Animation
        if (this.body.speed >= 100) {
            if (this.body.touching.down || this.body.y >= 558) {
                this.anims.play('sheep-slide', true);
            } else {
                this.anims.play('sheep-turn');
            }
        } else {
            this.anims.play('sheep-turn');
        }

        if (this.body.speed >= 100 && (this.body.touching.down || this.body.y >= 558)) {
            this.anims.play('sheep-slide', true);
        } else {
            this.anims.play('sheep-turn');
        }
    }
}