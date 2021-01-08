import html from "./index.html";
class Container {
  constructor() {
    this.container = html;
  }

  render() {
    const container = document.createElement("div");
    container.innerHTML = this.container;

    return container.firstChild;
  }
}

export default Container;