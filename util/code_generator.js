const CHAR_CODES = generate_array(65, 90).concat(generate_array(48, 57));

module.exports = () => {
  const code = [];
  for (let i = 0; i < 5; i++) {
    const random_value =
      CHAR_CODES[Math.floor(Math.random() * CHAR_CODES.length)];
    code.push(String.fromCharCode(random_value));
  }
  return code.join("");
};

function generate_array(low, high) {
  const array = [];
  for (let i = low; i <= high; i++) array.push(i);
  return array;
}
