//   - Any field is empty when the form is submitted done
//   - The day number is not between 1-31 done
//   - The month number is not between 1-12 done
//   - The date is in the future done
//   - The date is invalid e.g. 31/04/1991 (there are 30 days in April)
// .error-input {
//   border: 1px solid var(--light-red);
// }

// .error-text {
//   color: var(--light-red);
// }

// .error-span {
//   font-size: 0.9rem;
// }

// .error-hide {
//   display: none;
// }
const sumbitBtn = document.querySelector("button");
const dateInputDivs = document.querySelectorAll(".date-con");
const DateTime = luxon.DateTime;

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
  //   console.log(input);
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
  const validDate = DateTime.fromObject(date);
  // console.log(validDate);
  // console.log(validDate.invalidReason);
  console.log(dateState);
  if (!validDate.isValid && dateState.includes(true)) {
    invalidDate(dateInputDivs, validDate.isValid);
  }
  if (!dateState.includes(false) && validDate.isValid) {
    const dateResults = DateTime.now().diff(validDate, [
      "years",
      "months",
      "days",
    ]).values;
    for (const result of results) {
      const dateSpan = result.querySelector("span");
      dateSpan.textContent = `${Math.floor(dateResults[dateSpan.id])}`;
    }
  }
});
