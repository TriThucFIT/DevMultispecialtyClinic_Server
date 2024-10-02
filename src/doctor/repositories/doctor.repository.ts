import { Repository } from "typeorm";
import { Doctor } from "../entities/doctor.entity";

export class DoctorRepository extends Repository<Doctor> {}