import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RoleName, Resource, Action } from './Common/Enums/auth.enum';
import { ServiceTypeService } from './CasherModule/services/ServiceType.service';
import { ServiceType } from './CasherModule/entities/ServiceType.entity';
import { SpecializationCreationDTO } from './DoctorModule/dto/doctor.dto';
import { DoctorService } from './DoctorModule/doctor.service';
import { Doctor } from './DoctorModule/entities/doctor.entity';
import { AccountRepository } from './AuthenticationModule/repositories/account.repository';
import { RoleRepository } from './AuthenticationModule/repositories/role.repository';
import { PermissionRepository } from './AuthenticationModule/repositories/pemission.repository';
import { Permission } from './AuthenticationModule/entities/permission.entity';
import { Address } from './AuthenticationModule/entities/Address.type';

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
    // await this.createDefaultAdmin();
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

      Logger.log('Admin account created');
      await this.createDefaultData();
    } else {
      Logger.log('Admin account already exists');
    }
  };

  createDefaultData = async () => {
    const serviceTypes = ['InHour', 'OutHour', 'Emergency'];

    const specializations = [
      'Cardiology',
      'Dermatology',
      'Gastroenterology',
      'Neurology',
      'Orthopedics',
      'Pediatrics',
      'Psychiatry',
      'Radiology',
      'Surgery',
      'Urology',
    ];
    const vietnameseNames = [
      'Tim mạch',
      'Da liễu',
      'Tiêu hóa',
      'Thần kinh',
      'Chỉnh hình',
      'Nhi khoa',
      'Tâm thần',
      'Chẩn đoán hình ảnh',
      'Phẫu thuật',
      'Tiết niệu',
    ];

    const specializationObjects: SpecializationCreationDTO[] =
      specializations.map((specialization, index) => ({
        specialization_id: specialization,
        name: vietnameseNames[index],
      }));

    await this.doctorService.createManySpecializations(specializationObjects);

    for (const serviceType of serviceTypes) {
      const service = await this.serviceTypeService.findByName(serviceType);
      if (!service) {
        const service = new ServiceType();
        service.name = serviceType;
        service.price = 0;
        service.description =
          serviceType === 'InHour'
            ? 'Khám thường'
            : serviceType === 'OutHour'
              ? 'Khám ngoài giờ'
              : 'Cấp cứu';
        await this.serviceTypeService.create(service);
      }
    }

    const doctors: Doctor[] = [];

    await Promise.all(
      specializations.map(async (specialization, index) => {
        const spec =
          await this.doctorService.findSpecialization(specialization);

        const doctor1 = new Doctor();
        doctor1.employeeId = `DOC01${index * 2 + 1}`;
        doctor1.fullName = `Nguyễn Văn ${index * 2 + 1}`;
        doctor1.specialization = spec;
        doctor1.dob = new Date('1976-01-01');
        doctor1.phone = `095643567${index * 2 + 1}`;
        doctor1.gender = false;
        doctor1.address = new Address();

        const doctor2 = new Doctor();
        doctor2.employeeId = `DOC02${index * 2 + 1}`;
        doctor2.fullName = `Trần Thị ${index * 2 + 2}`;
        doctor2.specialization = spec;
        doctor2.dob = new Date('1976-01-01');
        doctor2.phone = `095643545${index * 2 + 2}`;
        doctor2.gender = true;
        doctor2.address = new Address();
        doctors.push(doctor1, doctor2);
      }),
    );

    await this.doctorService.createMany(doctors);
  };
}
