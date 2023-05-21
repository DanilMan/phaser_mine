class Mine_Block extends Block{
	constructor(parent, img){
		super(parent.scene, parent.x, parent.y, parent.width, img);
	}

	add_count_text(){
		//do nothing
	}

	get_mine_count(){
		return "_";
	}

	set_mine_count(mine_count){
		//do nothing
	}
}