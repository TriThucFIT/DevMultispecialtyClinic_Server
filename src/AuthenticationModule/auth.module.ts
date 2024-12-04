import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { jwtConstants } from './auth.constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Role } from './entities/role.entity';
import { ConfigModule } from '@nestjs/config';
import { Permission } from './entities/permission.entity';
import { AccountRepository } from './repositories/account.repository';
import { RoleRepository } from './repositories/role.repository';
import { PermissionRepository } from './repositories/pemission.repository';
import { DoctorModule } from 'src/DoctorModule/doctor.module';
import { PatientModule } from 'src/PatientModule/patient.module';
import { ReceptionistModule } from 'src/ReceptionistModule/receptionist.module';
import { CasherModule } from 'src/CasherModule/casher.module';
import { PharmacistModule } from 'src/PharmacistModule/pharmacist.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '600s' },
    }),
    DoctorModule,
    PatientModule,
    ReceptionistModule,
    CasherModule,
    PharmacistModule,
    TypeOrmModule.forFeature([Account, Role, Permission]),
  ],
  providers: [
    AuthService,
    AccountRepository,
    PermissionRepository,
    RoleRepository,
    Account,
    Role,
    Permission,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
    AccountRepository,
    PermissionRepository,
    RoleRepository,
  ],
})
export class AuthModule {}
