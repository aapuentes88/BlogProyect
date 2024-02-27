import { Body, Controller, Get, Inject, Patch, Post, Req, Request, Response, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CookieSerializeOptions, serialize } from 'cookie';
import { Role } from 'src/common/constants/enums/roles.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from 'src/profile/dto/update-profile.dto';
import { GoogleGuard } from './guards/google.guard';

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
            
        // const cookieOptions: CookieSerializeOptions = {
        //     httpOnly: false, // La cookie solo es accesible a través de HTTP
        //   //  maxAge: 3600000, // Tiempo de vida de la cookie en milisegundos (1 hora en este caso)
        //     // Otras opciones adicionales si las necesitas
        //     secure: false,
        //     sameSite: 'none'
        // };      
        // const cookieName = 'token'; // Nombre de la cookie que deseas establecer
        // res.setHeader('Set-Cookie',
        // serialize(cookieName, token.access_token, cookieOptions)); //Establece la cookie en el cliente
                                                                    //encabezado predeterminado de http
                                                                    //el cliente manda la esta info en 
                                                                    //cada subsiguiente peticion
                                                                    //req.cookies['cookieName'];
                                                                    //filosofia diferente a JWT
        // res.cookie('token', token.access_token, { httpOnly: false, secure: false, sameSite: 'none' })
        // res.status(200).send({ message: 'Inicio de sesión exitoso', user: req.user, token: token.access_token });
        return { message: 'Inicio de sesión exitoso', /*user: req.user,*/ token: token.access_token } //passthrough: true
    }

    @Get('google/login')
    @UseGuards(GoogleGuard)
    async handleGoogleLogging(@Req() req, @Res() res) {
        console.log('handleGoogleLogging')
    }

    @Get('google/redirect')
    @UseGuards(GoogleGuard)
    async handleGoogleRedirect(@Req() req, @Res() res) {
        console.log('Init handleGoogleRedirect')    

        const {user, jwt} = req.user
        // Agregar encabezados adicionales
        // Como es una redirecion solo se puede mandar datos en la URL y Cookies 
        // Ni encabezados(Headers) ni cuerpos(Body)
        //res.setHeader('authorization', jwt); // Los encabezados personalizados son aquellos que no 
                                             //son parte del conjunto estándar de encabezados definidos 
                                            //por el protocolo HTTP     
                                            
        // const cookieOptions: CookieSerializeOptions = {
        //     httpOnly: true, // La cookie solo es accesible a través de HTTP
        //     maxAge: 3600000, // Tiempo de vida de la cookie en milisegundos (1 hora en este caso)
        //     // Otras opciones adicionales si las necesitas
        //     };      
        // const cookieName = 'token'; // Nombre de la cookie que deseas establecer
        // res.setHeader('Set-Cookie',
        //     serialize(cookieName, jwt, cookieOptions));

        res.cookie('token', jwt.access_token, { httpOnly: false, secure: false, sameSite: 'none' })
        // Redirigir al usuario a una página en el frontend después de la autenticación
        res.redirect(302, 'http://localhost:3000/');

        console.log('token: ', jwt)
        console.log('End handleGoogleRedirect')     
        //res.status(200).send({ message: 'User logged', user }); //como es un callback hay que hacer redirect
        // return {msg: 'OK'} //Usando express @Req y @Res no se puede comportamiento inesperado
    }

    @Get('logout')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async logout(@Req() req, @Res(/*{ passthrough: true }*/) res) {
       console.log('LogOut')
       console.log(req.headers.cookie)
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

    
    @Get('profile')
    @UseGuards(AuthGuard('jwt'), RolesGuard)    
    async findProfile(@Request() req, @Res({ passthrough: true }) res) {
        console.log('findProfile')
        console.log(req.headers.cookie)
        res.cookie('profile', 'this is a profile', { httpOnly: false, secure: false, sameSite: 'none' })
        // const user = this.authService.findProfile(req.user)
        // res.status(200).send({message: 'Profile obtenido exitosamente', user });
        return this.authService.findProfile(req.user)
    }

    @Patch('profile')
    @UseGuards(AuthGuard('jwt'), RolesGuard)    
    async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
        return this.authService.updateProfile(req.user, updateProfileDto)
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

    //ruta de prueba
    @Get('prueba')
    async prueba(@Request() req,  @Res({ passthrough: true }) res) {
        // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
        // res.setHeader('Access-Control-Allow-Credentials', 'true')
        // res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
        // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATH, DELETE')
        //No era necesario nada de esto arriba solo habilitar credentials en true en el cor global
        res.cookie('prueba', 'this is a prueba', { httpOnly: false, secure: false })

        return {msg:'Hello'}
    }
}
