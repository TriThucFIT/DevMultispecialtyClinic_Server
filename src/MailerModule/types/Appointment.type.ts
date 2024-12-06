export class AppointmentComfirmation {
  id: number;
  date: string;
  time: string;
  isWalkIn: boolean;
  status: string;
  symptoms: string;
  doctor: {
    fullName: string;
    phone: string;
    specialization: string;
  };
  service: {
    id: number;
    name: string;
    price: number;
  };
  patient: {
    id: string;
    fullName: string;
    address: {
      city: string;
      state: string;
      address: string;
    };
    phone: string;
    gender: boolean;
    dob: string;
    priority?: number;
    age: number;
    email?: string;
  };
}
