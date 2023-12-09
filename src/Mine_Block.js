class Mine_Block extends Block {
  #mine_img;
  #mine;

  constructor(scene, x, y, i, j, size, background_img, img) {
    super(scene, x, y, i, j, size, background_img);
    this.#mine_img = img;
  }

  add_count_text() {
    //do nothing
  }

  add_item() {
    this.#mine = this.scene.add.sprite(this.x, this.y, this.#mine_img);
    this.#mine.setOrigin(0, 0);
    //this.#mine.setScale(2);
  }

  pointer_del_cover() {
    if (this.is_uncovered()) {
      return false;
    } else {
      this._cover.destroy();
      this.setTint("0xff1a1a", "0xff1a1a", "0xff1a1a", "0xff1a1a");
      this.#mine.setTint("0xff1a1a", "0xff1a1a", "0xff1a1a", "0xff1a1a");
      return true;
    }
  }

  delete_cover() {
    if (this.is_flag_visibile() || this.is_uncovered()) {
      return false;
    } else {
      this._cover.destroy();
      return true;
    }
  }

  get_mine_count() {
    return "_";
  }

  set_mine_count(mine_count) {
    //do nothing
  }

  set_flag_visible() {
    this._flag.setVisible(true);
  }

  is_mine() {
    return true;
  }
}
