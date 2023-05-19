class Mine_Field extends Phaser.Scene {
	constructor() {
		super("playGame");
	}

	init(){
		var test = new Field(1);
		test.debug_print_blocks();
	}

	create(){
		this.add.text(20,20, "Mine_Field");
	}
}