class Enemy extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);

    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    this.body.setBounce(0.2);
    this.body.setCollideWorldBounds(true);
    this.setScale(.5);
  }
}

export default Enemy;