class Field extends Phaser.GameObjects.Container{
	#num_of_mines = 0;
	#mine_counter = 0;
	#rows = 16;
	#cols = 16;
	#on_down_pointee;
	blocks = [];

	constructor(scene, num_of_mines, mine_counter){
		super(scene);
		this.#diff_level(num_of_mines);
		this.#init_mine_counter(mine_counter);
		this.#init_field(scene);
		this.#init_mines();
		this.#add_to_scene();
	}

	get_num_of_mines(){
		return this.#num_of_mines;
	}

	#diff_level(num_of_mines){
		switch(num_of_mines){
			case 0:
				this.#num_of_mines = this.#rows;
				break;
			case 1:
				this.#num_of_mines = this.#rows*2;
				break;
			case 2:
				this.#num_of_mines = this.#rows*3;
				break;
			default:
				this.#num_of_mines = this.#rows*2;
		}
	}

	#init_mine_counter(mine_counter){
		this.#mine_counter = mine_counter;
		this.#mine_counter.setText(this.#num_of_mines);
	}

	#init_field(scene){
		for(let i = 0; i < this.#rows; i++){
			let row = [];
			for(let j = 0; j < this.#cols; j++){
				let size = Math.floor(game.canvas.width/this.#rows);
				let x = (i * size);
				let y = (j * size);
				row[j] = new Block(scene, x, y, size, "block");
			}
			this.blocks[i] = row;
		}
	}

	#init_mines(){
		var mine_pos = this.#get_ran_sel(this.#num_of_mines, (this.#rows * this.#cols));
		for(let i = 0; i < mine_pos.length; i++){
			let unseriealized_pos = mine_pos[i];
			let row = Math.floor(unseriealized_pos/this.#rows);
			let col = unseriealized_pos%this.#cols;
			let curr = this.blocks[row][col];
			this.blocks[row][col] = new Mine_Block(curr, "bomb");
			this.#inc_mine_counts(row, col);
		}
	}

	#inc_mine_counts(row, col){
		var beg = -1;
		var end = 1;
		for(let i = beg; i <= end; i++){
			if(row + i > this.blocks.length-1 || row + i < 0) continue;
			for(let j = beg; j <= end; j++){
				if(col + j > this.blocks.length-1 || col + j < 0) continue;
				let element = this.blocks[row+i][col+j];
				let curr_count = element.get_mine_count();
				element.set_mine_count(curr_count + 1);
			}
		}
	}

	#get_ran_sel(num_of_mines, field_range){
		var arr = [];
		while(arr.length < num_of_mines){
			var r = Math.floor(Math.random() * field_range);
			if(arr.indexOf(r) === -1) arr.push(r);
		}
		return arr;
	}

	#add_to_scene(){
		for(let i = 0; i < this.#rows; i++){
			for(let j = 0; j < this.#cols; j++){
				let block = this.blocks[i][j];
				block.add_blocks();
				block.add_count_text();
				block.add_cover();
				block.add_flag();
				block.setInteractive();
				block.on('pointerdown', this.#on_pointer_down, {container: this, pointee: block});
				block.on('pointerup', this.#on_pointer_up, {container: this, pointee: block});
			}
		}
	}

	#on_pointer_down(){
		if(this.pointee.get_cover().scene === undefined) return;
		this.container.#on_down_pointee = this.pointee;
	}

	#on_pointer_up(pointer){
		if(this.pointee.get_cover().scene === undefined) return;
		if(this.container.#on_down_pointee !== this.pointee) return;
		this.container.#on_down_pointee = undefined;
		if(pointer.upTime-pointer.downTime > 400){
			let isToggle = this.pointee.toggle_flag_visibility(this.container.#mine_counter.text > 0);
			if(isToggle){
				this.container.#update_mine_counter(this.pointee.get_flag_visibility());
			}
		}
		else{
			if(this.pointee.get_flag_visibility() === false){
				this.container.#delete_covers(this.pointee);
			}
		}
	}

	#update_mine_counter(is_visible){
		if(is_visible){
			this.#mine_counter.text--;
		}
		else{
			this.#mine_counter.text++;
		}
	}

	#delete_covers(pointee){
		if(pointee.get_mine_count() === "_"){
			this.#game_over();
		}
		else if(pointee.get_mine_count() === 0){ // use DFS algorithm to un_cover multiple blocks
			pointee.delete_cover(); // make sure the algorithm checks for visible flags as well
		}
		else{
			pointee.delete_cover();
		}
	}

	#game_over(){
		for(let i = 0; i < this.#rows; i++){
			for(let j = 0; j < this.#cols; j++){
				this.blocks[i][j].delete_cover();
			}
		}
	}

	debug_print_blocks(){
		var result = "\n";
		for(let i = 0; i < this.#rows; i++){
			for(let j = 0; j < this.#cols; j++){
				let element = this.blocks[j][i]; // somewhere the displayed tiles get flipped diag
				result += element.get_mine_count();
				result += ", ";
			}
			result += "\n";
		}
		console.log(result);
	}
}