// budgetController module
var budgetController = (function() {})();

// uiController module. IIFE so this function is automatically called, giving us access to all of its methods that we're returning
var uiController = (function() {
  // Object that holds our DOM classes for queryselector, that way if we need to change them, we just need to do it once rather than hunting the rest down to change
  var DOMStrings = {
    inputType: ".add__type",
    inputDesc: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn"
  };

  return {
    // Get input from selected elements and return them in an object
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDesc).value,
        value: document.querySelector(DOMStrings.inputValue).value
      };
    },
    // Return the DOMStrings object to make it publicly available through other controllers
    getDOMStrings: function() {
      return DOMStrings;
    }
  };
})();

// appController module
var controller = (function(budgetCtrl, uiCtrl) {
  // Event Listeners
  var setupEventListeners = () => {
    // Get access to DOMStrings object from UI controller
    var DOM = uiCtrl.getDOMStrings();

    // Event handler for click
    document.querySelector(DOM.inputBtn).addEventListener("click", function() {
      console.log("add clicked");
      ctrlAddItem();
    });

    // Event handler for ENTER key (if the user presses enter to submit rather than clicking button)
    document.addEventListener("keypress", function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        console.log("ENTER pressed.");
        ctrlAddItem();
      }
    });
  };

  // Add Item function
  var ctrlAddItem = function() {
    console.log("ctrlAddItem ran.");
    // Get input
    var input = uiCtrl.getInput();
    console.log("input:", input);
    // Add item to budget controller
    // Add item to UI
    // Calculate Budget
    // Display budget on UI
  };

  // Create public initialization function
  return {
    init: () => {
      // Event listeners will be set up as soon as init is called
      console.log("App started");
      setupEventListeners();
    }
  };
})(budgetController, uiController);

// Initialize controller w/ event listeners
controller.init();
