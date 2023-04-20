import { refs } from "./helpers/refs";
import LoadMoreBtn from "./helpers/load-more-btn";
import GalleryApi from "./helpers/api-service";
import { renderCardsMarkup } from "./helpers/render-cards";
// import {
//   onLoadMore,
//   onSearchFailure,
//   onSearchSuccess,
//   checkOnEndFreeCollection,
//   checkOnEndSearchResults,
// } from "./helpers/with-load-more-btn";  // Варіант з кнопкою завантажити ще
import { smoothScroll } from "./helpers/smooth-scroll";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const gallery = new GalleryApi(40);

const loadMoreBtn = new LoadMoreBtn({
  selector: ".load-more__btn",
  hidden: true,
});

var lightbox = new SimpleLightbox(".gallery a", {
  close: false,
  showCounter: false,
});

const infiniteObserver = new IntersectionObserver(onEntry, {
  rootMargin: "150px",
});

refs.searchForm.addEventListener("submit", onSubmit);
loadMoreBtn.refs.button.addEventListener("click", onLoadMore);

async function onSubmit(evt) {
  evt.preventDefault();

  gallery.query = evt.currentTarget.children.searchQuery.value.toLowerCase();

  if (!gallery.query) {
    return Notify.info("Please, enter a query");
  }

  gallery.resetPage();

  try {
    const data = await gallery.fetchImages();

    clearGallery();
    onSearchFailure(data);
    onSearchSuccess(data);
    checkOnEndSearchResults(data);
    showTotalHits(data);
    addObserverOnLastCard(data);
  } catch (error) {
    console.log(error);
  }
}

function showTotalHits(data) {
  if (data.hits.length) {
    return Notify.info(`Hooray! We found ${data.totalHits} images.`);
  }
}

function clearGallery() {
  refs.galleryBox.innerHTML = "";
}

// Варіант з Infinite Scroll
async function onLoadMore() {
  try {
    const data = await gallery.fetchImages();
    onSearchSuccess(data);
    checkOnEndSearchResults(data);
    addObserverOnLastCard(data);
  } catch (error) {
    checkOnEndFreeCollection(error);
  }
}

function addObserverOnLastCard(data) {
  const lastCard = document.querySelector(".photo-card:last-child");

  if (data.hits < gallery.perPage) {
    infiniteObserver.unobserve(lastCard);
    return;
  }

  if (lastCard) {
    infiniteObserver.observe(lastCard);
  }
}

function onEntry([entry]) {
  if (entry.isIntersecting) {
    infiniteObserver.unobserve(entry.target);

    onLoadMore();
  }
}

function onSearchFailure(data) {
  if (!data.hits.length) {
    return Notify.failure(
      "Sorry, there are no images matching your search query. Please try again."
    );
  }
}

function onSearchSuccess(data) {
  const galleryMarkup = renderCardsMarkup(data.hits);

  refs.galleryBox.insertAdjacentHTML("beforeend", galleryMarkup);

  lightbox.refresh();
  smoothScroll(data);
}

function checkOnEndFreeCollection(error) {
  if (error.response.data === '[ERROR 400] "page" is out of valid range.') {
    // чи краще зробити по статусу помилки error.response.status === 400?

    return Notify.info(
      "We're sorry, but you've reached the end of free search results."
    );
  }
}

function checkOnEndSearchResults(data) {
  if (data.hits < gallery.perPage) {
    // infiniteObserver.unobserve(lastCard);
    return Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
