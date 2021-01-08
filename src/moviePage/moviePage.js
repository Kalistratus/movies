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

const filmsArray = parseFilms(localStorage.getItem("films"));

const fullFilmInfo = filmsArray.filter((film) => {
  return film.id === history.location.pathname.slice(-36);
});


class MoviePage {
  constructor() {
    this.film = renderTemplate(html, {
      fullFilmInfo
    });
  }

  onClick(event) {
    if (event.target.tagName !== "button") return;

    event.preventDefault();
    history.push(event.target.href);
  }

  render() {
    this.film.addEventListener("click", this.onClick.bind(this));
    return this.film;
  }
}

export default MoviePage;