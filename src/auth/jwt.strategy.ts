import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

interface JwtPayload {
  sub: string
  username: string
  exp: number
  iat: number
}

/**
 * Verify token: header[Authorization]
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  //[Passport] return payload after verification
  validate(payload: JwtPayload) {
    return { id: payload.sub, username: payload.username };
  }
}
