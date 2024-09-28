import { Employee } from "src/auth/entities/employee.entity";
import { Entity } from "typeorm";

@Entity('casher')
export class Casher extends Employee {

}
