class EventObserver {
  constructor() {
    this.observers = [];
  }

  subscribe(fn) {
    this.observers.push(fn);
  }

  unsubscribe(fn) {
    this.observers = this.observers.filter((subscriber) => subscriber !== fn);
  }

  notify(data) {
    this.observers.forEach((observer) => observer(data));
  }
}

class TextCollector {
  constructor(level, words) {
    this.isMouseDown = false;
    this.isTouchStart = false;
    this.collectedText = "";
    this.answers = words;
    this.level = level || '1';
    this.textDivs = document.querySelectorAll(".item");
    this.outputElement = document.getElementById("output");
    this.letterContainer = document.getElementById("letter-container");

    this.mouseDownObserver = new EventObserver();
    this.mouseMoveObserver = new EventObserver();
    this.mouseUpObserver = new EventObserver();

    this.touchStartObserver = new EventObserver();
    this.touchMoveObserver = new EventObserver();
    this.touchEndObserver = new EventObserver();

    this.init();
  }

  init() {
    this.textDivs.forEach((div) => {
      div.addEventListener("mousedown", (event) =>
        this.handleMouseDown(event, div)
      );
      div.addEventListener("touchstart", (event) =>
        this.handleTouching(event, div)
      );
    });

    document.addEventListener("mousemove", (event) =>
      this.handleMouseMove(event)
    );
    document.addEventListener("mouseup", () => this.handleMouseUp());
    document.addEventListener("mouseleave", () => this.handleMouseLeave());

    document.addEventListener("touchmove", (event) =>
      this.handleTouchMove(event)
    );
    document.addEventListener("touchend", () => this.handleMouseUp());
    document.addEventListener("touchcancel", () => this.handleMouseLeave());

    this.mouseDownObserver.subscribe(this.onMouseDown.bind(this));
    this.mouseMoveObserver.subscribe(this.onMouseMove.bind(this));
    this.mouseUpObserver.subscribe(this.onMouseUp.bind(this));

    this.touchStartObserver.subscribe(this.handleTouching.bind(this));
    this.touchMoveObserver.subscribe(this.onMouseMove.bind(this));
    this.touchEndObserver.subscribe(this.onMouseUp.bind(this));

    this.loadProgress();
  }

  handleMouseDown(event, div) {
    if (event.button === 0) {
      // Check if the left mouse button is pressed
      this.mouseDownObserver.notify({ event, div });
      event.preventDefault(); // Prevent default text selection
    }
  }

  handleTouching(event, div) {
    if (event.type === "touchstart") {
      this.mouseDownObserver.notify({ event, div });
    }
  }

  handleMouseMove(event) {
    if (this.isMouseDown) {
      this.mouseMoveObserver.notify({ event });
    }
  }

  handleTouchMove(event) {
    this.touchMoveObserver.notify({ event });
  }

  handleMouseUp() {
    this.mouseUpObserver.notify();
    this.touchEndObserver.notify();
  }

  handleMouseLeave() {
    this.isMouseDown = false;
    this.isTouchStart = false;
  }

  onMouseDown({ event, div }) {
    this.isMouseDown = true;
    this.isTouchStart = true;
    this.collectText(div);
  }

  onMouseMove({ event }) {
    if (event.type === "touchmove") {
      event = event.touches[0];
    }
    this.textDivs.forEach((div) => {
      const rect = div.getBoundingClientRect();
      if (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      ) {
        if (!div.classList.contains("visited")) {
          this.collectText(div);
        }
      } else {
        div.classList.remove("visited");
      }
    });
  }

  collectText(div) {
    div.classList.add("visited");
    div.classList.add("marked");
    this.collectedText += div.innerText.trim();
    this.updateOutput();
  }

  updateOutput() {
    this.outputElement.innerHTML = "";

    const letters = this.collectedText.split("");

    letters.forEach((letter) => {
      const letterBox = document.createElement("div");
      letterBox.classList.add("letter-box");
      letterBox.textContent = letter;
      this.outputElement.appendChild(letterBox);
    });
  }

  highlightText(index) {
    const dataWord = this.letterContainer.querySelector(
      `div[data-word="${index}"]`
    );
    if (dataWord) {
      dataWord.classList.add("guessed");
      this.saveProgress();
      this.checkWin();
    }
  }

  onMouseUp() {
    this.isMouseDown = false;
    this.isTouchStart = false;

    this.textDivs.forEach((div) => div.classList.remove("visited"));
    this.textDivs.forEach((div) => div.classList.remove("marked"));

    const collectedTextNormalized = this.collectedText.trim().toLowerCase();
    const foundIndex = this.answers.findIndex(
      (word) => word.toLowerCase() === collectedTextNormalized
    );
    if (foundIndex != -1) {
      this.highlightText(foundIndex);
    }

    this.collectedText = "";
    this.updateOutput();
  }

  checkWin() {
    const guessedWords = this.letterContainer.querySelectorAll(".guessed");
    if (guessedWords?.length == this.answers.length) {
      this.resetprogress();
      window.location.href = `win.html?winLevel=${this.level}`;
    }
  }

  saveProgress() {
    const guessedElements = Array.from(
      this.letterContainer.getElementsByClassName("guessed")
    );

    const wordValues = [];
    for (let i = 0; i < guessedElements.length; i++) {
      wordValues.push(guessedElements[i].dataset.word);
    }

    localStorage.setItem("level", this.level);
    localStorage.setItem("words", JSON.stringify(wordValues));
  }

  loadProgress() {
    const savedLevel = localStorage.getItem("level");
    if (savedLevel !== this.level) {
      return;
    }

    const wordsIndexes = JSON.parse(localStorage.getItem("words"));
    if (wordsIndexes === null) {
      return;
    } else {
      wordsIndexes.forEach((index) => {
        this.highlightText(index);
      });
    }
  }

  resetprogress() {
    localStorage.removeItem("level");
    localStorage.removeItem("words");
  }
}
