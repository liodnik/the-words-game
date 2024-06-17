const app = (() => {
  const ENDPOINT_URL = "https://the-words-game.onrender.com";
  const getDiameter = () => {
    const screenWidth = window.screen.width;
    let diameter;

    switch (true) {
      case screenWidth <= 500:
        diameter = 40;
        break;
      case screenWidth <= 600:
        diameter = 50;
        break;
      case screenWidth <= 700:
        diameter = 60;
        break;
      case screenWidth <= 900:
        diameter = 70;
        break;
      case screenWidth <= 1200:
        diameter = 80;
        break;
      default:
        diameter = 50;
    }

    return diameter;
  };

  const getRadius = () => {
    const circle = document.getElementById("circle");

    // Get the computed width
    const radius = window.getComputedStyle(circle).width;

    return parseFloat(radius) / 2;
  };

  const createLetterBoxes = (field, words) => {
    const wordsCount = words.length;

    words.forEach((word, idx) => {
      const letterBoxContainer = document.createElement("div");
      letterBoxContainer.dataset.word = idx;
      word.split("").forEach((char) => {
        const letterBox = document.createElement("div");
        letterBox.className = wordsCount >= 9 ? "letter-box small" : "letter-box";
        letterBox.textContent = char;
        letterBoxContainer.appendChild(letterBox);
      });
      field.appendChild(letterBoxContainer);
    });
  };

  const uniqueLetters = (words) => {
    let letters = new Set();
    words.forEach((word) => {
      word.split("").forEach((char) => {
        letters.add(char.toLowerCase());
      });
    });
    return Array.from(letters);
  };

  const createLetterControl = (letters, callback) => {
    const control = document.getElementById("letter-control");
    const letterControl = document.getElementById("circle");
    letterControl.style.display = "block";

    letters.forEach((element) => {
      const item = document.createElement("div");
      item.className = "item";
      item.textContent = element;
      letterControl.appendChild(item);
    });
    control.appendChild(letterControl);

    callback();
  };

  const distributeItems = () => {
    const circle = document.getElementById("circle");
    const items = circle.getElementsByClassName("item");
    const itemDiameter = getDiameter();
    const radius = getRadius();
    const angleIncrement = (2 * Math.PI) / items.length;

    for (let i = 0; i < items.length; i++) {
      const angle = i * angleIncrement;
      const x = radius * Math.cos(angle) + radius;
      const y = radius * Math.sin(angle) + radius;

      items[i].style.left = x - itemDiameter / 2 + "px";
      items[i].style.top = y - itemDiameter / 2 + "px";
    }
  };

  // Public members
  return {
    init: () => {
      const urlParams = new URLSearchParams(window.location.search);
      const level = urlParams.get("level");

      fetch(`${ENDPOINT_URL}/level=${level || '1'}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error reading file");
          }
          return response.json();
        })
        .then((jsonData) => {
          document.getElementById("current-level").innerText = `Уровень ${
            level || '1'
          }`;

          const sortedWords = jsonData.words
            .slice()
            .sort((a, b) => a.length - b.length);
          const field = document.getElementById("letter-container");
          createLetterBoxes(field, sortedWords);
          createLetterControl(uniqueLetters(sortedWords), () => {
            distributeItems();
            new TextCollector(level, sortedWords);
          });
        })
        .catch((error) => {
          console.error("Error reading file:", error);
        });
    },
  };
})();

app.init();
