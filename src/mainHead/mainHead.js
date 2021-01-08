import html from "./index.html";


class MainHead {
  constructor() {
    this.head = html;
  }

  render() {
    const container = document.createElement("div");
    container.innerHTML = this.head;
    return container.firstChild;
  }
}

export default MainHead;