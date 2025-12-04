import { EmployeeImage } from "./EmployeeImage";

export class Employee {
  public images: EmployeeImage[] = [];

  constructor(
    public readonly id: string,
    public readonly authUserId: string,
    public address: string | null | undefined,
    public role: string,
    public active: boolean,
    public profileImage?: string
  ) {}
}
