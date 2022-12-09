import { Controller,Body, Post, UseInterceptors, ClassSerializerInterceptor, SerializeOptions } from '@nestjs/common';
import {plainToInstance} from 'class-transformer';
import {UserEntity} from 'src/shared/entities/users.entity';
import {AuthService} from './auth.service';
import {LoginDTO} from './dtos/login.dto';
import {SignUpDTO} from './dtos/signup.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({strategy: 'excludeAll'})
export class AuthController {

	constructor(private readonly authService: AuthService){}
	
	@Post('signup')
	async signup(@Body() signUpData: SignUpDTO){
		return plainToInstance(await this.authService.signup(signUpData), UserEntity)
	}

	@Post('login')
	login(loginData: LoginDTO){
		return this.authService.login(loginData)
	}
}