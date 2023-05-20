class Mine_Field extends Phaser.Scene {
	//var scene_field;

	constructor() {
		super("playGame");
	}

	preload(){
		this.load.image("block", "assets/imgs/block.png");
		this.load.image("bomb", "assets/imgs/bomb1.png");
	}

	create(){
		this.scene_field = new Field(this, 1);
		//this.scene_field.debug_print_blocks();
	}
}