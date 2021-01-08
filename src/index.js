import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import "./style.css";
import {
  getHistory
} from "./app-history";
import Container from "./container/container";
import Header from "./header/header";
import Main from "./main/main";
import List from "./films/films";
import MainHead from "./mainHead/mainHead";
import Footer from "./footer/footer";
import Modal from "./newFilmModal/newFimModal";
import MoviePage from "./moviePage/moviePage";
import ListFiltered from "./filmsFiltered/filmsFiltered";
import {
  v4 as uuidv4
} from 'uuid';

import {
  stringify, parse
} from "query-string";


function parseFilms(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    console.error("Something went wrong");
    return null;
  }
}

//history
const history = getHistory();

//container
const container = new Container();
document.body.appendChild(container.render());
const containerTag = document.querySelector("div.container");

//header
const header = new Header();
containerTag.appendChild(header.render());

//search
const searchInput = document.querySelector("#search input");
const searchButton = document.querySelector("#search button");

searchButton.addEventListener("click", () => {
  const query = searchInput.value;

  filmsArray = parseFilms(localStorage.getItem("films"));
  const filmsArrayFiltered = filmsArray.filter((elem) => {
    if (elem.name.toUpperCase().includes(query.toUpperCase())) return elem;
  });

  localStorage.setItem("filmsFiltered", JSON.stringify(filmsArrayFiltered));
})

//main
const main = new Main();
containerTag.appendChild(main.render());
const mainTag = document.querySelector("main");

//modal window
const modal = new Modal();
containerTag.appendChild(modal.render());
const modalTag = document.querySelector("#myModal");

let newId = ""; // new movie uuid
let curId = ""; // existing movie uuid
let src = ""; // poster url
let filmsArray = []; // films list

// add new film modal window
$('#add-new').on('click', function () {
  $(modalTag).modal('show');
  document.querySelectorAll('[data-input="true"]').forEach(elem => elem.value = "");
  return newId = uuidv4();
});



// обработка кликов на кнопки
document.addEventListener('click', (event) => {
  switch (event.target.dataset.name) {

    case "edit":
      if (event.target.dataset.name !== "edit") return;
      $(modalTag).modal('show');

      parseFilms(localStorage.getItem("films")).forEach(element => {
        if (element.id === event.target.dataset.id) {
          const inputs = document.querySelectorAll('[data-input="true"]');

          for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = element[inputs[i].dataset.id] || "";
          }
          return curId = element.id;
        }
      });
      break;

    case "delete":
      if (event.target.dataset.name !== "delete") return;
      const isDeleteFilm = confirm("Удалить этот фильм?");

      if (isDeleteFilm) {
        filmsArray = parseFilms(localStorage.getItem("films"));

        filmsArray.forEach(element => {
          if (element.id === event.target.dataset.id) {
            filmsArray.splice(filmsArray.indexOf(element), 1);
            localStorage.setItem("films", JSON.stringify(filmsArray));
          }
        });

        window.location.pathname = "/list";
      }
      break;

    case "like":
      if (event.target.dataset.name !== "like") return;
      filmsArray = parseFilms(localStorage.getItem("films"));

      filmsArray.forEach(element => {
        if (element.id === event.target.dataset.id) {
          element.like++;
          localStorage.setItem("films", JSON.stringify(filmsArray));
          const like = document.querySelector('button[data-name="like"]');
          like.dataset.count = element.like;
          like.disabled = true;
          document.querySelector('button[data-name="dislike"]').disabled = true;
        }
      });
      break;

    case "dislike":
      if (event.target.dataset.name !== "dislike") return;
      filmsArray = parseFilms(localStorage.getItem("films"));

      filmsArray.forEach(element => {
        if (element.id === event.target.dataset.id) {
          if (element.dislike === -2) element.dislike -= 2;
          else element.dislike--;

          localStorage.setItem("films", JSON.stringify(filmsArray));
          const dislike = document.querySelector('button[data-name="dislike"]');
          dislike.dataset.count = element.dislike;
          dislike.disabled = true;
          document.querySelector('button[data-name="like"]').disabled = true;
        }
      });
      break;

    default:
      break;
  }
});




function renderRoute(path) {
  switch (path) {
    case "/list":
      mainTag.removeChild(mainTag.firstChild);
      const list = new List();
      mainTag.appendChild(list.render());
      break;
    case "/list-" + history.location.pathname.slice(-36):
      mainTag.removeChild(mainTag.firstChild);
      const movie = new MoviePage();
      mainTag.appendChild(movie.render());
      break;
    case "/search":
      if(parseFilms(localStorage.getItem("filmsFiltered")).length === 0) {
        const div = document.createElement("div");
        div.innerText = "Поиск не дал результатов... Попробуйте ещё раз.";
        mainTag.appendChild(div);
      } else {
      const listFiltered = new ListFiltered();
      mainTag.appendChild(listFiltered.render());
      }
      break;
    default:
      const img = document.createElement("img");
      img.src = "https://www.artzstudio.com/wp-content/uploads/2020/05/404-error-not-found-page-lost-1024x788.png";
      mainTag.appendChild(img);
      break;
  }
}

// путь к изображению постера
const file = document.querySelector('input[type="file"]');
file.addEventListener('change', (e) => {
  if (file.files.length === 0) return;

  const f = file.files[0];
  const fr = new FileReader();
  if (f.type.indexOf('image') === -1) return;

  fr.onload = (e) => src = e.target.result;
  fr.readAsDataURL(f);
});


// создать новый фильм
function createNewFilm(url) {
  const newFilm = {};

  document.querySelectorAll('[data-input="true"]').forEach((input) => {
    newFilm[input.dataset.id] = input.value
  });
  newFilm.photo = url;

  return newFilm;
}

// нажатие на кнопку "сохранить"
$('#save-film').on('click', () => {
  filmsArray = parseFilms(localStorage.getItem("films"));

  if (newId) {
    const newFilmHtml = createNewFilm(src);

    newFilmHtml.id = newId;
    newFilmHtml.like = 0;
    newFilmHtml.dislike = 0;
    filmsArray.push(newFilmHtml);
    localStorage.setItem("films", JSON.stringify(filmsArray));

    $(modalTag).modal('hide');
    window.location.pathname = "/list";
    return newId = "";

  } else {
    filmsArray.forEach(elem => {
      if (elem.id === curId) {
        src = src || elem.photo;
        filmsArray.splice(filmsArray.indexOf(elem), 1);

        const newFilmHtml = createNewFilm(src);

        newFilmHtml.id = curId;
        newFilmHtml.like = elem.like;
        newFilmHtml.dislike = elem.dislike;
        filmsArray.push(newFilmHtml);
        localStorage.setItem("films", JSON.stringify(filmsArray));

        $(modalTag).modal('hide');
        window.location.pathname = "/list";
        return curId = "";
      }
    });
  }
});



history.listen(listener => {
  console.log("LISTEN", listener);
  renderRoute(listener.location.pathname);
});


if (history.location.pathname === "/") {
  const mainhead = new MainHead();
  mainTag.appendChild(mainhead.render());

} else {
  renderRoute(history.location.pathname);
}

// footer
const footer = new Footer();
containerTag.appendChild(footer.render());