import Player from '../sprites/Player';
import Enemy from '../sprites/Enemy';
import socket from '../../ws';

let player;
let enemy;
let cursors;

class Game extends Phaser.Scene {
  constructor() {
    super({
      key: 'Game'
    });
  }

  preload() {
    this.load.image('background', 'assets/img/sky.png');
    this.load.image('pipe', 'assets/img/pipe.png');
    this.load.spritesheet(
      'player',
      'assets/img/player.png',
      {frameWidth: 100, frameHeight: 84}
    );
    this.load.spritesheet(
      'enemy',
      'assets/img/player.png',
      {frameWidth: 100, frameHeight: 84}
    );
  }

  create() {
    this.add.image(0, 0, 'background').setOrigin(0, 0).setScrollFactor(0);
    player = new Player({
      scene: this,
      key: 'player',
      x: 100,
      y: -450
    });

    socket.emit('player_join', {
      username: 'player_username'
    });

    socket.on('player_joined', data => {
      console.log(data);
      enemy = new Enemy({
        scene: this,
        key: 'enemy',
        x: 200,
        y: -450
      });
    });

    let pipe = this.physics.add.staticGroup();

    pipe.create(500, 400, 'pipe');

    this.physics.add.collider(player, pipe);

    // Cursors
    cursors = this.input.keyboard.createCursorKeys();

    // Camera
    let camera_width = this.cameras.main.width * Number.MAX_VALUE;
    let camera_height = this.cameras.main.height;
    // World size + Follow Player
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, camera_width, camera_height);
    this.scene.scene.physics.world.setBounds(0, 0, camera_width, camera_height);
  }

  update() {
    player.update(cursors);
  }
}

export default Game;