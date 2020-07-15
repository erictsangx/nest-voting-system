import * as crypto from 'crypto';

export function privacyHash(str: string): string {
  const hash = crypto.createHash('sha512');
  const data = hash.update(str, 'utf8');
  return data.digest('base64');
}

export function validateHKID(hkId: string): boolean {

  const capitalized = hkId.toUpperCase();
  const reg = new RegExp('^[a-zA-Z]{1,2}[0-9]{6}[0-9aA]$');

  if (reg.test(capitalized)) {
    const match = new RegExp('([a-zA-Z]{1,2})([0-9]{6}[0-9aA])');
    const [firstEmpty, alphabet, digits, lastEmpty] = capitalized.split(match);

    let sum = 0;

    if (alphabet.length == 1) {
      sum += 36 * 9;
      sum += alphabetToInt(alphabet[0]) * 8;
    } else {
      sum += alphabetToInt(alphabet[0]) * 9;
      sum += alphabetToInt(alphabet[1]) * 8;
    }

    for (let i = 0; i < digits.length; i++) {
      sum += digitToInt(digits.charAt(i)) * (7 - i);
    }
    return sum % 11 == 0;
  } else {
    return false;
  }
}

/**
 * For HK ID, A=10,B=11,...Z=35
 * ASCII A=65,B=66,..Z=90
 */
function alphabetToInt(c: string): number {
  return c.charCodeAt(0) - 55;
}

/**
 * For check digit A=10
 * ASCII 9=57,8=56...
 */
function digitToInt(num: string): number {
  if (num == 'A') return 10;
  return num.charCodeAt(0) - '0'.charCodeAt(0);
}
