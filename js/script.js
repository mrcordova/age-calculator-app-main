//   - Any field is empty when the form is submitted
//   - The day number is not between 1-31
//   - The month number is not between 1-12
//   - The date is in the future
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

const checkIfEmpty = (dateInputDiv) => {
  const input = dateInputDiv.querySelector("input");
  const label = dateInputDiv.querySelector("label");
  const span = dateInputDiv.querySelector("span");

  //   console.log(input.validity);
  input.classList.toggle("error-input", input.validity.valueMissing);
  label.classList.toggle("error-text", input.validity.valueMissing);
  span.classList.toggle("error-text", input.validity.valueMissing);
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
  console.log(input);
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
  span.classList.toggle("error-hide", !span.classList.contains("error-text"));

  span.textContent =
    input["name"] !== "year"
      ? `Must be a valid ${input["name"]}`
      : "Must be in the past";

  return input.validity.rangeOverflow || input.validity.rangeUnderflow
    ? true
    : false;
};
sumbitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  for (const input of dateInputDivs) {
    if (!checkIfEmpty(input)) {
      checkIfNumberRange(input);
    }
  }
});
