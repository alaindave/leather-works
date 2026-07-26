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

// Create payroll profiles for a newly created employee.
export async function initializeEmployeePayrollProfilesForEmployee(
  employeeId: string
) {
  console.log("INITIALIZING PAYROLL PROFILES FOR NEW EMPLOYEE...");
  const components = await getEnabledPayrollComponents();
  const now = new Date().toISOString();
  const profiles: EmployeePayrollProfile[] = components.map((component) => ({
    _id: randomUUID(),
    employeeId,
    componentId: component._id,
    displayName: component.displayName,
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

  await createManyEmployeePayrollProfiles(profiles);
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

  const now = new Date().toISOString();

  for (const employee of employees) {
    for (const component of components) {
      const key = `${employee._id}:${component._id}`;

      if (existing.has(key)) {
        continue;
      }

      await createEmployeePayrollProfile({
        _id: randomUUID(),
        employeeId: employee._id,
        componentId: component._id,
        displayName: component.displayName,
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
      });
    }
  }
}

//Add a newly-created payroll component to every existing employee.
export async function addPayrollComponentToAllEmployees(
  component: PayrollComponent
) {
  const employees = await getAllEmployees();
  const now = new Date().toISOString();
  const profiles: EmployeePayrollProfile[] = employees.map((employee) => ({
    _id: randomUUID(),
    employeeId: employee._id,
    componentId: component._id,
    displayName: component.displayName,
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

  await createManyEmployeePayrollProfiles(profiles);
}

/**
 * Applies updated payroll component defaults
 * to employee profiles.
 *
 * Only updates profiles whose values have not
 * been customized.
 */
export async function updatePayrollComponentDefaults(component: any) {
  const profiles = await getAllEmployeePayrollProfiles();

  const matchingProfiles = profiles.filter(
    (profile) =>
      profile.componentId === component._id &&
      profile.value === component.previousDefaultValue
  );

  for (const profile of matchingProfiles) {
    profile.displayName = component.displayName;
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
    profile.type = component.type;
    profile.calculationType = component.calculationType;
    profile.value = component.defaultValue;
    profile.enabled = component.enabled;

    profile.synced = 0;
    profile.updatedAt = new Date().toISOString();

    await updateEmployeePayrollProfile(profile);
  }
}
