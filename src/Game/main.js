
import 'phaser';
import GameScene from './scenes/Geme';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    title: "Leader Sheep",
    parent: "game",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: [
        GameScene
    ]
};

const game = new Phaser.Game(config);