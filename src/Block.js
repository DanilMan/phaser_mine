class Block extends Phaser.GameObjects.TileSprite{
	#mine_count = 0;
	#size = 0;
	_flag;
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

	add_cover(){
		this._cover = this.scene.add.sprite(this.x,this.y,"cover");
		this._cover.setOrigin(0,0);
	}

	delete_cover(){
		this._cover.destroy();
		//this._flag.destroy(); // instead maybe add sprite for when flag is incorrelly placed
	}

	add_flag() {
		this._flag = this.scene.add.sprite(this.x,this.y,"flag");
		this._flag.setOrigin(0,0);
		this._flag.setVisible(false);
	}

	get_mine_count() {
		return this.#mine_count;
	}

	set_mine_count(mine_count) {
		this.#mine_count = mine_count;
	}

	get_cover() {
		return this._cover;
	}

	get_flag_visibility(){
		return this._flag.visible;
	}

	toggle_flag_visibility(hasFlags){
		var isToggle = this._flag.visible || hasFlags;
		if(isToggle){
			this._flag.setVisible(!this._flag.visible);
		}
		return isToggle;
	}
}