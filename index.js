const QUOTES_URL = "https://api.freeapi.app/api/v1/public/quotes/quote/random";
const loader = document.getElementById("loader");
const errorMessage = document.getElementById("errorMessage");
const quoteContent = document.querySelector(".quote-content");
const authorElement = document.querySelector(".author");
const nextButton = document.querySelector(".next-btn button");
const errorCloseBtn = document.querySelector(".error-close-btn");
const twitterButton = document.querySelector(".social-button.twitter");
const whatsappButton = document.querySelector(".social-button.whatsapp");

async function getQuote() {
  showLoader();

  try {
    const response = await fetch(QUOTES_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.data) {
      updateQuote(data.data);
    } else {
      throw new Error("Invalid data format received");
    }

    hideLoader();
  } catch (error) {
    console.error("Error fetching quote:", error);
    hideLoader();
    showError("Failed to fetch a new quote. Please try again.");
    nextButton.textContent = "Try Again";
  }
}

function updateQuote(quoteData) {
  if (!quoteData || !quoteData.content || !quoteData.author) {
    showError("Something went wrong");
    return;
  }

  quoteContent.style.opacity = 0;
  authorElement.style.opacity = 0;

  setTimeout(() => {
    quoteContent.textContent = quoteData.content;
    authorElement.textContent = quoteData.author;

    updateSocialLinks(quoteData.content, quoteData.author);

    quoteContent.style.opacity = 1;
    authorElement.style.opacity = 1;
  }, 300);
}

function updateSocialLinks(quote, author) {
  const shareText = `"${quote}" - ${author}`;
  const encodedText = encodeURIComponent(shareText);

  twitterButton.onclick = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodedText}&hashtags=MotivationPlus`,
      "_blank"
    );
  };

  whatsappButton.onclick = () => {
    window.open(`https://wa.me/?text=${encodedText}`, "_blank");
  };
}

function showLoader() {
  loader.classList.add("active");
}

function hideLoader() {
  loader.classList.remove("active");
}

function showError(message) {
  const errorText = document.querySelector(".error-text");
  if (message) {
    errorText.textContent = message;
  }
  errorMessage.classList.add("active");

  setTimeout(() => {
    hideError();
  }, 5000);
}

function hideError() {
  errorMessage.classList.remove("active");
}

function init() {
  getQuote();
  nextButton.addEventListener("click", getQuote);
  errorCloseBtn.addEventListener("click", hideError);
}

init();
