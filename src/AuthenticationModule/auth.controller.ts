import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../Decorators/public.decorator';
import { Roles } from 'src/Decorators/roles.decorator';
import { Permissions } from 'src/Decorators/permissions.decorator';
import { Action, Resource, RoleName } from 'src/Common/Enums/auth.enum';
import { CreateAccountDto, SignInDto } from './dto/auth.request.dto';
import { log } from 'console';

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
  @Post('register')
  async createAccount(@Body() createUserDto: CreateAccountDto) {
    try {
      const account = await this.authService.createAccount(createUserDto);
      return {
        message: 'Account created successfully',
        data: account,
      };
    } catch (error) {
      log('error', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('profile')
  getProfile(@Request() req : any) {
    return this.authService.getProfile(req.user.username);
  }
}
