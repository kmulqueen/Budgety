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
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list"
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
    addListItem: (obj, type) => {
      var html, newHtml, element;
      // Create HTML string w/ placeholder text
      switch (type) {
        case "inc":
          element = DOMStrings.incomeContainer;
          html = `<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
          break;
        case "exp":
          element = DOMStrings.expensesContainer;
          html = `<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
          break;
        default:
          null;
      }

      // Replace placeholder text with actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);

      // Insert HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    // Clear text input fields
    clearFields: () => {
      var fields, fieldsArr;

      // Holds values for HTML text input fields. querySelectorAll returns *list*, NOT an arry
      fields = document.querySelectorAll(
        `${DOMStrings.inputDesc}, ${DOMStrings.inputValue}`
      );

      // **Tricking slice method** Converting the list into an array. Slice returns a copy of the "array" (which is a list, but still gets returned as an array by the slice method)
      fieldsArr = Array.prototype.slice.call(fields);

      // Clear value of each field
      fieldsArr.forEach(field => {
        field.value = "";
      });

      // After a user submits the data, the text input indicator goes back into the description field, rather than staying in the last clicked field
      fieldsArr[0].focus();
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
    uiCtrl.addListItem(newItem, input.type);
    // Clear text fields
    uiCtrl.clearFields();
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
