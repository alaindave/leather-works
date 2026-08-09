import calculateIPR from "./calculateIPR.js";
import { PayrollComponentInput } from "./types.js";

export interface PayrollCalculationContext {
  employeeId?: string;
  baseSalary: number;
  grossSalary: number;
  taxableSalary: number;
  socialRate?: number;
  totalEarnings: number;
  totalDeductions: number;
  netSalary: number;
}

export function calculateComponent(
  component: PayrollComponentInput,
  context: PayrollCalculationContext
): number {
  switch (component.calculationType) {
    case "FIXE":
      return component.value ?? 0;

    case "MANUEL":
      return component.value ?? 0;

    case "POURCENTAGE_BASE":
      return context.baseSalary * ((component.value ?? 0) / 100);

    case "POURCENTAGE_BRUT":
      return context.grossSalary * ((component.value ?? 0) / 100);

    case "POURCENTAGE_IMPOSABLE":
      return context.taxableSalary * ((component.value ?? 0) / 100);

    case "QUANTITE_TAUX":
      return (component.quantity ?? 0) * (component.rate ?? 0);

    case "FORMULE": {
      console.log(
        `TAXABLE SALARY FOR EMPLOYEE ID ${context.employeeId} IS ${context.taxableSalary}.
        THE GROSS SALARY IS ${context.grossSalary}
        The social security rate is ${context.socialRate}
        `
      );
      return calculateIPR(
        context.taxableSalary,
        context.grossSalary,
        context.socialRate
      );
    }

    default:
      return 0;
  }
}
