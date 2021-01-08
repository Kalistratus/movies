import html from "./index.html";

class Footer {
  constructor() {
    this.footer = html;
  }

  render() {
    const container = document.createElement("div");
    container.innerHTML = this.footer;
    return container.firstChild;
  }
}

export default Footer;