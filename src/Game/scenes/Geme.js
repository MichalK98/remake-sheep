import Player from '../sprites/Player';
import socket from '../../ws';

let cursors;
let player;
let players = [];

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

  create () {
    this.add.image(0, 0, 'background').setOrigin(0, 0).setScrollFactor(0);

    socket.emit('join');
    
    socket.on('player', data => {
      if (data.isSelf) {
        console.log("Player");
        player = new Player({
          scene: this,
          key: 'player',
          x: data.x,
          y: data.y
        });
        this.physics.add.collider(player, pipe);
      } else {
        console.log("Enemy");
        let enemy = new Player({
          scene: this,
          key: 'player',
          x: data.x,
          y: data.y
        });
        this.physics.add.collider(enemy, pipe);
      }
    });

    let pipe = this.physics.add.staticGroup();

    pipe.create(500, 400, 'pipe');

    // Cursors
    cursors = this.input.keyboard.createCursorKeys();

    // Camera
    let camera_width = this.cameras.main.width * Number.MAX_VALUE;
    let camera_height = this.cameras.main.height;
    // World size + Follow Player
    this.cameras.main.setBounds(0, 0, camera_width, camera_height);
    this.scene.scene.physics.world.setBounds(0, 0, camera_width, camera_height);
  }

  update() {
    if (player && cursors) {
      player.update(cursors);
    }
  }
}

export default Game;