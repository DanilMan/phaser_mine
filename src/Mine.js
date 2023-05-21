const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 850,
    autoCenter: true,
    backgroundColor: 0x000000,
    scene: [Main_Menu, Mine_Field]
};

const game = new Phaser.Game(config);