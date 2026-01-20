export const phoneMask = [
  "+",
  "7",
  " ",
  "(",
  /\d/,
  /\d/,
  /\d/,
  ")",
  " ",
  /\d/,
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
];

export const dateMask = [
  /\d/,
  /\d/,
  ".",
  /\d/,
  /\d/,
  ".",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

export default {
  phoneMask,
  dateMask,
};
