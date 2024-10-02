import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AccountRepository } from './auth/repositories/account.repository';
import { RoleRepository } from './auth/repositories/role.repository';
import { PermissionRepository } from './auth/repositories/pemission.repository';
import { Permission } from './auth/entities/permission.entity';
import { RoleName, Resource, Action } from './enums/auth.enum';
import { ServiceTypeService } from './casher/services/ServiceType.service';
import { ServiceType } from './casher/entities/ServiceType.entity';
import { DoctorCreationDto } from './doctor/dto/doctor.dto';
import { DoctorService } from './doctor/doctor.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly serviceTypeService: ServiceTypeService,
    private readonly doctorService: DoctorService,
  ) {}

  async onModuleInit() {
    await this.createDefaultAdmin();
  }

  createDefaultAdmin = async () => {
    const adminExists = await this.accountRepository.findOne('admin');

    if (!adminExists) {
      const permissionsList: { resource: Resource; action: Action }[] = [];

      for (const resource of Object.values(Resource)) {
        for (const action of Object.values(Action)) {
          permissionsList.push({ resource, action });
        }
      }

      const permissions: Permission[] = [];
      for (const perm of permissionsList) {
        let permission =
          await this.permissionRepository.findByResourceAndAction(
            perm.resource,
            perm.action,
          );
        if (!permission) {
          permission = await this.permissionRepository.create(
            perm as Permission,
          );
        }
        permissions.push(permission);
      }

      let adminRole = await this.roleRepository.findByName(RoleName.Admin);
      if (!adminRole) {
        adminRole = await this.roleRepository.createWithPermissions({
          name: RoleName.Admin,
          permissions: [
            {
              resource: Resource.All,
              action: Action.All,
              description: 'Full access to all resources',
              roles: [],
              id: 1,
              isActive: true,
            } as unknown as Permission,
          ],
        });
      }

      let doctorRole = await this.roleRepository.findByName(RoleName.Doctor);
      if (!doctorRole) {
        doctorRole = await this.roleRepository.createWithPermissions({
          name: RoleName.Doctor,
          permissions: permissions.filter(
            (p) =>
              (p.resource === Resource.Patient && p.action === Action.View) ||
              (p.resource === Resource.Appointment &&
                p.action === Action.Manage),
          ),
        });
      }

      let receptionistRole = await this.roleRepository.findByName(
        RoleName.Receptionist,
      );
      if (!receptionistRole) {
        receptionistRole = await this.roleRepository.createWithPermissions({
          name: RoleName.Receptionist,
          permissions: permissions.filter(
            (p) =>
              (p.resource === Resource.Appointment &&
                p.action === Action.Manage) ||
              (p.resource === Resource.Appointment &&
                p.action === Action.Create) ||
              (p.resource === Resource.Patient && p.action === Action.View),
          ),
        });
      }

      this.accountRepository.create({
        username: process.env.ADMIN_NAME || 'admin',
        email: process.env.ADMIN_EMAIL || 'admin@dmc.clinic.com',
        password: process.env.ADMIN_PASS || 'adminPassword',
        roles: [adminRole],
      });
      this.accountRepository.create({
        username: 'doctor',
        email: 'doctor@gmail.com',
        password: 'doctorPassword',
        roles: [doctorRole],
      });

      this.accountRepository.create({
        username: 'receptionist',
        email: '',
        password: 'receptionistPassword',
        roles: [receptionistRole],
      });
      Logger.log('Admin account created');
      await this.createDefaultData();
    } else {
      Logger.log('Admin account already exists');
    }
  };

  createDefaultData = async () => {
    const serviceTypes = [
      'Normal Consultation',
      'Special Consultation',
      'Overtime Consultation',
    ];

    const specializations = [
      'Cardiology', // Tim mạch
      'Dermatology', // Da liễu
      'Gastroenterology', // Tiêu hóa
      'Neurology', // Thần kinh
      'Orthopedics', // Chỉnh hình
      'Pediatrics', // Nhi khoa
      'Psychiatry', // Tâm thần
      'Radiology', // Chẩn đoán hình ảnh
      'Surgery', // Phẫu thuật
      'Urology', // Tiết niệu
    ];

    for (const serviceType of serviceTypes) {
      const service = await this.serviceTypeService.findByName(serviceType);
      if (!service) {
        const service = new ServiceType();
        service.name = serviceType;
        service.price = 0;
        service.description =
          serviceType === 'Normal Consultation'
            ? 'Khám thường'
            : serviceType === 'Special Consultation'
              ? 'Khám VIP'
              : 'Khám ngoài giờ';
        await this.serviceTypeService.create(service);
      }
    }

    const doctors: DoctorCreationDto[] = [];

    specializations.forEach((specialization, index) => {
      const doctor1: DoctorCreationDto = {
        employeeId: `DOC01${index * 2 + 1}`,
        fullName: `Nguyễn Văn ${index * 2 + 1}`,
        specialization,
        dob: new Date('1976-01-01'),
        email: `nguyenvan${index * 2 + 1}@hospital.com`,
        phone: `095643567${index * 2 + 1}`,
        gender: false,
        address: '123 Quang Trung, Quận Gò Vấp, TP.HCM',
      };

      const doctor2: DoctorCreationDto = {
        employeeId: `DOC02${index * 2 + 1}`,
        fullName: `Trần Thị ${index * 2 + 2}`,
        specialization,
        dob: new Date('1976-01-01'),
        email: `tranthi${index * 2 + 2}@hospital.com`,
        phone: `095643545${index * 2 + 2}`,
        gender: true,
        address: '123 Quang Trung, Quận Gò Vấp, TP.HCM',
      };

      doctors.push(doctor1, doctor2);
    });

    for (const doctor of doctors) {
      await this.doctorService.create(doctor);
    }
  };
}
