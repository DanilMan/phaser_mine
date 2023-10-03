class Block extends Phaser.GameObjects.TileSprite {
  #mine_count = 0;
  #size = 0;
  posx;
  posy;
  _cover;
  _flag;
  _x;

  constructor(scene, x, y, i, j, size, img) {
    super(scene, x, y, size, size, img);
    this.posx = i;
    this.posy = j;
    this.#size = size;
    this.setOrigin(0, 0);
  }

  add_blocks() {
    this.scene.add.existing(this);
  }

  add_count_text() {
    if (this.get_mine_count() !== 0) {
      var text = this.scene.add.text(this.x, this.y, this.get_mine_count());
      text.setFontSize(this.#size);
      text.setColor("black");
      text.setOrigin(-0.3, -0.1); // find a less icky way to do this. should be setOrigin(0.5, 0.5)
    }
  }

  add_cover() {
    this._cover = this.scene.add.sprite(this.x, this.y, "cover");
    this._cover.setOrigin(0, 0);
  }

  delete_cover() {
    if (this.is_uncovered()) {
      return false;
    } else if (this.is_flag_visibile()) {
      this._x.visible = true;
      return false;
    } else {
      this._cover.destroy();
      return true;
    }
  }

  add_flag() {
    this._flag = this.scene.add.sprite(this.x, this.y, "flag");
    this._flag.setOrigin(0, 0);
    this._flag.setVisible(false);
  }

  add_x() {
    this._x = this.scene.add.sprite(this.x, this.y, "x");
    this._x.setOrigin(0, 0);
    this._x.setVisible(false);
  }

  get_mine_count() {
    return this.#mine_count;
  }

  set_mine_count(mine_count) {
    this.#mine_count = mine_count;
  }

  is_uncovered() {
    return this._cover.scene === undefined;
  }

  is_flag_visibile() {
    return this._flag.visible;
  }

  toggle_flag_visibility(hasFlags) {
    var isToggle = this._flag.visible || hasFlags;
    if (isToggle) {
      this._flag.setVisible(!this._flag.visible);
    }
    return isToggle;
  }

  set_flag_visible() {
    // do nothing
  }

  is_mine() {
    return false;
  }
}
