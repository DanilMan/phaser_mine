class Block{
	#mine_count = 0;

	get_mine_count() {
		return this.#mine_count;
	}

	set_mine_count(mine_count) {
		this.#mine_count = mine_count;
	}
}