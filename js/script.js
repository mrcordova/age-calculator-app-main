const sumbitBtn = document.querySelector("button");
const dateInputDivs = document.querySelectorAll(".date-con");
const resultsDiv = document.querySelector(".results-con");
const inputs = document.querySelectorAll("input[type=number]");
const DateTime = luxon.DateTime;

// Options for the observer (which mutations to observe)
const config = { childList: true, subtree: true };
// Create an observer instance linked to the callback function
const observer = new MutationObserver(applyAnim);
// Start observing the target node for configured mutations
observer.observe(resultsDiv, config);

function applyAnim(mutationList, observer) {
  // console.log(mutationList);
  for (const mutation of mutationList) {
    const comingBackSpinning = [
      { transform: "rotate(0) scale(0)" },
      { transform: "rotate(360deg) scale(1)" },
    ];
    const goingAwaySpinning = [
      { transform: "rotate(0) scale(1)" },
      { transform: "rotate(360deg) scale(0)" },
    ];
    const comingBackTiming = {
      duration: 600,
      iterations: 1,
    };
    const goingAwayTiming = {
      duration: 300,
      iterations: 1,
    };
    mutation.target.animate(comingBackSpinning, comingBackTiming);
    mutation.target.animate(goingAwaySpinning, goingAwayTiming);
  }
}

const padZero = (e) => {
  const inputNum = e.target;
  if (inputNum.id !== "year" && inputNum.value.length < 2) {
    // console.log(inputNum.value);
    // const indx = inputNum.value.indexOf("0");
    inputNum.value = inputNum.value.padStart(2, "0");
  } else if (
    inputNum.id !== "year" &&
    inputNum.value.length > 2 &&
    inputNum.value[0] == "0"
  ) {
    while (inputNum.value[0] == "0") {
      inputNum.value = inputNum.value.substring(1);
    }
    inputNum.value = inputNum.value.padStart(2, "0");
  } else if (inputNum.id === "year" && inputNum.value.length < 2) {
    inputNum.value = inputNum.value.padStart(4, "0");
  } else if (
    inputNum.id === "year" &&
    inputNum.value.length > 4 &&
    inputNum.value[0] == "0"
  ) {
    while (inputNum.value[0] == "0") {
      inputNum.value = inputNum.value.substring(1);
    }
    inputNum.value = inputNum.value.padStart(4, "0");
  }
};

const checkIfEmpty = (dateInputDiv) => {
  const input = dateInputDiv.querySelector("input");
  const label = dateInputDiv.querySelector("label");
  const span = dateInputDiv.querySelector("span");

  //   console.log(input.validity);
  input.classList.toggle("error-input", input.validity.valueMissing);
  label.classList.toggle("error-text", input.validity.valueMissing);
  span.classList.toggle("error-text", input.validity.valueMissing);
  span.classList.toggle(
    "error-text-transparent",
    !span.classList.contains("error-text")
  );

  span.classList.toggle("error-hide", !input.validity.valueMissing);

  span.textContent = "This field is required";
  return input.validity.valueMissing;
};

const checkIfNumberRange = (dateInputDiv) => {
  const input = dateInputDiv.querySelector("input");
  const label = dateInputDiv.querySelector("label");
  const span = dateInputDiv.querySelector("span");

  if (input["name"] == "year") {
    input.max = new Date().getFullYear().toString();
  }

  //   rangeOverflow: false;
  //   rangeUnderflow: true;
  input.classList.toggle(
    "error-input",
    input.validity.rangeOverflow || input.validity.rangeUnderflow
  );
  label.classList.toggle(
    "error-text",
    input.validity.rangeOverflow || input.validity.rangeUnderflow
  );
  span.classList.toggle(
    "error-text",
    input.validity.rangeOverflow || input.validity.rangeUnderflow
  );
  span.classList.toggle(
    "error-text-transparent",
    !span.classList.contains("error-text")
  );
  span.classList.toggle("error-hide", !span.classList.contains("error-text"));

  span.textContent =
    input["name"] !== "year"
      ? `Must be a valid ${input["name"]}`
      : "Must be in the past";

  return input.validity.rangeOverflow || input.validity.rangeUnderflow
    ? true
    : false;
};

const createDateObj = (dateInputDivs) => {
  let dateObj = {};

  for (const dateInputDiv of dateInputDivs) {
    const input = dateInputDiv.querySelector("input");
    dateObj[input["name"]] = `${input.value}`;
  }

  return dateObj;
};

const invalidDate = (dateInputDivs, isValid) => {
  for (const dateInputDiv of dateInputDivs) {
    const input = dateInputDiv.querySelector("input");
    const label = dateInputDiv.querySelector("label");
    const span = dateInputDiv.querySelector("span");

    input.classList.toggle("error-input", !isValid);
    label.classList.toggle("error-text", !isValid);
    span.classList.toggle("error-text", !isValid);
    span.classList.toggle("error-hide", isValid);
    if (input["name"] == "day") {
      span.classList.toggle("error-text-transparent", isValid);
      span.textContent = "Must be a valid date";
    } else {
      span.classList.toggle("error-text-transparent", !isValid);
    }
  }
};

sumbitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let date = "";
  const dateState = [];
  const results = document.querySelectorAll(".results");
  for (const dateInputDiv of dateInputDivs) {
    let valid = checkIfEmpty(dateInputDiv);
    if (!valid) {
      valid = checkIfNumberRange(dateInputDiv);
    }
    dateState.push(valid);
  }
  date = createDateObj(dateInputDivs);
  let validDate = "";
  try {
    validDate = DateTime.fromObject(date);
  } catch (error) {
    console.error("invalid date");
  }
  if (!validDate.isValid && dateState.every((ele) => !ele)) {
    invalidDate(dateInputDivs, validDate.isValid);
  }
  if (dateState.every((ele) => !ele) && validDate.isValid) {
    const dateResults = DateTime.now().diff(validDate, [
      "years",
      "months",
      "days",
    ]).values;

    if (Object.values(dateResults).some((ele) => ele < 0)) {
      invalidDate(dateInputDivs, false);
    } else {
      for (const result of results) {
        const dateSpan = result.querySelector("span");

        dateSpan.textContent = `${Math.floor(dateResults[dateSpan.id])}`;
      }
    }
  }
});

for (const input of inputs) {
  input.addEventListener("change", padZero);
}
