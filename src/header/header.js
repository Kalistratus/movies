import html from "./index.html";

class Header {
  constructor() {
    this.header = html;
  }

  render() {
    const cont = document.createElement("div");
    cont.innerHTML = this.header;

    return cont.firstChild;
  }
}

export default Header;