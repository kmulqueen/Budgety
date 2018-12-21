// budgetController module
var budgetController = (function() {
  // Expense function constructor
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // Income function constructor
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  // Creating public methods
  return {
    // Add items to data.allItems
    addItem: (type, description, value) => {
      var newItem, ID;

      // If there are items in the array
      if (data.allItems[type].length > 0) {
        // Selecting last item's id of the exp or inc array, then creating a new id by adding 1 to the most recent id number
        // Create new ID
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        // Set ID = 0
        ID = 0;
      }

      // Create new item based on inc or exp type
      switch (type) {
        case "exp":
          newItem = new Expense(ID, description, value);
          break;
        case "inc":
          newItem = new Income(ID, description, value);
          break;
        default:
          null;
      }

      // Push item into data structure
      data.allItems[type].push(newItem);

      // Return new item
      return newItem;
    },
    testing: () => console.log("data", data)
  };
})();

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
    var input, newItem;
    // Get input
    input = uiCtrl.getInput();
    // Add item to budget controller
    // const { type, description, value } = input;
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);
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
