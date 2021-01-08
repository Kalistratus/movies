import html from "./index.html";
import {
  renderTemplate
} from "../template-utils";
import {
  getHistory
} from "../app-history";

const history = getHistory();

function parseFilms(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    console.error("Something went wrong");
    return null;
  }
}


const filmsArray = localStorage.filmsFiltered ? parseFilms(localStorage.getItem("filmsFiltered")) : [];
localStorage.setItem("filmsFiltered", JSON.stringify(filmsArray));

class ListFiltered {
  constructor() {
    this.films = renderTemplate(html, {
      filmsArray
    });
  }

  onClick(event) {
    if (event.target.tagName !== "button" || "a") return;

    event.preventDefault();
    history.push(event.target.href);
  }

  render() {
    this.films.addEventListener("click", this.onClick.bind(this));
    return this.films;
  }
}

export default ListFiltered;