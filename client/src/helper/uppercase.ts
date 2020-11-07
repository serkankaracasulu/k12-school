export default function upperCase(value: string): string {
  let string = value;
  const letters: any = {
    i: "İ",
    ş: "Ş",
    ğ: "Ğ",
    ü: "Ü",
    ö: "Ö",
    ç: "Ç",
    ı: "I",
  };
  string = string.replace(/(([iışğüçö]))+/g, function se(letter) {
    return letters[letter];
  });
  return string.toUpperCase();
}
