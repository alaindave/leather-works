import { randomUUID } from "crypto";
import { run, get, all } from "../db.js";
import { PayrollResult } from "../../../../../shared/payroll_service/types.js";
import {
  PayrollResultRecord,
  PayrollRun,
  PayrollStatus,
} from "../../../common/types/payroll/Payroll.js";
import User from "../../../common/types/User.js";

//Create payroll draft
export async function createPayrollRun(
  month: number,
  year: number,
  admin: Omit<User, "password" | "notes">,
  status: PayrollStatus = "BROUILLON"
) {
  const now = new Date().toISOString();

  const payrollRun: PayrollRun = {
    _id: randomUUID(),
    generatedBy: admin._id,
    month,
    year,
    status,
    synced: 0,
    createdAt: now,
    updatedAt: now,
    isDeleted: 0,
  };

  await run(
    `
 INSERT INTO payroll_runs
 (
 _id,
 generatedBy,
 month,
 year,
 status,
 synced,
 createdAt,
 updatedAt,
 isDeleted
 )
 VALUES(?,?,?,?,?,?,?,?,?)
 `,
    [
      payrollRun._id,
      payrollRun.generatedBy,
      payrollRun.month,
      payrollRun.year,
      payrollRun.status,
      payrollRun.synced,
      payrollRun.createdAt,
      payrollRun.updatedAt,
      payrollRun.isDeleted,
    ]
  );

  return payrollRun;
}

//Get payroll runs
export async function getPayrollRuns() {
  return await all<PayrollRun>(
    `
 SELECT *
 FROM payroll_runs
 ORDER BY createdAt DESC
 `
  );
}

//Get payroll by ID
export async function getPayrollRunById(_id: string) {
  return await get<PayrollRun>(
    `
 SELECT *
 FROM payroll_runs
 WHERE _id=?
 `,
    [_id]
  );
}

//Update payroll status
export async function updatePayrollStatus(_id: string, status: PayrollStatus) {
  return await run(
    `
 UPDATE payroll_runs

 SET
 status=?,
 updatedAt=?

 WHERE _id=?
 `,
    [status, new Date().toISOString(), _id]
  );
}

//Save payroll result
export async function savePayrollResult(
  payrollRunId: string,
  result: PayrollResult
) {
  const now = new Date().toISOString();
  const payrollResultId = randomUUID();

  //Save payroll summary
  await run(
    `
 INSERT INTO payroll_results
 (
 _id,
 payrollRunId,
 employeeId,
 grossSalary,
 totalDeductions,
 netSalary,
 createdAt,
 updatedAt,
 synced,
 isDeleted
 )
 VALUES(?,?,?,?,?,?,?,?,0,0)
 `,
    [
      payrollResultId,
      payrollRunId,
      result.employeeId,
      result.grossSalary,
      result.totalDeductions,
      result.netSalary,
      now,
      now,
    ]
  );

  //Save payroll items
  const items = [...result.earnings, ...result.deductions];

  for (const item of items) {
    await run(
      `
  INSERT INTO payroll_items
  (
  _id,
  payrollResultId,
  employeeId,
  componentId,
  name,
  type,
  amount,
  createdAt,
  updatedAt
  )

  VALUES(?,?,?,?,?,?,?,?,?)
  `,
      [
        randomUUID(),
        payrollResultId,
        result.employeeId,
        item.componentId,
        item.name,
        item.type,
        item.amount,
        now,
        now,
      ]
    );
  }
}

//Bulk save payroll results
export async function savePayrollResults(
  payrollRunId: string,
  results: PayrollResult[]
) {
  for (const result of results) {
    await savePayrollResult(payrollRunId, result);
  }
}

//Get payroll results by payroll run ID
export async function getPayrollResults(payrollRunId: string) {
  return await all<PayrollResultRecord>(
    `
    SELECT *
    FROM payroll_results
    WHERE payrollRunId=?
    ORDER BY createdAt ASC

 `,
    [payrollRunId]
  );
}

//Get one employee's payroll result
export async function getEmployeePayrollResult(
  payrollRunId: string,
  employeeId: string
) {
  return await get<PayrollResultRecord>(
    `
 SELECT *
 FROM payroll_results
 WHERE payrollRunId=?
 AND employeeId=?

 `,
    [payrollRunId, employeeId]
  );
}

// Get payroll items - earnings + deductions
export async function getPayrollItems(
  payrollRunId: string,
  employeeId?: string
) {
  if (employeeId) {
    return await all(
      `
      SELECT *
      FROM payroll_items
      WHERE payrollRunId=?
        AND employeeId=?
      ORDER BY createdAt ASC

      `,
      [payrollRunId, employeeId]
    );
  }

  return await all(
    `
    SELECT *
     FROM payroll_items
        WHERE payrollRunId=?
    ORDER BY createdAt ASC

    `,
    [payrollRunId]
  );
}

/**
 * Delete payroll run data
 *
 * Useful for reprocessing draft payroll
 */
export async function deletePayrollRun(payrollRunId: string) {
  await run(
    `
 DELETE FROM payroll_items
 WHERE payrollRunId=?
 `,
    [payrollRunId]
  );

  await run(
    `
 DELETE FROM payroll_results
 WHERE payrollRunId=?
 `,
    [payrollRunId]
  );

  return await run(
    `
 DELETE FROM payroll_runs
 WHERE _id=?
 `,
    [payrollRunId]
  );
}
