export default class LoadMoreBtn {
  constructor({ selector, hidden = false }) {
    this.refs = this.getRefs(selector);

    hidden && this.hide();
  }

  getRefs(selector) {
    const refs = {};
    refs.button = document.querySelector(selector);

    return refs;
  }

  hide() {
    this.refs.button.classList.add("is-hidden");
  }

  show() {
    this.refs.button.classList.remove("is-hidden");
  }

  disable() {
    this.refs.button.disabled = true;
    this.refs.button.textContent = "Loading...";
  }

  enable() {
    this.refs.button.disabled = false;
    this.refs.button.textContent = "Load more";
  }
}
