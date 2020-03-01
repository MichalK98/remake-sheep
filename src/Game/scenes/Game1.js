import socket from '../../ws';
import Player from '../sprites/player';

let player;
let player_cursors;
let players_count = 0;
let players_count_update;
let player_new;
let player_enemy;

const player_username = prompt('Username: ');

let pipe;
let pipe_random;
let pipes = [];

const pipe_height = 600;
const pipe_marginal = 50;
const pipe_gap = 100;

const pipe_min = -300 + pipe_marginal;
const pipe_max =  200 + pipe_marginal - pipe_gap;

let camera_width;
let camera_height;

socket.emit('player_new', player_username);

socket.on('counter', data => {
    players_count_update = data;
});

class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene'
        });
    }

    preload() {
        this.load.image('background', 'assets/img/sky.png');
        this.load.image('pipe', 'assets/img/pipe.png');
        this.load.spritesheet(
            'player',
            'assets/img/player.png',
            { frameWidth: 100, frameHeight: 84 }
        );
    }

    create() {
        // Set the background image
        this.add.image(-100, 0, 'background').setOrigin(0, 0).setScrollFactor(0);

        // Player
        player = new Player({
            scene: this,
            key: 'player',
            x: 100,
            y: 450
        });
        socket.emit('new_player', {
            username: 'player'
        });

        // for(let i = 1; i < players_count; i++) {
        //     player_new = new Player({
        //         scene: this,
        //         key: 'player',
        //         x: 200,
        //         y: 450
        //     });
        //     console.log("Enemy: " + i)
        // }

        // Pipes
        pipe = this.physics.add.staticGroup();

        for(let i = 1; i < 10; i++) {
            pipe_random = Phaser.Math.Between(pipe_min, pipe_max);
            pipe.create(i * 500, pipe_random, 'pipe');
            pipe.create(i * 500, pipe_random + pipe_height + pipe_gap, 'pipe');
        }

        // Colliders
        this.physics.add.collider(player, pipe);

        // Camera
        camera_width = this.cameras.main.width * Number.MAX_VALUE;
        camera_height = this.cameras.main.height;
        // World size + Follow Player
        this.cameras.main.startFollow(player);
        this.cameras.main.setBounds(0, 0, camera_width, camera_height);
        this.scene.scene.physics.world.setBounds(0, 0, camera_width, camera_height);

        player_cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        player.update(player_cursors);
        if (players_count !== players_count_update) {
            players_count = players_count_update;
            console.log(players_count);

            socket.on('player_add', data => {
                console.log(data);
                player_enemy = new Player({
                    scene: this,
                    key: 'player',
                    x: 150, // 100
                    y: 450
                });
            });
        }
    }
}

export default GameScene;