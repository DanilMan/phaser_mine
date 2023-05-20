class Mine_Block extends Block{
	constructor(parent, img){
		super(parent.scene, parent.x, parent.y, parent.width, img);
	}

	add_count_text(){
		//do nothing
	}

	add_cover(){
		this._cover = this.scene.add.sprite(this.x,this.y,"block");
		this._cover.setOrigin(0,0);
		this._cover.setInteractive();
		this._cover.on('pointerdown', this.#cover_clicked, {obj: this});
		this._cover.on('pointerup', this.#cover_unclicked);
	}

	#cover_clicked(obj){
		//console.log("clickededed", this.x, this.y);
		this.obj.scene.scene_field.game_over();
	}

	#cover_unclicked(){
		//console.log("unclickededed", this.x, this.y);
	}

	delete_cover(){
		this._cover.destroy();
	}

	get_mine_count(){
		return "_";
	}

	set_mine_count(mine_count){
		//do nothing
	}
}