import html from "./index.html";


class Main {
  constructor() {
    this.main = html;
  }

  render() {
    const container = document.createElement("div");
    container.innerHTML = this.main;
    return container.firstChild;
  }
}

export default Main;