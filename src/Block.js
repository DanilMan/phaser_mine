class Block extends Phaser.GameObjects.TileSprite {
  #mine_count = 0;
  #size = 0;
  posx;
  posy;
  _background_img;
  _cover;
  _flag;
  #flag_order = 0;
  _x;

  constructor(scene, x, y, i, j, size, img) {
    super(scene, x, y, size, size, img);
    this.posx = i;
    this.posy = j;
    this.#size = size;
    this._background_img = img;
    this.setOrigin(0, 0);
    //this.setTileScale(2); add this in later if you choose to add a resized grid option.
  }

  add_blocks() {
    this.scene.add.existing(this);
  }

  add_count_text() {
    if (this.get_mine_count() !== 0) {
      var text = this.scene.add.text(this.x, this.y, this.get_mine_count());
      text.setFontSize(this.#size);
      text.setColor("#ebedf0");
      text.setOrigin(-0.3, -0.1); // find a less icky way to do this. should be setOrigin(0.5, 0.5)
    }
  }

  add_cover() {
    this._cover = this.scene.add.sprite(this.x, this.y, "cover");
    this._cover.setOrigin(0, 0);
    //this._cover.setScale(2);
  }

  add_item() {
    // do nothing
  }

  pointer_del_cover() {
    if (this.is_uncovered()) {
      return false;
    } else {
      this._cover.destroy();
      return true;
    }
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

  explode() {
    // if (this._flag.scene !== undefined) return; // I don't like the way it looks (only exploding unexploded blocks)
    this._cover.destroy();
    this._flag.destroy();
    let explode = this.scene.add.sprite(this.x, this.y, "explosion");
    explode.setOrigin(0, 0);
    explode.play("explode");
    explode.once('animationcomplete', () => {
      explode.destroy();
    });
  }

  add_flag() {
    this._flag = this.scene.add.sprite(this.x, this.y, "flag");
    this._flag.setOrigin(0, 0);
    this._flag.setVisible(false);
    //this._flag.setScale(2);
  }

  add_x() {
    this._x = this.scene.add.sprite(this.x, this.y, "x");
    this._x.setOrigin(0, 0);
    this._x.setVisible(false);
    //this._x.setScale(2);
  }

  get_mine_count() {
    return this.#mine_count;
  }

  set_mine_count(mine_count) {
    this.#mine_count = mine_count;
  }

  is_far() {
    return this.#mine_count === 0;
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

  get_flag_order(){
    return this.#flag_order;
  }

  set_flag_order(pos){
    this.#flag_order = pos;
  }

  is_mine() {
    return false;
  }
}
