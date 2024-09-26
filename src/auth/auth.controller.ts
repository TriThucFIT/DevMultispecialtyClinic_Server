import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../decorators/public.decorator';
import { CreateAccountDto, SignInDto } from 'src/dto/auth.request.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Permissions } from 'src/decorators/permissions.decorator';
import { Action, Resource, RoleName } from 'src/enums/auth.enum';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Roles(RoleName.Admin)
  @Permissions([{ resource: Resource.Account, actions: [Action.Create] }])
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  createAccount(@Body() createUserDto: CreateAccountDto) {
    return this.authService.createAccount(createUserDto);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
