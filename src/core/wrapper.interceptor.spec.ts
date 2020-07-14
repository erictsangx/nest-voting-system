import { WrapperInterceptor } from './wrapper.interceptor';
import { from } from 'rxjs';
import { Chance } from 'chance';

const chance = new Chance();
const subject = new WrapperInterceptor();

describe('WrapperInterceptor', () => {
  it('wrap responses', done => {

    const expected = [undefined, chance.string(), null];
    const ob = from([...expected].reverse());
    const callHandler = {
      handle: () => {
        return ob;
      }
    };

    subject.intercept({} as any, callHandler)
      .subscribe({
        next: v => {
          const tmp = expected.pop();
          const result = tmp == undefined ? null : tmp;
          expect(v).toEqual({
            result,
            statusCode: 200,
            message: ''
          });
        },
        complete: done
      });
  });

});
