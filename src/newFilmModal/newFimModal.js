import html from "./index.html";
import {
  getHistory
} from "../app-history";

const history = getHistory();

class Modal {
  constructor() {
    this.modal = html;
  }

  onClick(event) {
    if (event.target.tagName !== "button") return;

    event.preventDefault();
    history.push(event.target.href);
  }

  render() {
    const cont = document.createElement("div");
    cont.innerHTML = this.modal;

    return cont.firstChild;
  }
}


export default Modal;
