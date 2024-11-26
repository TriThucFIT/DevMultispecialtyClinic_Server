import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { RoleRepository } from './repositories/role.repository';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/Common/DTO/HandleException';
import { ApiResponseDto, ErrorDto } from 'src/Common/DTO/ApiResponse.dto';
import { UserProfileDTO } from './dto/auth.response.dto';
import { Role } from './entities/role.entity';

@ApiTags('auth')
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
  @ApiOkResponse({
    type: ApiResponseDto<UserProfileDTO>,
    description: 'Get user profile successfully',
  })
  @ApiNotFoundResponse({
    type: ApiResponseDto<ErrorDto>,
    description: 'User not found',
  })
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.username);
  }

  @Roles(RoleName.Admin)
  @Permissions([{ resource: Resource.Role, actions: [Action.Create] }])
  @Post('role')
  @ApiCreatedResponse({
    type: ApiResponseDto<Role>,
    description: 'Role created successfully',
  })
  @ApiBadRequestResponse({
    type: ApiResponseDto<ErrorDto>,
    description: 'Bad Request',
  })
  @ApiInternalServerErrorResponse({
    type: ApiResponseDto<ErrorDto>,
  })
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
}
