import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { Permissions } from 'src/decorators/permissions.decorator';
import { Action, Resource, RoleName } from 'src/enums/auth.enum';
import {
  CreateAccountDto,
  CreatePatientAccountDto,
  SignInDto,
} from './dto/auth.request.dto';
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

  @Public()
  @Post('register-patient')
  async createPatientAccount(
    @Body() createPatientAccountDto: CreatePatientAccountDto,
  ) {
    try {
      const account = await this.authService.createPatientAccount(
        createPatientAccountDto,
      );
      return {
        message: 'Tạo tài khoản thành công',
        data: account,
      };
    } catch (error) {
      if (error.status === 400) {
        throw new BadRequestException({
          message: error.response.message,
        });
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @Public()
  @Get('check-username/:username')
  async checkUsernameExist(@Param('username') username: string) {
    return await this.authService.checkUsernameExist(username);
  }

  @Public()
  @Get('check-patientId/:patientId')
  async checkPatientId(@Param('patientId') patientId: string) {
    console.log('patientId', patientId);

    return await this.authService.checkPatientId(patientId);
  }

  @Get('profile')
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.username);
  }
}
