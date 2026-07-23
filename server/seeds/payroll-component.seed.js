const PayrollComponent = require("../models/payrollComponentModel.js");

const defaultPayrollComponents = [
  // ==========================
  // Earnings
  // ==========================

  {
    name: "BASIC_SALARY",
    displayName: "Salaire de base",
    type: "EARNING",
    calculationType: "MANUEL",
    defaultValue: 0,
    isRequired: 1,
    isSystem: 1,
    displayOrder: 1,
  },

  {
    name: "OVERTIME",
    displayName: "Heures supplémentaires",
    type: "EARNING",
    calculationType: "MANUEL",
    defaultValue: 0,
    isSystem: 1,
    displayOrder: 2,
  },

  {
    name: "BONUS",
    displayName: "Prime",
    type: "EARNING",
    calculationType: "MANUEL",
    defaultValue: 0,
    isSystem: 1,
    displayOrder: 3,
  },

  {
    name: "HOUSING_ALLOWANCE",
    displayName: "Indemnité de logement",
    type: "EARNING",
    calculationType: "FIXE",
    defaultValue: 50000,
    isSystem: 1,
    displayOrder: 4,
  },

  {
    name: "TRANSPORT_ALLOWANCE",
    displayName: "Indemnité de transport",
    type: "EARNING",
    calculationType: "FIXE",
    defaultValue: 30000,
    isSystem: 1,
    displayOrder: 5,
  },

  {
    name: "MEAL_ALLOWANCE",
    displayName: "Indemnité de repas",
    type: "EARNING",
    calculationType: "FIXE",
    defaultValue: 15000,
    isSystem: 1,
    displayOrder: 6,
  },

  {
    name: "COMMISSION",
    displayName: "Commission",
    type: "EARNING",
    calculationType: "MANUEL",
    defaultValue: 0,
    isSystem: 1,
    displayOrder: 7,
  },

  // ==========================
  // Deductions
  // ==========================

  {
    name: "TAX",
    displayName: "Impôt",
    type: "DEDUCTION",
    calculationType: "POURCENTAGE",
    defaultValue: 0,
    percentageOf: "GROSS_PAY",
    isSystem: 1,
    displayOrder: 101,
  },

  {
    name: "SOCIAL_SECURITY",
    displayName: "Sécurité sociale",
    type: "DEDUCTION",
    calculationType: "POURCENTAGE",
    defaultValue: 0,
    percentageOf: "GROSS_PAY",
    isSystem: 1,
    displayOrder: 102,
  },

  {
    name: "LOAN",
    displayName: "Remboursement de prêt",
    type: "DEDUCTION",
    calculationType: "MANUEL",
    defaultValue: 0,
    isSystem: 1,
    displayOrder: 103,
  },

  {
    name: "ABSENCE",
    displayName: "Retenue pour absence",
    type: "DEDUCTION",
    calculationType: "MANUEL",
    defaultValue: 0,
    isSystem: 1,
    displayOrder: 104,
  },

  {
    name: "LATE_PENALTY",
    displayName: "Retenue pour retard",
    type: "DEDUCTION",
    calculationType: "MANUEL",
    defaultValue: 0,
    isSystem: 1,
    displayOrder: 105,
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

module.exports = seedPayrollComponents;
