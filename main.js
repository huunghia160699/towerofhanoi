const towerOfHanoi = {
  curPeg: 0,
  highPos: "265px",
  lastPeg: "",
  selectedDisk: "",
  lastPos: 0,
  pegs: {
    0: [],
    1: [],
    2: [],
  },
  pointer: {
    "-2": "-420",
    "-1": "-210",
    0: "5",
    1: "215",
    2: "425",
  },
  color: [
    "#d53e4f",
    "#f46d43",
    "#fdae61",
    "#fee08b",
    "#e6f598",
    "#abdda4",
    "#66c2a5",
    "#3288bd",
  ],
  setupDisks() {
    for (let i = this.color.length - 1; i >= 0; i--) {
      this.pegs[0].push(i);
    }
    this.render();
  },
  render() {
    const pegsNode = document.querySelectorAll(".peg");
    for (let i = 0; i < Object.keys(this.pegs).length; i++) {
      pegsNode[i].innerHTML = "";
      this.pegs[i].forEach((disk, j) => {
        const diskElement = document.createElement("div");
        diskElement.className = "disk";
        diskElement.style.width = `${disk * 20 + 50}px`; // Adjust width based on disk size
        diskElement.style.height = `${20}px`;
        diskElement.style.borderRadius = `${20}px`;
        diskElement.style.bottom = `${j * 20}px`;
        diskElement.style.backgroundColor = this.color[disk];
        pegsNode[i].appendChild(diskElement);
      });
    }
  },
  movePointer(key) {
    let t = this.curPeg;
    if (key == "ArrowRight") t = t < 2 ? (t += 1) : 0;
    if (key == "ArrowLeft") t = t > 0 ? (t -= 1) : 2;
    document.querySelector(".pointer img").style.left = `${this.pointer[t]}px`;
    this.curPeg = t;
    if (this.selectedDisk != "") {
      this.selectedDisk.style.left = `${
        this.pointer[this.curPeg - this.lastPeg]
      }px`;
    }
  },
  swapDisk(source, target) {
    //
    let t = this.pegs[target];
    let s = this.pegs[source];
    if (t.length == 0 || s[s.length - 1] < t[t.length - 1]) {
      this.selectedDisk.style.bottom = `${
        this.pegs[this.curPeg].length * 20
      }px`;
      this.pegs[target].push(this.pegs[source].pop());
      setTimeout(() => {
        this.render();
        console.log("đặt đĩa");
        this.resetDisk();
      }, 200);
    } else {
      console.log("Không đổi được");
    }
  },
  resetDisk() {
    this.selectedDisk = "";
    this.lastPeg = "";
    this.lastPos = "";
  },
  placeDisk(dk) {
    if (dk) {
      this.selectedDisk.style.bottom = this.lastPos;
      this.resetDisk();
    }
    if (!dk) {
      this.swapDisk(this.lastPeg, this.curPeg);
    }
  },
  getDisk() {
    // Chưa chọn đĩa
    let dk1 = this.selectedDisk; // không có đĩa được chọn
    let dk2 = this.pegs[this.curPeg].length === 0; // cột không có đĩa
    if ((dk1 == "") & dk2) return; // ko có đĩa chọn và ko có đĩa ở cột thì return
    if (dk1 == "") {
      // ko có đĩa chọn và cột có đĩa
      console.log("Lấy đĩa");
      let l = this.pegs[this.curPeg].length - 1;
      let disk = document.querySelectorAll(`#peg${this.curPeg} .disk`)[l];
      this.lastPos = disk.style.bottom;
      this.lastPeg = this.curPeg;
      disk.style.bottom = this.highPos;
      this.selectedDisk = disk;
      return;
    }

    if ((dk1 != "") & (this.curPeg == this.lastPeg)) {
      this.placeDisk(true);
      console.log("trả đĩa");
      return;
    }
    if ((dk1 != "") & (this.curPeg != this.lastPeg)) {
      this.placeDisk(false);
      return;
    }
  },
  handleEvents() {
    window.onkeydown = (e) => {
      //
      if (e.key == " ") {
        this.getDisk();
      } else if (e.key == "ArrowRight" || e.key == "ArrowLeft") {
        this.movePointer(e.key);
      }
    };
  },
  start() {
    this.setupDisks();
    this.handleEvents();
  },
};
towerOfHanoi.start();
