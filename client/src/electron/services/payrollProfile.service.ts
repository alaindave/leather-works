import { randomUUID } from "crypto";
import EmployeePayrollProfile from "../../shared/types/payroll/PayrollEmployeeProfile.js";
import { getAllEmployees } from "../database/repositories/employees.repository.js";
import { getEnabledPayrollComponents } from "../database/repositories/payroll_components.repository.js";
import {
  createEmployeePayrollProfile,
  createManyEmployeePayrollProfiles,
  getAllEmployeePayrollProfiles,
  updateEmployeePayrollProfile,
} from "../database/repositories/payrollEmployeeProfile.repository.js";
import PayrollComponent from "../../shared/types/payroll/PayrollComponent.js";
import CreatePayrollProfileDto from "../../shared/types/payroll/CreatePayrollProfileDto.js";

// Create payroll profiles for a newly created employee.
export async function initializeEmployeePayrollProfilesForEmployee(
  employeeId: string
) {
  console.log("INITIALIZING PAYROLL PROFILES FOR NEW EMPLOYEE...");
  const components = await getEnabledPayrollComponents();
  const now = new Date().toISOString();
  const profiles: CreatePayrollProfileDto[] = components.map((component) => ({
    _id: randomUUID(),
    employeeId,
    componentId: component._id,
    name: component.name,
    displayName: component.displayName,
    displayOrder: component.displayOrder,
    type: component.type,
    calculationType: component.calculationType,
    value: component.defaultValue,
    enabled: component.enabled,
    isOverridden: 0,
    synced: 0,
    isDeleted: 0,
    createdAt: now,
    updatedAt: now,
    lastSyncedAt: null,
  }));

  await createManyEmployeePayrollProfiles(employeeId, profiles);
}

//Initialize payroll profiles for every employee.
export async function initializeEmployeePayrollProfiles() {
  console.log("INITIALIZING EMPLOYEE PAYROLL PROFILES...");
  const employees = await getAllEmployees();
  const components = await getEnabledPayrollComponents();
  const profiles = await getAllEmployeePayrollProfiles();

  const existing = new Set(
    profiles.map((profile) => `${profile.employeeId}:${profile.componentId}`)
  );

  for (const employee of employees) {
    for (const component of components) {
      const key = `${employee._id}:${component._id}`;

      if (existing.has(key)) {
        continue;
      }

      await createEmployeePayrollProfile(employee._id, {
        name: component.name,
        displayName: component.displayName,
        displayOrder: component.displayOrder,
        componentId: component._id,
        type: component.type,
        calculationType: component.calculationType,
        value: component.defaultValue,
      });
    }
  }
}

//Add a newly-created payroll component to every existing employee.
export async function addPayrollComponentToAllEmployees(
  component: PayrollComponent
) {
  const employees = await getAllEmployees();

  for (const employee of employees) {
    const profile: EmployeePayrollProfile = {
      componentId: component._id,
      name: component.name,
      displayName: component.displayName,
      displayOrder: component.displayOrder,
      type: component.type,
      calculationType: component.calculationType,
      value: component.defaultValue,
      percentageOf: component.percentageOf,
    };

    await createManyEmployeePayrollProfiles(employee._id, [profile]);
  }
}

/**
 * Applies updated payroll component defaults
 * to employee profiles.
 *
 * Only updates profiles whose values have not
 * been customized.
 */
export async function updatePayrollComponentDefaults(
  component: PayrollComponent
) {
  const profiles = await getAllEmployeePayrollProfiles();

  const matchingProfiles = profiles.filter(
    (profile) => profile.componentId === component._id && !profile.isOverridden
  );

  for (const profile of matchingProfiles) {
    profile.displayName = component.displayName;
    profile.displayOrder = component.displayOrder;
    profile.calculationType = component.calculationType;
    profile.value = component.defaultValue;
    profile.enabled = component.enabled;
    profile.synced = 0;
    profile.updatedAt = new Date().toISOString();

    await updateEmployeePayrollProfile(profile);
  }
}

// Reset back to the company defaults.
export async function resetEmployeePayrollProfileToDefaults(
  employeeId: string
) {
  const components = await getEnabledPayrollComponents();
  const profiles = await getAllEmployeePayrollProfiles();

  const employeeProfiles = profiles.filter(
    (profile) => profile.employeeId === employeeId
  );

  for (const profile of employeeProfiles) {
    const component = components.find((c) => c._id === profile.componentId);
    if (!component) {
      continue;
    }

    profile.displayName = component.displayName;
    profile.displayOrder = component.displayOrder;
    profile.type = component.type;
    profile.calculationType = component.calculationType;
    profile.value = component.defaultValue;
    profile.enabled = component.enabled;
    profile.isOverridden = 0;
    profile.isDeleted = component.isDeleted;
    profile.synced = 0;
    profile.updatedAt = new Date().toISOString();

    console.log("EMPLOYEE PROFILE TO RESET", profile);

    await updateEmployeePayrollProfile(profile);
  }
}
