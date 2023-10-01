class Game_Over extends Phaser.Scene {
  constructor() {
    super("endGame");
  }

  create() {
    var text = this.add
      .text(game.canvas.width / 2, game.canvas.height / 2, "REPLAY", {
        fontFamily: "Roboto",
        fontSize: "32px",
        color: "#fff",
        backgroundColor: "#000",
      })
      .setOrigin(0.5);
    text.setInteractive();
    text.on("pointerdown", function () {
      game.scene.stop("endGame");
      game.scene.stop("playGame");
      game.scene.start("playGame");
    });
  }
}
