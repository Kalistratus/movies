import html from "./index.html";
import {
  renderTemplate
} from "../template-utils";
import films from "./filmList.json";
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


const filmsArray = localStorage.films ? parseFilms(localStorage.getItem("films")) : films;
localStorage.setItem("films", JSON.stringify(filmsArray));

class List {
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

export default List;