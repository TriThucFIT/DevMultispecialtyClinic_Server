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
import { Public } from '../decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { Permissions } from 'src/decorators/permissions.decorator';
import { Action, Resource, RoleName } from 'src/enums/auth.enum';
import { CreateAccountDto, SignInDto } from './dto/auth.request.dto';
import { DoctorService } from 'src/doctor/doctor.service';
import { ReceptionistService } from 'src/receptionist/receptionist.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private doctorService: DoctorService,
    private receptionistService: ReceptionistService,
  ) {}

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
    try {
      return this.authService.createAccount(createUserDto);
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user.username);
  }
}
