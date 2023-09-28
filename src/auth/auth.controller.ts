import { Body, Controller, Get, Inject, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(@Inject('AUTH_SERVICE') private readonly authService: AuthService) { }

    @Post('register')
    register(
        @Body()
        register: RegisterDto
    ) {
        return this.authService.register(register)
    }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        return this.authService.generateToken(req.user)
    }

    //ruta protegida
    @UseGuards(AuthGuard('jwt'))
    @Get('user')
    async user(@Request() req) {
        return req.user
    }
}
