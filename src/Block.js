class Block extends Phaser.GameObjects.TileSprite{
	#mine_count = 0;
	#size;

	constructor(scene, x, y, size, img){
		super(scene, x, y, size, size, img);
		this.#size = size;
		this.setOrigin(0,0);
	}

	add_count_text(){
		var text = this.scene.add.text(this.x, this.y, this.#mine_count);
		text.setFontSize(this.#size);
		text.setColor("black");
	}

	add() {
		this.scene.add.existing(this);
	}

	get_mine_count() {
		return this.#mine_count;
	}

	set_mine_count(mine_count) {
		this.#mine_count = mine_count;
	}
}