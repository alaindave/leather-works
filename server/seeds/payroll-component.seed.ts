import PayrollComponent from "../models/payrollComponentModel.js";

const defaultPayrollComponents = [
  // ==========================
  // Earnings
  // ==========================

  {
    name: "BASIC_SALARY",
    displayName: "Salaire de base",
    type: "EARNING",
    calculationType: "FIXE",
    isRequired: 1,
    isSystem: 1,
    displayOrder: 1,
    requiresHRApproval: 0,
    taxable: 1,
  },

  {
    name: "OVERTIME",
    displayName: "Heures supplémentaires",
    type: "EARNING",
    calculationType: "MANUEL",
    isSystem: 1,
    displayOrder: 2,
    requiresHRApproval: 1,
    taxable: 1,
  },

  {
    name: "BONUS",
    displayName: "Prime",
    type: "EARNING",
    calculationType: "MANUEL",
    isSystem: 1,
    displayOrder: 3,
    requiresHRApproval: 1,
    taxable: 1,
  },

  {
    name: "HOUSING_ALLOWANCE",
    displayName: "Indemnité de logement",
    type: "EARNING",
    calculationType: "FIXE",
    defaultValue: 20000,
    isSystem: 1,
    displayOrder: 4,
    requiresHRApproval: 0,
    taxable: 0,
  },

  {
    name: "TRANSPORT_ALLOWANCE",
    displayName: "Indemnité de transport",
    type: "EARNING",
    calculationType: "FIXE",
    defaultValue: 40000,
    isSystem: 1,
    displayOrder: 5,
    requiresHRApproval: 0,
    taxable: 0,
  },

  {
    name: "MEAL_ALLOWANCE",
    displayName: "Indemnité de repas",
    type: "EARNING",
    calculationType: "FIXE",
    defaultValue: 15000,
    isSystem: 1,
    displayOrder: 6,
    requiresHRApproval: 0,
    taxable: 0,
  },

  {
    name: "COMMISSION",
    displayName: "Commission",
    type: "EARNING",
    calculationType: "MANUEL",
    isSystem: 1,
    displayOrder: 7,
    requiresHRApproval: 1,
    taxable: 1,
  },

  // ==========================
  // Deductions
  // ==========================

  {
    name: "TAX",
    displayName: "Impôt",
    type: "DEDUCTION",
    calculationType: "POURCENTAGE_IMPOSABLE",
    calculationBase: "TAXABLE_SALARY",
    isSystem: 1,
    displayOrder: 101,
    requiresHRApproval: 0,
    taxable: 0,
  },

  {
    name: "SOCIAL_SECURITY",
    displayName: "Sécurité sociale",
    type: "DEDUCTION",
    calculationType: "POURCENTAGE_BRUT",
    calculationBase: "GROSS_SALARY",
    isSystem: 1,
    displayOrder: 102,
    requiresHRApproval: 0,
    taxable: 0,
  },

  {
    name: "LOAN",
    displayName: "Remboursement de prêt",
    type: "DEDUCTION",
    calculationType: "FIXE",
    isSystem: 1,
    displayOrder: 103,
    requiresHRApproval: 1,
    taxable: 0,
  },

  {
    name: "ABSENCE",
    displayName: "Retenue pour absence",
    type: "DEDUCTION",
    calculationType: "FIXE",
    isSystem: 1,
    displayOrder: 104,
    requiresHRApproval: 1,
    taxable: 0,
  },

  {
    name: "LATE_PENALTY",
    displayName: "Retenue pour retard",
    type: "DEDUCTION",
    calculationType: "MANUEL",
    isSystem: 1,
    displayOrder: 105,
    requiresHRApproval: 1,
    taxable: 0,
  },
];
async function seedPayrollComponents() {
  for (const component of defaultPayrollComponents) {
    const exists = await PayrollComponent.findOne({
      name: component.name,
    });

    if (!exists) {
      await PayrollComponent.create({
        ...component,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`CREATED PAYROLL COMPONENT: ${component.name}`);
    }
  }
}

export default seedPayrollComponents;
