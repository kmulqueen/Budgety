// budgetController module
const budgetController = (() => {
  // Expense function constructor. Arrow functions can't be used as constructors
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

  // Calculate total
  var calculateTotal = type => {
    // Initial sum
    var sum = 0;

    // For each iteration, the sum will be updated
    data.allItems[type].forEach(item => {
      sum += item.value;
    });

    // Update the totals value to the final sum
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
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
    // Delete Item
    deleteItem: (type, id) => {
      var ids, index;
      // Map returns a brand new array
      ids = data.allItems[type].map(item => {
        return item.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },
    // Calculate budget
    calculateBudget: () => {
      // Calculate total income & expenses
      calculateTotal("exp");
      calculateTotal("inc");
      // Calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      // Caulculate % of income spent (if any income exists)
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        // Percentage doesn't exist
        data.percentage = -1;
      }
    },
    // Get Budget. Returns budget
    getBudget: () => {
      const { budget, totals, percentage } = data;
      return {
        budget,
        totalInc: totals.inc,
        totalExp: totals.exp,
        percentage
      };
    },
    testing: () => console.log("data", data)
  };
})();

// uiController module. IIFE so this function is automatically called, giving us access to all of its methods that we're returning
const uiController = (() => {
  // Object that holds our DOM classes for queryselector, that way if we need to change them, we just need to do it once rather than hunting the rest down to change
  var DOMStrings = {
    inputType: ".add__type",
    inputDesc: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container"
  };

  return {
    // Get input from selected elements and return them in an object
    getInput: () => {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDesc).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value) // parseFloat turns the string into a number
      };
    },
    addListItem: (obj, type) => {
      var html, newHtml, element;
      // Create HTML string w/ placeholder text
      switch (type) {
        case "inc":
          element = DOMStrings.incomeContainer;
          html = `<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
          break;
        case "exp":
          element = DOMStrings.expensesContainer;
          html = `<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
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
    displayBudget: obj => {
      document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMStrings.expenseLabel).textContent =
        obj.totalExp;

      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = "---";
      }
    },
    // Return the DOMStrings object to make it publicly available through other controllers
    getDOMStrings: () => {
      return DOMStrings;
    }
  };
})();

// appController module
const controller = ((budgetCtrl, uiCtrl) => {
  // Event Listeners
  var setupEventListeners = () => {
    // Get access to DOMStrings object from UI controller
    var DOM = uiCtrl.getDOMStrings();

    // Event handler for click
    document.querySelector(DOM.inputBtn).addEventListener("click", function() {
      ctrlAddItem();
    });

    // Event handler for ENTER key (if the user presses enter to submit rather than clicking button)
    document.addEventListener("keypress", function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });

    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
  };

  // Update budget function
  const updateBudget = () => {
    // Calculate budget
    budgetCtrl.calculateBudget();
    // Return budget
    var budget = budgetCtrl.getBudget();
    // Display budget on UI
    uiCtrl.displayBudget(budget);
  };

  // Add Item function
  const ctrlAddItem = () => {
    var input, newItem;
    // Get input
    input = uiCtrl.getInput();
    // If the fields are filled out
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // Add item to budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      // Add item to UI
      uiCtrl.addListItem(newItem, input.type);
      // Clear text fields
      uiCtrl.clearFields();
      // Calculate & update budget
      updateBudget();
    }
  };

  // Delete item function
  const ctrlDeleteItem = e => {
    var itemID, splitID, type, ID;
    // Reaching the parent element of where our icon/button is
    itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      // Converting the string data ("inc-1", "exp-4", etc.) into an array to get access to the type & id
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // Delete item from data structure
      budgetCtrl.deleteItem(type, ID);
      // Delete item from ui

      // Update & show new budget
    }
  };

  // Create public initialization function
  return {
    init: () => {
      // Event listeners will be set up as soon as init is called
      setupEventListeners();
      // Display budget on UI
      uiCtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
    }
  };
})(budgetController, uiController);

// Initialize controller w/ event listeners
controller.init();
