import { refs } from "./refs";

import LoadMoreBtn from "./load-more-btn";
import GalleryApi from "./api-service";

import { renderCardsMarkup } from "./render-cards";
import { smoothScroll } from "./smooth-scroll";

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

function onLoadMore() {
  loadMoreBtn.disable();

  gallery
    .fetchImages()
    .then(data => {
      onSearchSuccess(data);
      checkOnEndSearchResults(data);
      loadMoreBtn.enable();
      //   const lastCard = document.querySelector(".photo-card:last-child");

      //   if (lastCard) {
      //     infiniteObserver.observe(lastCard);
      //   }
    })
    .catch(checkOnEndFreeCollection);
}

function onSearchFailure(data) {
  if (!data.hits.length) {
    loadMoreBtn.hide();
    return Notify.failure(
      "Sorry, there are no images matching your search query. Please try again."
    );
  }
}

function onSearchSuccess(data) {
  const galleryMarkup = renderCardsMarkup(data.hits);

  if (data.hits.length) {
    loadMoreBtn.show();
    loadMoreBtn.enable();
  }

  refs.galleryBox.insertAdjacentHTML("beforeend", galleryMarkup);

  lightbox.refresh();
  smoothScroll(data);
}

function checkOnEndFreeCollection(error) {
  if (error.response.data === '[ERROR 400] "page" is out of valid range.') {
    // чи краще зробити по статусу помилки error.response.status === 400?
    loadMoreBtn.hide();

    return Notify.info(
      "We're sorry, but you've reached the end of free search results."
    );
  }
}

function checkOnEndSearchResults(data) {
  if (data.hits < gallery.perPage) {
    loadMoreBtn.hide();
    return Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

export {
  onLoadMore,
  onSearchFailure,
  onSearchSuccess,
  checkOnEndFreeCollection,
  checkOnEndSearchResults,
};
