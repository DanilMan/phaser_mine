class Mine_Field extends Phaser.Scene {
  #timer;
  #seconds;
  #minutes;
  #hours;

  #restart_text;

  constructor() {
    super("playGame");
  }

  preload() {
    this.load.image("block", "assets/imgs/block.png");
    this.load.image("cover", "assets/imgs/cover.png");
    this.load.image("flag", "assets/imgs/flag.png");
    this.load.image("mine", "assets/imgs/mine.png");
    this.load.image("x", "assets/imgs/x.png");
  }

  create() {
    this.#seconds = 0;
    this.#minutes = 0;
    this.#hours = 0;

    this.#timer = this.add
      .text((game.canvas.width * 7) / 8, game.canvas.height - 25, "00", {
        fontFamily: "Roboto",
        fontSize: "32px",
        color: "#ebedf0",
      })
      .setOrigin(0.5);

    this.time.addEvent({
      delay: 1000,
      callback: this.#set_elapsed_time,
      callbackScope: this,
      loop: true,
    });

    var mine_counter = this.add.text(
      game.canvas.width / 2,
      game.canvas.height - 25,
      0,
      { color: "#ebedf0" }
    );
    mine_counter.setOrigin(0.5, 0.5);
    mine_counter.setFontSize(50);

    this.#restart_text = this.add
      .text(game.canvas.width / 8, game.canvas.height - 25, "RESTART", {
        fontFamily: "Roboto",
        fontSize: "32px",
        color: "#ebedf0",
      })
      .setOrigin(0.5);
    this.#restart_text.setInteractive();
    this.#restart_text.on("pointerdown", function () {
      game.scene.stop("playGame");
      game.scene.start("playGame");
    });

    var scene_field = new Field(this, 1, mine_counter);
  }

  #set_elapsed_time() {
    ++this.#seconds;
    this.#minutes += Math.floor(this.#seconds / 60);
    this.#hours += Math.floor(this.#minutes / 60);
    this.#seconds %= 60;
    this.#minutes %= 60;
    let elapsed_time = "";
    if (this.#hours > 0) {
      elapsed_time += (this.#hours < 10 ? "0" : "") + this.#hours + ":";
    }
    if (this.#minutes > 0) {
      elapsed_time += (this.#minutes < 10 ? "0" : "") + this.#minutes + ":";
    }
    elapsed_time += (this.#seconds < 10 ? "0" : "") + this.#seconds;
    this.#timer.setText(elapsed_time);
  }

  game_over(state) {
    this.#restart_text.destroy();
    game.scene.start("endGame", { state: state });
  }
}
