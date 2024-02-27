import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { RegisterDto } from "../dto/register.dto";
import { Inject } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { CreateProfileDto } from "src/profile/dto/create-profile.dto";
import { UpdateProfileDto } from "src/profile/dto/update-profile.dto";


export class GoogleStrategy extends PassportStrategy(Strategy){
  constructor(@Inject('AUTH_SERVICE') private readonly authService: AuthService){
    console.log('Init GoogleStrategy constructor')
    super({
      clientID: '724635330530-8p94tpfmrsd6u74phbrccci7l2sv2mfq.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3001/api/v1/auth/google/redirect',
      scope: ['profile', 'email']
    })
    console.log('End GoogleStrategy constructor')
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
    console.log('Init GoogleStrategy validate')
    // console.log(accessToken)
    // console.log(refreshToken)
    // console.log(profile)
 
    const infoGoogleUser: Pick<RegisterDto, 'username' | 'email'> = {
      email: profile.emails[0].value,
      username: profile.name.givenName
    }

    const infoToProfile: UpdateProfileDto = {fullname: profile._json.name, profilePhoto: profile._json.picture}
    const user = (await this.authService.validateGoogleUser(infoGoogleUser, infoToProfile)) 
    const jwt = (await this.authService.generateToken(user))
    // console.log('user:', user)
    // console.log('jwt:', jwt)

    done(null, {user, jwt})
    console.log('End GoogleStrategy validate')
    // return {user, jwt}
  }
}