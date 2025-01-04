import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Request,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../Decorators/public.decorator';
import { Roles } from 'src/Decorators/roles.decorator';
import { Permissions } from 'src/Decorators/permissions.decorator';
import { Action, Resource, RoleName } from 'src/Common/Enums/auth.enum';
import {
  CreateAccountDto,
  CreatePatientAccountDto,
  CreateRoleDto,
  SignInDto,
} from './dto/auth.request.dto';
import { log } from 'console';
import { HttpExceptionFilter } from 'src/Common/DTO/HandleException';
import { ApiResponseDto } from 'src/Common/DTO/ApiResponse.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
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
    return await this.authService.checkPatientId(patientId);
  }

  @Get('profile')
  getProfile(@Request() req: any) {
    console.log('Get profile', req.user);
    return this.authService.getProfile(req.user.username);
  }

  @Roles(RoleName.Admin)
  @Permissions([{ resource: Resource.Role, actions: [Action.Create] }])
  @Post('role')
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    try {
      if (!createRoleDto.name) throw new Error('Role name is required');
      const role = await this.authService.createRole(createRoleDto);
      return {
        message: 'Role created successfully',
        data: role,
      };
    } catch (error) {
      log('error', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  @Public()
  @Post('forgot-password')
  async resetPassword(
    @Body() query: { username: string },
  ): Promise<ApiResponseDto<{ result: boolean }>> {
    try {
      return {
        data: { result: await this.authService.forgotPassword(query.username) },
        message: 'Đã gửi email xác nhận đặt lại mật khẩu',
        statusCode: 200,
      };
    } catch (error) {
      log('error', error);
      throw error;
    }
  }

  @Public()
  @Post('forgot-password-patient')
  async resetPasswordPatient(
    @Body() query: { username: string; password: string },
  ): Promise<ApiResponseDto<{ result: boolean }>> {
    return {
      data: {
        result: await this.authService.resetPasswordPatient(
          query.username,
          query.password,
        ),
      },
      message: 'Thay đổi mật khẩu thành công',
      statusCode: 200,
    };
  }

  @Post('reset-password')
  async resetPasswordWithToken(
    @Body()
    data: {
      username: string;
      old_password: string;
      new_password: string;
    },
  ): Promise<ApiResponseDto<{ result: boolean }>> {
    try {
      return {
        data: {
          result: await this.authService.resetPassword(
            data.username,
            data.old_password,
            data.new_password,
          ),
        },
        message: 'Đặt lại mật khẩu thành công',
        statusCode: 200,
      };
    } catch (error) {
      throw error;
    }
  }
}
