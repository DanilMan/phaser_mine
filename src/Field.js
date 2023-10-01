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

  #get_ran_sel(num_of_mines, field_range) {
    var arr = [];
    while (arr.length < num_of_mines) {
      var r = Math.floor(Math.random() * field_range);
      if (arr.indexOf(r) === -1) arr.push(r);
    }
    return arr;
  }

  #add_to_scene() {
    for (let i = 0; i < this.#rows; i++) {
      for (let j = 0; j < this.#cols; j++) {
        let block = this.blocks[i][j];
        block.add_blocks();
        block.add_count_text();
        block.add_cover();
        block.add_flag();
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
    if (this.pointee.get_cover().scene === undefined) return;
    this.container.#on_down_pointee = this.pointee;
    pointer.timer = this.container.scene.time.delayedCall(
      this.container.#pointer_flag_time,
      this.container.#set_block_flag,
      [pointer],
      this
    );
  }

  #set_block_flag(pointer) {
    if (this.pointee.get_cover().scene === undefined) return; //probably redundant
    let isToggle = this.pointee.toggle_flag_visibility(
      this.container.#mine_counter.text > 0
    );
    if (isToggle) {
      this.container.#update_mine_counter(this.pointee.get_flag_visibility());
    }
  }

  #on_pointer_up(pointer) {
    pointer.timer.destroy();
    if (this.pointee.get_cover().scene === undefined) return;
    if (this.container.#on_down_pointee !== this.pointee) return;
    this.container.#on_down_pointee = undefined;
    if (this.pointee.get_flag_visibility() === false) {
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
    if (pointee.get_mine_count() === "_") {
      this.#game_over();
    } else if (pointee.get_mine_count() === 0) {
      this.#delete_covers_dfs(pointee);
    } else {
      if (pointee.delete_cover()) {
        this.#num_of_blocks--;
        this.#check_endgame();
      }
    }
  }

  #game_over() {
    for (let i = 0; i < this.#rows; i++) {
      for (let j = 0; j < this.#cols; j++) {
        this.blocks[i][j].delete_cover();
      }
    }
    this.scene.game_over(0);
  }

  #check_endgame() {
    if (this.#num_of_blocks === 0) {
      // should covers be deleted in win state?
      this.scene.game_over(1);
    } // if not then lock flags
  }

  #delete_covers_dfs(pointee) {
    // might potentially clean up method later
    const sole_blocks = new Set();
    const adj_blocks = new Set();
    const search_stack = [pointee];
    while (search_stack.length) {
      // while stack is not empty
      let bot = search_stack.at(length - 1);
      search_stack.pop();
      // if not already checked block or flagged
      if (
        !sole_blocks.has(bot) &&
        !adj_blocks.has(bot) &&
        !bot.get_flag_visibility()
      ) {
        if (bot.get_mine_count() === 0) {
          sole_blocks.add(bot);
          // clean this up with a method
          if (bot.posx - 1 > -1) {
            search_stack.push(this.blocks[bot.posx - 1][bot.posy]); // top
            if (bot.posy - 1 > -1) {
              if (
                this.blocks[bot.posx - 1][bot.posy - 1].get_mine_count() !== 0
              ) {
                // if the way mines are spawned is fixed, with no mines 2 diags away
                // instead only one diag away or greater than 2, then the not equal
                // to zero condition can be removed.
                search_stack.push(this.blocks[bot.posx - 1][bot.posy - 1]); // top left
              }
            }
          }
          if (bot.posy - 1 > -1) {
            search_stack.push(this.blocks[bot.posx][bot.posy - 1]); // left
            if (bot.posx + 1 < this.#rows) {
              if (
                this.blocks[bot.posx + 1][bot.posy - 1].get_mine_count() !== 0
              ) {
                search_stack.push(this.blocks[bot.posx + 1][bot.posy - 1]); // bottom left
              }
            }
          }
          if (bot.posx + 1 < this.#rows) {
            search_stack.push(this.blocks[bot.posx + 1][bot.posy]); // bottom
            if (bot.posy + 1 < this.#cols) {
              if (
                this.blocks[bot.posx + 1][bot.posy + 1].get_mine_count() !== 0
              ) {
                search_stack.push(this.blocks[bot.posx + 1][bot.posy + 1]); // bottom right
              }
            }
          }
          if (bot.posy + 1 < this.#cols) {
            search_stack.push(this.blocks[bot.posx][bot.posy + 1]); // right
            if (bot.posx - 1 > -1) {
              if (
                this.blocks[bot.posx - 1][bot.posy + 1].get_mine_count() !== 0
              ) {
                search_stack.push(this.blocks[bot.posx - 1][bot.posy + 1]); // top right
              }
            }
          }
        } else if (bot.get_mine_count() !== "_") {
          adj_blocks.add(bot);
        }
      }
    }
    for (const block of sole_blocks) {
      if (block.delete_cover()) this.#num_of_blocks--;
    }
    for (const block of adj_blocks) {
      if (block.delete_cover()) this.#num_of_blocks--;
    }
    this.#check_endgame();
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
