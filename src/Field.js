class Field extends Phaser.GameObjects.Container {
  #num_of_blocks = 0;
  #num_of_mines = 0;
  #mine_counter = 0;
  #rows = 16;
  #cols = 16;
  #pointer_flag_time = 300;
  #on_down_pointee;
  blocks = [];

  constructor(scene, num_of_mines, mine_counter) {
    super(scene);
    this.#diff_level(num_of_mines);
    this.#init_mine_counter(mine_counter);
    this.#init_field(scene);
    this.#init_mines();
    this.#add_to_scene();
  }

  get_num_of_mines() {
    return this.#num_of_mines;
  }

  #diff_level(num_of_mines) {
    switch (num_of_mines) {
      case 0:
        this.#num_of_mines = this.#rows;
        break;
      case 1:
        this.#num_of_mines = this.#rows * 2;
        break;
      case 2:
        this.#num_of_mines = this.#rows * 3;
        break;
      default:
        this.#num_of_mines = this.#rows * 2;
    }
    this.#num_of_blocks = this.#cols * this.#rows - this.#num_of_mines;
  }

  #init_mine_counter(mine_counter) {
    this.#mine_counter = mine_counter;
    this.#mine_counter.setText(this.#num_of_mines);
  }

  #init_field(scene) {
    for (let i = 0; i < this.#rows; i++) {
      let row = [];
      for (let j = 0; j < this.#cols; j++) {
        let size = Math.floor(game.canvas.width / this.#rows);
        let x = i * size;
        let y = j * size;
        row[j] = new Block(scene, x, y, i, j, size, "block");
      }
      this.blocks[i] = row;
    }
  }

  #get_ran_sel(num_of_mines, field_range) {
    var arr = [];
    while (arr.length < num_of_mines) {
      var r = Math.floor(Math.random() * field_range);
      if (arr.indexOf(r) === -1) arr.push(r);
    }
    return arr;
  }

  #init_mines() {
    var mine_pos = this.#get_ran_sel(
      this.#num_of_mines,
      this.#rows * this.#cols
    );
    for (let i = 0; i < mine_pos.length; i++) {
      let unseriealized_pos = mine_pos[i];
      let row = Math.floor(unseriealized_pos / this.#rows);
      let col = unseriealized_pos % this.#cols;
      let curr = this.blocks[row][col];
      this.blocks[row][col] = new Mine_Block(curr, "bomb");
      this.#inc_mine_counts(row, col);
    }
  }

  #inc_mine_counts(row, col) {
    var beg = -1;
    var end = 1;
    for (let i = beg; i <= end; i++) {
      if (row + i > this.blocks.length - 1 || row + i < 0) continue;
      for (let j = beg; j <= end; j++) {
        if (col + j > this.blocks.length - 1 || col + j < 0) continue;
        let element = this.blocks[row + i][col + j];
        let curr_count = element.get_mine_count();
        element.set_mine_count(curr_count + 1);
      }
    }
  }

  #add_to_scene() {
    for (let i = 0; i < this.#rows; i++) {
      for (let j = 0; j < this.#cols; j++) {
        let block = this.blocks[i][j];
        block.add_blocks();
        block.add_count_text();
        block.add_cover();
        block.add_flag();
        block.add_x();
        block.setInteractive();
        block.on("pointerdown", this.#on_pointer_down, {
          container: this,
          pointee: block,
        });
        block.on("pointerup", this.#on_pointer_up, {
          container: this,
          pointee: block,
        });
      }
    }
  }

  #on_pointer_down(pointer) {
    if (this.pointee.is_uncovered()) return;
    this.container.#on_down_pointee = this.pointee;
    pointer.timer = this.container.scene.time.delayedCall(
      this.container.#pointer_flag_time,
      this.container.#set_block_flag,
      [pointer],
      this
    );
  }

  #set_block_flag(pointer) {
    if (this.pointee.is_uncovered()) return;
    let is_toggle = this.pointee.toggle_flag_visibility(
      this.container.#mine_counter.text > 0
    );
    if (is_toggle) {
      this.container.#update_mine_counter(this.pointee.is_flag_visibile());
    }
  }

  #on_pointer_up(pointer) {
    pointer.timer.destroy();
    if (this.pointee.is_uncovered()) return;
    if (this.container.#on_down_pointee !== this.pointee) return;
    this.container.#on_down_pointee = undefined;
    if (this.pointee.is_flag_visibile() === false) {
      if (
        pointer.upTime - pointer.downTime <
        this.container.#pointer_flag_time
      ) {
        this.container.#un_cover(this.pointee);
      }
    }
  }

  #update_mine_counter(is_visible) {
    if (is_visible) {
      this.#mine_counter.text--;
    } else {
      this.#mine_counter.text++;
    }
  }

  #un_cover(pointee) {
    if (pointee.is_mine()) {
      pointee.delete_cover(true);
      this.#game_over();
    } else if (pointee.get_mine_count() === 0) {
      this.#delete_covers_dfs(pointee);
    } else {
      if (pointee.delete_cover(false)) {
        this.#num_of_blocks--;
        this.#check_win_condition();
      }
    }
  }

  #game_over() {
    this.#delete_all_covers();
    this.scene.game_over(0);
  }

  #check_win_condition() {
    if (this.#num_of_blocks === 0) {
      this.#game_win();
    }
  }

  #game_win() {
    this.#set_mine_flags_vis();
    this.#mine_counter = 0;
    this.scene.game_over(1);
  }

  #delete_all_covers() {
    for (let i = 0; i < this.#rows; i++) {
      for (let j = 0; j < this.#cols; j++) {
        this.blocks[i][j].delete_cover(false);
      }
    }
  }

  #set_mine_flags_vis() {
    for (let i = 0; i < this.#rows; i++) {
      for (let j = 0; j < this.#cols; j++) {
        this.blocks[i][j].set_flag_visible();
      }
    }
  }

  #delete_covers_dfs(pointee) {
    const sole_blocks = new Set();
    const adj_blocks = new Set();
    const search_stack = [pointee];
    while (search_stack.length) {
      let bottom = search_stack.at(length - 1);
      search_stack.pop();
      // if not already checked block or flagged
      if (
        !sole_blocks.has(bottom) &&
        !adj_blocks.has(bottom) &&
        !bottom.is_flag_visibile()
      ) {
        if (bottom.get_mine_count() === 0) {
          sole_blocks.add(bottom);
          this.check_near_blocks(search_stack, bottom);
        } else if (!bottom.is_mine()) {
          adj_blocks.add(bottom);
        }
      }
    }
    for (const block of sole_blocks) {
      if (block.delete_cover(false)) this.#num_of_blocks--;
    }
    for (const block of adj_blocks) {
      if (block.delete_cover(false)) this.#num_of_blocks--;
    }
    this.#check_win_condition();
  }

  check_near_blocks(stack, block) {
    let is_top_block = block.posx - 1 > -1;
    let is_bot_block = block.posx + 1 < this.#rows;
    let is_left_block = block.posy - 1 > -1;
    let is_right_block = block.posy + 1 < this.#cols;
    let posx = block.posx;
    let posy = block.posy;
    if (is_top_block) {
      stack.push(this.blocks[posx - 1][posy]); // top center
      if (is_left_block) {
        stack.push(this.blocks[posx - 1][posy - 1]); // top left
      }
      if (is_right_block) {
        stack.push(this.blocks[posx - 1][posy + 1]); // top right
      }
    }
    if (is_bot_block) {
      stack.push(this.blocks[posx + 1][posy]); // bot center
      if (is_left_block) {
        stack.push(this.blocks[posx + 1][posy - 1]); // bot left
      }
      if (is_right_block) {
        stack.push(this.blocks[posx + 1][posy + 1]); // bot right
      }
    }
    if (is_left_block) {
      stack.push(this.blocks[posx][posy - 1]); // left middle
    }
    if (is_right_block) {
      stack.push(this.blocks[posx][posy + 1]); // right middle
    }
  }

  debug_print_blocks() {
    var result = "\n";
    for (let i = 0; i < this.#rows; i++) {
      for (let j = 0; j < this.#cols; j++) {
        let element = this.blocks[j][i]; // somewhere the displayed tiles get flipped diag
        result += element.get_mine_count();
        result += ", ";
      }
      result += "\n";
    }
    console.log(result);
  }
}
