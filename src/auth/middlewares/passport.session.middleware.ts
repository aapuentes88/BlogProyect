import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as passport from 'passport';

@Injectable()
export class PassportSessionMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    console.log('Init PassportSessionMiddleware')
    //Error esto ya lo hacen los guard por debajo por eso da el error de Bad Request
    // passport.authenticate("google", {
    //   session: false,
    //   failureRedirect: "auth/loginfailure2",
    // })(req, res, next)

    console.log('End PassportSessionMiddleware')
  }
}