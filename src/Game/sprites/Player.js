import socket from "../../ws";

let jump = true;

class Player extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);

    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    this.body.setBounce(0.2);
    this.body.setCollideWorldBounds(true);
    this.setScale(.5);

    this.create();
  }

  create() {
    // Turn Animations
    this.scene.anims.create({
      key: 'player-stand',
      frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 0 }),
      frameRate:
      10,
    });

    // Slide Animations
    this.scene.anims.create({
      key: 'player-slide',
      frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
      frameRate: 10,
      repeat: -1
    });
  }

  update(cursors) {
    // Player Jump
    if (cursors.up.isDown) {
      if (jump) {
        this.body.setVelocityX(200);
        this.body.setVelocityY(-400);
        jump = false;
      }
    } else {
      jump = true;
    }

    // Player Rotation
    if (this.body.newVelocity.y > 1) {
      this.body.rotation = 10;
    } else if (this.body.newVelocity.y < -1) {
      this.body.rotation = -10;
    } else {
      this.body.rotation = 0;
    }

    // Player Animations
    if (this.body.speed >= 100) {
      if (this.body.touching.down || this.body.y >= 558) {
        this.anims.play('player-slide', true);
      } else {
        this.anims.play('player-stand');
      }
    } else {
      this.anims.play('player-stand');
    }
  }
}

export default Player;