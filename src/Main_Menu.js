class Main_Menu extends Phaser.Scene {
  constructor() {
    super("bootGame");
  }

  create() {
    var text = this.add
      .text(game.canvas.width / 2, game.canvas.height / 2, "START", {
        fontFamily: "Roboto",
        fontSize: "32px",
      })
      .setOrigin(0.5);
    text.setInteractive();
    text.on("pointerdown", function () {
      game.scene.stop("bootGame");
      game.scene.start("playGame");
    });
  }
}
