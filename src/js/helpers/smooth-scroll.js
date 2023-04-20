// Не дуже зрозумів як саме повинен працювати плавний скрол з кнопкою показати ще, тому зробив так

function smoothScroll(data) {
  if (data.hits.length) {
    const { height: cardHeight } = document
      .querySelector(".gallery")
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
  }
}

export { smoothScroll };
