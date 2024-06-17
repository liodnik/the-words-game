const PageSingleton = (function () {
  let instance;

  function createInstance() {
    const obj = {};

    // Generate a unique identifier for this tab
    const tabId =
      new Date().getTime() + Math.random().toString(36).substr(2, 9);
    obj.tabId = tabId;

    // Add an event listener to handle localStorage changes
    window.addEventListener("storage", (event) => {
      if (event.key === "pageCheck" && event.newValue !== tabId) {
        openPopup();
      }
    });

    // Set the tabId in localStorage
    localStorage.setItem("pageCheck", tabId);

    // Before the tab is closed or refreshed, remove the tabId from localStorage
    window.addEventListener("beforeunload", () => {
      if (localStorage.getItem("pageCheck") === tabId) {
        localStorage.removeItem("pageCheck");
      }
    });

    return obj;
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

const pageChecker = PageSingleton.getInstance();

function openPopup() {
  const popup = document.getElementById("popup");
  const overlay = document.getElementById("overlay");
  popup.style.display = "block";
  overlay.style.display = "block";
}

function closePopup() {
  location.reload();
}
