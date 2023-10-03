class Game_Over extends Phaser.Scene {
  constructor() {
    super("endGame");
  }

  create(data) {
    game.scene.pause("playGame");
    let word = data.state === 0 ? "RETRY" : "REPLAY";
    var text = this.add
      .text(game.canvas.width / 2, game.canvas.height / 2, word, {
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
