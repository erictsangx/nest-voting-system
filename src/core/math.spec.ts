import { Chance } from 'chance';
import { privacyHash, validateHKID } from './math';

const rand = new Chance();

describe('Math', () => {
  it('hash a string', () => {
    const original = rand.string();
    const result = privacyHash(original);

    expect(result).not.toBe(original);

    //check repeated hashing
    const result2 = privacyHash(original);
    expect(result2).toBe(result);

    //check upper case
    const result3 = privacyHash(original.toLowerCase());
    expect(result3).toBe(result);

    const expected = 'LckgaB9wCdzLVWjT43sJSsBxnZF47u0evPIiE8TQrXP3cQN+1rKEL33OaahWQfnjaD5IB+sgPVIevj+8AISfAg==';
    expect(privacyHash('WF1871640')).toBe(expected);
  });

  it('validate a HK ID', () => {
    ['WO790393A',
      'M6884593',
      'U6944954',
      'K6050549',
      'F9463786',
      'X3859512',
      'PF3046059',
      'WF1871640',
      'WX7903934']
      .map(v => {
        if (rand.bool()) {
          return v.toLowerCase();
        }
        return v;
      })
      .forEach(v => {
        expect(validateHKID(v)).toBe(true);
      });

    expect(validateHKID(rand.string())).toBe(false);
    expect(validateHKID('X3859513')).toBe(false);
  });

});
