import { WrapperInterceptor } from './wrapper.interceptor';
import { from } from 'rxjs';
import { Chance } from 'chance';

const rand = new Chance();
const subject = new WrapperInterceptor();

describe('WrapperInterceptor', () => {
  it('wrap responses', done => {

    const expected = [undefined, rand.string(), null];
    const ob = from([...expected].reverse());
    const callHandler = {
      handle: () => {
        return ob;
      }
    };

    const mockCtx = {
      switchToHttp: function () {
        return {
          getResponse: function () {
            return {
              statusCode: 201
            };
          }
        };
      }
    };

    subject.intercept(mockCtx as any, callHandler)
      .subscribe({
        next: v => {
          const tmp = expected.pop();
          const result = tmp == undefined ? null : tmp;
          expect(v).toEqual({
            result,
            statusCode: 201,
            message: ''
          });
        },
        complete: done
      });
  });

});
