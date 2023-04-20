import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

function makeCardMarkup(card) {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = card;

  return `
  <div class="photo-card">
      <a class="photo-card__link" href="${largeImageURL}">
        <img
          class="photo-card__img"
          src="${webformatURL}"
          alt="${tags}"
          width="200"
          loading="lazy"
        />
      </a>
  <div class="info">
  <p class="info-item">
    <b>Likes </b><span>${likes}</span>
  </p>
  <p class="info-item">
    <b>Views </b><span>${views}</span>
  </p>
  <p class="info-item">
    <b>Comments </b><span>${comments}</span>
  </p>
  <p class="info-item">
    <b>Downloads </b><span>${downloads}</span>
  </p>
  </div>
  </div> `;
}

function renderCardsMarkup(data) {
  return data.map(makeCardMarkup).join("");
}

export { makeCardMarkup, renderCardsMarkup };
// webformatURL - посилання на маленьке зображення для списку карток.
// largeImageURL - посилання на велике зображення.
// tags - рядок з описом зображення. Підійде для атрибуту alt.
// likes - кількість лайків.
// views - кількість переглядів.
// comments - кількість коментарів.
// downloads - кількість завантажень.
