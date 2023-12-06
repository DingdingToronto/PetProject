var backNumber = [];
var countNumber = [];
var allNumbers = [];

// check if the game is still on the page of rule declaration or already started

if (!localStorage.getItem("stateOfBegin")) {
  localStorage.setItem("stateOfBegin", "false");
}

// Retrieve data from localStorage
var stateOfBegin = localStorage.getItem("stateOfBegin");
console.log(stateOfBegin); // Outputs: false

function ready() {
  localStorage.setItem("stateOfBegin", "true");
}

// Game is started, the text of game rule will be hidden and the main page of the game shows on
$(window).on("load", function () {
  if (stateOfBegin === "false") {
    $(".buttonBegin").on("click", function () {
      $(".explaination").css("display", "none");
      $(".game").css("display", "block");
      ready();
    });
  } else {
    $(".explaination").css("display", "none");
    $(".game").css("display", "block");
  }

  // Function to get a random number between 1 and 13, because the game were originally based on card, the number the player will get is based on the number of card too
  function getRandomNumber() {
    return Math.ceil(Math.random() * 13);
  }

  // Function to get a random color value between 0 and 255
  function getRandomColor() {
    return Math.floor(Math.random() * 256);
  }

  // Function to set number styles (random number, random box-shadow, and text color)
  function setNumberStyles(element) {
    var numberToShow = getRandomNumber();
    var colorToShow1 = getRandomColor();
    var colorToShow2 = getRandomColor();
    var colorToShow3 = getRandomColor();

    element.html("<div>" + numberToShow + "</div>");
    element.css(
      "box-shadow",
      "5px 5px 10px rgb(" +
        colorToShow1 +
        "," +
        colorToShow2 +
        "," +
        colorToShow3 +
        ")"
    );
    element.css(
      "color",
      "rgb(" + colorToShow1 + "," + colorToShow2 + "," + colorToShow3 + ")"
    );
    allNumbers.push(numberToShow);
  }

  // Function to check if the last character in id of resulting is not a number and not the operator of )
  function isLastCharacterNotNumber() {
    var lastCharacter = $("#resulting").text().split("");
    return (
      isNaN(parseInt(lastCharacter[lastCharacter.length - 1])) &&
      lastCharacter[lastCharacter.length - 1] != ")"
    );
  }

  // Set up styles and values for initial numbers
  $(".numbers").each(function () {
    setNumberStyles($(this));

    var active = true;

    // Click event for numbers, every number will be used only once and after being used, the circle of this number will turn faint
    $(this).on("click", function () {
      console.log(allNumbers);
      if (active && isLastCharacterNotNumber()) {
        var textToAppend = $(this).text();
        $("#resulting").append(" " + textToAppend);
        $(this).css("opacity", "0.3");
        active = false;
        countNumber.push($(this).text());
      }
    });
  });

  // Click event for operators and the operator will only be added after a number
  $(".operator").each(function () {
    $(this).on("click", function () {
      var lastCharacter = $("#resulting").text().split("");

      if (
        (!isNaN(parseInt(lastCharacter[lastCharacter.length - 1])) &&
          lastCharacter.length <= 40) ||
        lastCharacter[lastCharacter.length - 1] == ")"
      ) {
        var textToAppend = $(this).text();
        $("#resulting").append(" " + textToAppend);
      }
    });
  });
  $(".operatorLeft").each(function () {
    $(this).on("click", function () {
      var lastCharacter = $("#resulting").text().split("");

      if (
        lastCharacter.length <= 40 &&
        isNaN(parseInt(lastCharacter[lastCharacter.length - 1]))
      ) {
        var textToAppend = $(this).text();
        $("#resulting").append(" " + textToAppend);
      }
    });
  });
  $(".operatorRight").each(function () {
    $(this).on("click", function () {
      var lastCharacter = $("#resulting").text().split("");

      if (
        lastCharacter.length <= 40 &&
        !isNaN(parseInt(lastCharacter[lastCharacter.length - 1]))
      ) {
        var textToAppend = $(this).text();
        $("#resulting").append(" " + textToAppend);
      }
    });
  });

  // Click event for back button. The back button returned the used number from resulting box back and let player have chance to use them again.
  $(".back").on("click", function () {
    var info = $("#resulting").text().split(" ");
    if (info.length > 0) {
      var lastElement = info.pop();
      if (!isNaN(parseInt(lastElement))) {
        backNumber.push(lastElement);
        countNumber.pop();
        console.log("countNumber is:", countNumber);

        // Restore opacity for the clicked number
        $(".numbers").each(function () {
          for (var i = 0; i < backNumber.length; i++) {
            if ($(this).text() === backNumber[i]) {
              $(this).css("opacity", "1");
            }
          }
        });
      }
    }
    console.log(backNumber);
    $("#resulting").text(info.join(" "));
  });

  // Click event for numbers after back button is clicked. It makes sure that the returned number will only be returned once and reused once.
  $(".numbers").each(function () {
    $(this).on("click", function () {
      var lastCharacter = $("#resulting").text().split("").pop();
      for (var i = 0; i < backNumber.length; i++) {
        if ($(this).text() === backNumber[i] && isLastCharacterNotNumber()) {
          $(this).css("opacity", "0.1");
          backNumber.splice(i, 1);
          var textToAppend = $(this).text();
          $("#resulting").append(" " + textToAppend);
          countNumber.push($(this).text());
        }
      }
    });
  });

  //compare the result with number 24
  $(".go").on("click", function () {
    const originalText = $("#resulting").text();

    if (countNumber.length !== 4) {
      $("#resulting").text("All provided number should be used once");
      $("#resulting").css("fontSize", "20px");
      $("#resulting").css("color", "red");
      setTimeout(() => {
        $("#resulting").text(originalText);
        $("#resulting").css("fontSize", "40px");
        $("#resulting").css("color", "black");
      }, 1500);
    } else {
      if (eval($("#resulting").text()) === 24) {
        $(".game").css("display", "none");
        $(".end").css("display", "flex");
      } else {
        $("#resulting").text("Sorry, It's not correct");
        $("#resulting").css("fontSize", "20px");
        $("#resulting").css("color", "red");
        $(".go").css({
          animation: "shiver 0.5s ease-in-out",
        });
        setTimeout(() => {
          $("#resulting").text(originalText);
          $("#resulting").css("fontSize", "40px");
          $("#resulting").css("color", "black");
        }, 1500);
      }
    }
  });

  //Through using refresh button, the provided numbers will be regenerated

  $(".refresh").on("click", function () {
    location.reload();
  });
  $(".try").on("click", function () {
    location.reload();
    localStorage.removeItem("stateOfBegin");
  });
  $(".rule").on("click", function () {
    location.reload();
    localStorage.removeItem("stateOfBegin");
  });
});

// Through Api the potential solution of using the 4 numbers to achieve 24 will be responsed.

$(".sendToAPI").on("click", function () {
  // Assuming the API endpoint is 'https://helloacm.com/api/24/'
  var apiUrl = "https://helloacm.com/api/24/";
  const originalText = $("#resulting").text();

  // Generate the query parameters based on allNumbers
  var queryParams = allNumbers
    .map((number, index) => `${String.fromCharCode(97 + index)}=${number}`)
    .join("&");

  // Construct the API URL with query parameters
  var fullApiUrl = `${apiUrl}?${queryParams}`;

  // Make the GET request using fetch
  fetch(fullApiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Handle the response data here
      console.log("API Response:", data);
      if (data.result.length > 1) {
        $("#clue").fadeIn(4000);
        $("#clue").text("The Answer is: " + data.result[0]);
        $("#clue").fadeOut(4000);
      } else {
        $("#clue").fadeIn(4000);
        $("#clue").text(
          "It is impossible with these 4 numbers, please refresh"
        );
        $("#clue").fadeOut(4000);
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
});
