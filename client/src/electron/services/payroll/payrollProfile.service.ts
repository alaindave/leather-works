import { randomUUID } from "crypto";
import PayrollEmployeeProfile from "../../../common/types/payroll/PayrollEmployeeProfile.js";
import {
  getAllEmployees,
  getEmployeeById,
} from "../../database/repositories/employees.repository.js";
import { getPayrollComponents } from "../../database/repositories/payroll_components.repository.js";
import {
  createEmployeePayrollProfile,
  createManyEmployeePayrollProfiles,
  getAllEmployeePayrollProfiles,
  updateEmployeePayrollProfile,
} from "../../database/repositories/payroll_employee_profile.repository.js";
import PayrollComponent from "../../../common/types/payroll/PayrollComponent.js";
import CreatePayrollProfileDto from "../../../common/types/payroll/CreatePayrollProfileDto.js";

// Create payroll profiles for a newly created employee.
export async function initializeEmployeePayrollProfilesForEmployee(
  employeeId: string
) {
  console.log("INITIALIZING PAYROLL PROFILES FOR NEW EMPLOYEE...");
  const employee = await getEmployeeById(employeeId);
  if (!employee) {
    throw new Error(`Employee ${employeeId} not found`);
  }
  const components = await getPayrollComponents();
  const now = new Date().toISOString();
  const profiles: CreatePayrollProfileDto[] = components.map((component) => {
    let value = component.defaultValue ?? null;

    // Automatically use employee salary
    if (component.name === "BASE_SALARY") {
      value = employee.salary;
    }

    return {
      _id: randomUUID(),
      employeeId,
      componentId: component._id,
      name: component.name,
      displayName: component.displayName,
      displayOrder: component.displayOrder,
      type: component.type,
      calculationType: component.calculationType,
      value,
      taxable: component.taxable,
      requiresHRApproval: component.requiresHRApproval,
      enabled: component.enabled,
      isOverridden: 0,
      synced: 0,
      isDeleted: 0,
      createdAt: now,
      updatedAt: now,
      lastSyncedAt: null,
    };
  });

  await createManyEmployeePayrollProfiles(employeeId, profiles);
}

//Initialize payroll profiles for every employee.
export async function initializeEmployeePayrollProfiles() {
  console.log("INITIALIZING EMPLOYEE PAYROLL PROFILES...");

  const employees = await getAllEmployees();
  const components = await getPayrollComponents();
  const profiles = await getAllEmployeePayrollProfiles();

  const existing = new Set(
    profiles
      .filter((profile) => !profile.isDeleted)
      .map((profile) => `${profile.employeeId}:${profile.componentId}`)
  );

  for (const employee of employees) {
    for (const component of components) {
      const key = `${employee._id}:${component._id}`;

      if (existing.has(key)) {
        continue;
      }

      let value = component.defaultValue;

      if (component.name === "BASE_SALARY") {
        value = employee.salary;
      }

      await createEmployeePayrollProfile(employee._id, {
        name: component.name,
        displayName: component.displayName,
        displayOrder: component.displayOrder,
        componentId: component._id,
        type: component.type,
        calculationType: component.calculationType,
        value: value ?? null,
        taxable: component.taxable,
        requiresHRApproval: component.requiresHRApproval,
      });

      // IMPORTANT: remember that we just created it
      existing.add(key);
    }
  }
}

// Add a newly-created payroll component to every existing employee.
export async function addPayrollComponentToAllEmployees(
  component: PayrollComponent
) {
  const employees = await getAllEmployees();

  for (const employee of employees) {
    let value = component.defaultValue;

    // Use employee salary for BASIC_SALARY
    if (component.name === "BASE_SALARY") {
      value = employee.salary;
    }

    const profile: PayrollEmployeeProfile = {
      componentId: component._id,
      employeeId: employee._id,
      name: component.name,
      displayName: component.displayName,
      displayOrder: component.displayOrder,
      type: component.type,
      calculationType: component.calculationType,
      value: value ?? null,
      taxable: component.taxable,
      calculationBase: component.calculationBase,
      isOverridden: 0,
      requiresHRApproval: component.requiresHRApproval,
      enabled: component.enabled,
      synced: 0,
      isDeleted: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastSyncedAt: null,
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
    profile.value = component.defaultValue ?? null;
    profile.taxable = component.taxable;
    profile.enabled = component.enabled;
    profile.synced = 0;
    profile.updatedAt = new Date().toISOString();

    await updateEmployeePayrollProfile(profile);
  }
}

/**
 * Removes payroll components that have been deleted
 * from every employee's payroll profile.
 *
 * Uses soft deletion so the change can be synchronized
 * to the server and retained for audit/history.
 */
export async function removeDeletedPayrollComponentsFromEmployeeProfiles() {
  console.log("REMOVING DELETED PAYROLL COMPONENTS FROM EMPLOYEE PROFILES...");

  const components = await getPayrollComponents();
  const profiles = await getAllEmployeePayrollProfiles();

  // Components that are still active
  const activeComponentIds = new Set(
    components
      .filter((component) => !component.isDeleted)
      .map((component) => component._id)
  );

  // Profiles whose payroll component no longer exists
  // or whose component has been deleted.
  const deletedProfiles = profiles.filter(
    (profile) =>
      !profile.isDeleted && !activeComponentIds.has(profile.componentId)
  );

  const now = new Date().toISOString();

  for (const profile of deletedProfiles) {
    profile.isDeleted = 1;
    profile.enabled = 0;
    profile.synced = 0;
    profile.updatedAt = now;

    console.log(
      `REMOVING PAYROLL COMPONENT ${profile.componentId} FROM EMPLOYEE ${profile.employeeId}`
    );

    await updateEmployeePayrollProfile(profile);
  }

  console.log(`REMOVED ${deletedProfiles.length} DELETED PAYROLL PROFILES`);

  return deletedProfiles.length;
}

// Reset back to the company defaults.
export async function resetEmployeePayrollProfileToDefaults(
  employeeId: string
) {
  const components = await getPayrollComponents();
  const profiles = await getAllEmployeePayrollProfiles();
  const employee = await getEmployeeById(employeeId);

  if (!employee) {
    throw new Error(`EMPLOYEE ${employeeId} NOT FOUND`);
  }

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

    // Use employee salary for BASIC_SALARY
    if (component.name === "BASE_SALARY") {
      profile.value = employee.salary;
    } else {
      profile.value = component.defaultValue ?? null;
    }

    if (component.type !== "EARNING") {
      profile.value = component.defaultValue ?? null;
    }

    profile.taxable = component.taxable;
    profile.isOverridden = 0;
    profile.isDeleted = component.isDeleted;
    profile.enabled = component.isDeleted ? 0 : component.enabled;
    profile.synced = 0;
    profile.updatedAt = new Date().toISOString();

    console.log("EMPLOYEE PROFILE TO RESET", profile);

    await updateEmployeePayrollProfile(profile);
  }
}
