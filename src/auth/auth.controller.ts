import { Body, Controller, Get, Inject, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CookieSerializeOptions, serialize } from 'cookie';
import { Role } from 'src/common/constants/enums/roles.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
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
    async login(@Req() req, @Res({ passthrough: true }) res) {

        const token: {access_token:string}  =  await this.authService.generateToken(req.user)

        if(!token.access_token)
            return { message: 'Problemas al general el token' } //passthrough: true
            
        const cookieOptions: CookieSerializeOptions = {
            httpOnly: true, // La cookie solo es accesible a través de HTTP
            maxAge: 3600000, // Tiempo de vida de la cookie en milisegundos (1 hora en este caso)
            // Otras opciones adicionales si las necesitas
        };      
        const cookieName = 'token'; // Nombre de la cookie que deseas eliminar
        res.setHeader('Set-Cookie', serialize(cookieName, token.access_token, cookieOptions)); // Establece la cookie en el cliente
        // res.status(200).send({ message: 'Inicio de sesión exitoso', user: req.user });
        return { message: 'Inicio de sesión exitoso', user: req.user } //passthrough: true
    }

    @Get('logout')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async logout(@Req() req, @Res(/*{ passthrough: true }*/) res) {
       const cookieOptions: CookieSerializeOptions = {
         httpOnly: true, // La cookie solo es accesible a través de HTTP
         expires: new Date(0), // Establece la fecha de expiración de la cookie en el pasado
         maxAge: 0, // Establece la duración de la cookie en 0 segundos
       };

        const cookieName = 'token'; // Nombre de la cookie que deseas eliminar

        res.setHeader('Set-Cookie', serialize(cookieName, '', cookieOptions));
        res.status(200).send({ message: 'Sesión cerrada exitosamente', user: req.user });//passthrough: false
        // return { message: 'Sesión cerrada exitosamente', user: req.user }
    }

    //ruta protegida por rol user
    @Get('user')
    @Roles(Role.User)
    @UseGuards(AuthGuard('jwt'), RolesGuard)    
    async user(@Request() req) {
        return req.user
    }

    //ruta protegida por rol admin
    @Get('userAdmin')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    
    async userAdmin(@Request() req) {
        return req.user
    }
}
