/**
 * 对于每一个汉字，消除重复编码，只保留较短的编码。
 */
const fs = require("fs");
let all = fs.readFileSync("wubi98-sogou-phrases.txt", { encoding: "utf-8"});
let lines = all.split("\r\n");
//console.log(splits);
//console.log(splits[splits.length - 1].length);
/**
 * code to character
 * Map<string, string[]>
 */
let phrases = new Map();
/**
 * character to code
 * Map<string, string[]>
 */
let inversePhrases = new Map();
for (let i = 0; i < lines.length; i++) {
  const s = lines[i];
  if (s.length <= 0) {
    continue;
  }

  let sp = s.split("=");
  let ch = sp[1];
  sp = sp[0].split(",");
  let code = sp[0];
  let list = phrases.get(code);
  if (!list) {
    list = [];
    phrases.set(code, list);
  }
  //console.log(code, ch);
  list.push(ch);

  list = inversePhrases.get(ch);
  if (!list) {
    list = [];
    inversePhrases.set(ch, list);
  }
  list.push(code);
  //break;
}
//console.log(phrases);
// console.log(phrases);
// console.log(inversePhrases);

function removeCodeForCharacter(code, ch) {
  let list = phrases.get(code);
  let index = -1;
  if (list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i] == ch) {
        index = i;
        break;
      }
    }
  }
  if (index != -1) {
    list.splice(index, 1);
  }
  if (list.length <= 0) {
    phrases.delete(code);
  }
}

inversePhrases.forEach((codes, ch) => {
  if (codes.length > 1) {
    // 保留较短的编码
    codes.sort((x, y) => {
      if (x.length != y.length) {
        return x.length - y.length;
      }

      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
    });
    for (let i = 1; i < codes.length; i++) {
      let code = codes[i];
      removeCodeForCharacter(code, ch);
    }
  }
});

phrases.forEach((chs, code) => {
  for (let i = 0; i < chs.length; i++) {
    let ch = chs[i];
    console.log(`${code},${i + 1}=${ch}`);
  }
});
