export default interface CreatePayrollDto {
  employeeId: string;
  month: number;
  year: number;
  notes?: string;
}
