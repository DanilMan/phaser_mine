class Field {
	#num_of_mines;
	#rows = 16;
	#cols = 16;
	blocks = [];

	constructor(num_of_mines){
		this.#diff_level(num_of_mines);
		this.#init_field();
		this.#init_mines();
	}

	get_num_of_mines(){
		return this.#num_of_mines;
	}

	#diff_level(num_of_mines){
		switch(num_of_mines){
			case 0:
				this.#num_of_mines = 15;
				break;
			case 1:
				this.#num_of_mines = 30;
				break;
			case 2:
				this.#num_of_mines = 50;
				break;
			default:
				this.#num_of_mines = 30;
		}
	}

	#init_field(){
		for(let i = 0; i < this.#rows; i++){
			let row = [];
			for(let j = 0; j < this.#cols; j++){
				row[j] = new Block();
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
			this.blocks[row][col] = new Mine_Block();
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

	debug_print_blocks(){
		var result = "\n";
		for(let i = 0; i < this.#rows; i++){
			for(let j = 0; j < this.#cols; j++){
				let element = this.blocks[i][j];
				result += element.get_mine_count();
				result += ", ";
			}
			result += "\n";
		}
		console.log(result);
	}
}