var backNumber = [];
var countNumber = [];
var allNumbers = [];
$(window).on("load", function () {
  // Function to get a random number between 1 and 13
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

  // Function to check if the last character in resulting is not a number
  function isLastCharacterNotNumber() {
    var lastCharacter = $("#resulting").text().split("");
    return (
      isNaN(parseInt(lastCharacter[lastCharacter.length - 1])) &&
      lastCharacter[lastCharacter.length - 1] != ")"
    );
  }

  // Set up styles for initial numbers
  $(".numbers").each(function () {
    setNumberStyles($(this));

    var active = true;

    // Click event for numbers
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

  // Click event for operators
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

  // Click event for back button
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

  // Click event for numbers after back button is clicked
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
  $(".refresh").on("click", function () {
    location.reload();
  });
  $(".try").on("click", function () {
    location.reload();
  });

  if ($(".end").css("display") === "none") {
    // Attach hover events to #target-paragraph
    $("#target-paragraph").hover(
      function () {
        // Check the condition again before hiding .game
        if ($(".end").css("display") === "none") {
          $(".game").css("display", "none");
          $(".explaination").fadeIn(1000);
        }
      },
      function () {
        // Check the condition again before showing .game
        if ($(".end").css("display") === "none") {
          setTimeout(function () {
            $(".game").css("display", "block");
          }, 1000);
          $(".explaination").fadeOut(500);
        }
      }
    );
  }
});

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
        $("#resulting").text(data.result[0]);
        $("#resulting").css("color", "green");
        setTimeout(() => {
          $("#resulting").text(originalText);
          $("#resulting").css("color", "black");
        }, 2000);
      } else {
        $("#resulting").text("It is impossible");
        $("#resulting").css("color", "red");
        setTimeout(() => {
          $("#resulting").text(originalText);
          $("#resulting").css("color", "black");
        }, 2000);
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
});
