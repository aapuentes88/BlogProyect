import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GoogleGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext) {
    console.log('--------------Init canActivate-----------------')
    const activate = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    console.log('--------------End canActivate-----------------')
    return activate;
  }
}
// export class GoogleGuard extends AuthGuard('google'){
//   async canActivate(context: ExecutionContext) {
//     console.log('--------------Init canActivate-----------------')
//     try{
//       const activate = (await super.canActivate(context)) as boolean
//       const request = context.switchToHttp().getRequest()
//       console.log('request:')
//       console.log(request)
//       await super.logIn(request)
//       console.log('-------------------End canActivate-------------------')
//       return activate
//     } catch(e){
//       console.log('--------------------------------------')
//       // console.log(e)
//       console.log('--------------------------------------')
//       throw new Error('error')
//     }    
//   }
// }