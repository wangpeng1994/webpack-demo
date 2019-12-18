/**
 * addition
 * @param {string} a The first number string
 * @param {string} b The second number string
 */
 export function add(a, b) {
  let i = a.length - 1;
  let j = b.length - 1;

  let carry = 0; // 进位标记
  let res = ''; // 结果

  while (i >= 0 || j >= 0) {
    let x = 0; // a 中某位的数字
    let y = 0; // b 中某位的数字
    let sum = 0;

    if (i >= 0) {
      x = parseInt(a[i]);
      i--;
    }

    if (j >= 0) {
      y = parseInt(b[j]);
      j--;
    }

    sum = x + y + carry;

    // 判断是否需要进位
    if (sum >= 10) {
      carry = 1;
      sum -= 10;
    } else {
      carry = 0;
    }

    res = sum + res; // 字符串拼接
  }

  if (carry) {
    res = carry + res; // 字符串拼接
  }

  return res;
}


/**
 * Test cases
 */

// add('9999', '1');
// add('1', '999');
// add('123', '321');
// add('9999999999999999999999999999999999999999999999999999999999', '1');
