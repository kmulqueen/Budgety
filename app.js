// budgetController module
const budgetController = (() => {
  // Expense function constructor. Arrow functions can't be used as constructors
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  // Prototypes
  // Calc percentage
  Expense.prototype.calcPercentage = totalIncome => {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  // Get/return percentage
  Expense.prototype.getPercentage = () => {
    return this.percentage;
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
    // Calculate percentages
    calculatePercentages: () => {
      data.allItems.exp.forEach(item => {
        item.calcPercentage(data.totals.inc);
      });
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
    // Get percentages
    getPercentages: () => {
      var allPercentages = data.allItems.exp.map(item => {
        return item.getPercentage();
      });
      return allPercentages;
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
    container: ".container",
    expPercLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };

  // Format number
  const formatNumber = (num, type) => {
    var numSplit, int, dec, type;
    num = Math.abs(num);
    // Setting number to 2 fixed decimal places
    num = num.toFixed(2);
    // Splitting the number into 2 parts (integer, decimal) and storing in an array
    numSplit = num.split(".");
    int = numSplit[0];
    dec = numSplit[1];
    // Adding comma for thousands
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
    }

    // If the item is an expense, return the string with a - in front, if it's an income, return with a + in front
    return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
  };

  // Creating a forEach method for our nodeLists
  const nodeListForEach = (list, cbfunc) => {
    for (var i = 0; i < list.length; i++) {
      cbfunc(list[i], i);
    }
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
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

      // Insert HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    // Delete list item
    deleteListItem: id => {
      // Move up in the DOM to access the child element
      var element = document.getElementById(id);
      // Remove the child element
      element.parentNode.removeChild(element);
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
      var type;
      obj.budget > 0 ? (type = "inc") : (type = "exp");

      document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(
        obj.totalInc,
        "inc"
      );
      document.querySelector(
        DOMStrings.expenseLabel
      ).textContent = formatNumber(obj.totalExp, "exp");

      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = "---";
      }
    },
    displayPercentages: percentages => {
      var fields;

      fields = document.querySelectorAll(DOMStrings.expPercLabel);

      // Calling the method
      nodeListForEach(fields, (item, index) => {
        if (percentages[index] > 0) {
          item.textContent = percentages[index] + "%";
        } else {
          item.textContent = "---";
        }
      });
    },
    // Display date
    displayDate: () => {
      var now, month, monthArr, year;
      now = new Date();
      month = now.getMonth();
      monthArr = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      year = now.getFullYear();
      document.querySelector(DOMStrings.dateLabel).textContent =
        monthArr[month] + " " + year;
    },
    changeType: () => {
      var fields;

      fields = document.querySelectorAll(
        DOMStrings.inputType +
          "," +
          DOMStrings.inputDesc +
          "," +
          DOMStrings.inputValue
      );

      nodeListForEach(fields, item => {
        item.classList.toggle("red-focus");
      });

      document.querySelector(DOMStrings.inputBtn).classList.toggle("red");
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

    document
      .querySelector(DOM.inputType)
      .addEventListener("change", uiCtrl.changeType);
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

  // Update percentages function
  const updatePercentages = () => {
    // calculate percentages
    budgetCtrl.calculatePercentages();
    // read them from budget controller
    var percentages = budgetCtrl.getPercentages();
    // update ui
    uiCtrl.displayPercentages(percentages);
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
      // Calculate & update percentages
      updatePercentages();
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
      uiCtrl.deleteListItem(itemID);
      // Update & show new budget
      updateBudget();
      // Calculate & update percentages
      updatePercentages();
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
      // Display date
      uiCtrl.displayDate();
    }
  };
})(budgetController, uiController);

// Initialize controller w/ event listeners
controller.init();
