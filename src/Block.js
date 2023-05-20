class Block extends Phaser.GameObjects.TileSprite{
	#mine_count = 0;
	#size = 0;
	_cover;

	constructor(scene, x, y, size, img){
		super(scene, x, y, size, size, img);
		this.#size = size;
		this.setOrigin(0,0);
	}

	add_blocks() {
		this.scene.add.existing(this);
	}

	add_count_text(){
		var text = this.scene.add.text(this.x, this.y, this.#mine_count);
		text.setFontSize(this.#size);
		text.setColor("black");
	}
	// use up and down to check time between up and down for flaging vs selecting
	// add a pointerover and pointerout mouselistener that will listen if and set
	// over field to true or false
	add_cover(){
		this._cover = this.scene.add.sprite(this.x,this.y,"block");
		this._cover.setOrigin(0,0);
		this._cover.setInteractive();
		this._cover.on('pointerdown', this.#cover_clicked);
		this._cover.on('pointerup', this.#cover_unclicked);
	}

	#cover_clicked(){
		//console.log("clicked", this.x, this.y);
		this.destroy();
	}

	#cover_unclicked(){
		//console.log("unclicked", this.x, this.y);
	}

	delete_cover(){
		this._cover.destroy();
	}

	get_mine_count() {
		return this.#mine_count;
	}

	set_mine_count(mine_count) {
		this.#mine_count = mine_count;
	}
}