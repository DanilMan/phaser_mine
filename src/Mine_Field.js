class Mine_Field extends Phaser.Scene {
  //var scene_field;

  constructor() {
    super("playGame");
  }

  preload() {
    this.load.image("block", "assets/imgs/block.png");
    this.load.image("cover", "assets/imgs/cover.png");
    this.load.image("flag", "assets/imgs/flag.png");
    this.load.image("bomb", "assets/imgs/bomb.png");
  }

  create() {
    var mine_counter = this.add.text(
      game.canvas.width / 2,
      game.canvas.height - 25,
      0
    );
    mine_counter.setOrigin(0.5, 0.5);
    mine_counter.setFontSize(50);
    var scene_field = new Field(this, 1, mine_counter);
  }

  game_over() {
    game.scene.start("endGame");
  }
}
