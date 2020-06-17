export const createSlider = ({ min, max, step, defaultValue = min, label }) => {
  const $div = document.createElement("div");
  const $label = document.createElement("label");
  $label.innerText = `${label} [${defaultValue}]`;
  const $input = document.createElement("input");
  $input.type = "range";
  $input.min = min;
  $input.max = max;
  $input.step = step;
  $input.value = defaultValue;
  $div.appendChild($input);
  $div.appendChild($label);
  $input.addEventListener("input", (e) => {
    $label.innerText = `${label} [${e.target.value}]`;
  });

  document.body.appendChild($div);

  return {
    element: $div,
    value: () => Number($input.value),
  };
};

export const createCheckbox = ({ label, defaultValue = false }) => {
  const $div = document.createElement("div");
  const $label = document.createElement("label");
  $label.innerText = label;
  const $input = document.createElement("input");
  $input.type = "checkbox";
  $input.checked = defaultValue;
  $label.appendChild($input);
  $div.appendChild($label);

  document.body.appendChild($div);

  return {
    element: $div,
    value: () => $input.checked,
  };
};

export const createNumberInput = ({
  label,
  defaultValue = 0,
  min = 0,
  max = 1,
}) => {
  const $div = document.createElement("div");
  const $label = document.createElement("label");
  $label.innerText = label;
  const $input = document.createElement("input");
  $input.type = "number";
  $input.min = min;
  $input.max = max;
  $input.value = defaultValue;
  $label.appendChild($input);
  $div.appendChild($label);

  document.body.appendChild($div);

  return {
    element: $div,
    onInput: (fn) => {
      $input.addEventListener("input", fn);
    },
    value: () => Number($input.value),
  };
};
