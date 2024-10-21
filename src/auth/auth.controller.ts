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
  @Post('patientRegister')
  async createPatientAccount(
    @Body() createPatientAccountDto: CreatePatientAccountDto,
  ) {
    try {
      const account = await this.authService.createPatientAccount(
        createPatientAccountDto,
      );
      return {
        message: 'Account created successfully',
        message_VN: 'Tạo tài khoản thành công',
        data: account,
      };
    } catch (error) {
      log('error createPatientAccount', error);
      if (error.status === 400) {
        throw new BadRequestException({
          message: error.response.message,
          message_VN: error.response.message_VN,
        });
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @Public()
  @Get('checkExist/:username')
  async checkExist(@Param('username') username: string) {
    return await this.authService.checkExist(username);
  }
  @Public()
  @Get('checkExistPatient/:patientId')
  async checkExistPatient(@Param('patientId') patientId: string) {
    return await this.authService.checkExistPatient(patientId);
  }

  @Get('profile')
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.username);
  }
}
