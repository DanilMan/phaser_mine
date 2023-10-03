class Mine_Block extends Block {
  constructor(parent, img) {
    super(
      parent.scene,
      parent.x,
      parent.y,
      parent.posx,
      parent.posy,
      parent.width,
      img
    );
  }

  add_count_text() {
    //do nothing
  }

  delete_cover(clicked) {
    if (this.is_flag_visibile() || this.is_uncovered()) {
      return false;
    } else {
      this._cover.destroy();
      if (clicked) {
        this.setTint("0xff1a1a", "0xff1a1a", "0xff1a1a", "0xff1a1a");
      }
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
