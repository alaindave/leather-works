import { randomUUID } from "crypto";
import { run, get, all, transaction, runDirect } from "../db.js";
import {
  PayrollBatchResult,
  PayrollResult,
} from "../../../../../shared/payroll_service/types.js";
import {
  PayrollResultRecord,
  PayrollRun,
  PayrollStatus,
} from "../../../common/types/payroll/Payroll.js";
import User from "../../../common/types/User.js";
import AdminUser from "../../../common/types/AdminUser.js";
import { addToSyncQueue } from "./sync.repository.js";

//Create payroll draft
export async function createPayrollRun(
  input: PayrollBatchResult,
  admin: Omit<User, "password" | "notes">
) {
  const date = new Date();
  const now = date.toISOString();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const payrollRun: PayrollRun = {
    _id: randomUUID(),
    generatedBy: admin._id,
    month,
    year,
    employeeCount: input.employeeCount,
    totalBasicSalary: input.totalBasicSalary,
    totalEarnings: input.totalEarnings,
    totalDeductions: input.totalDeductions,
    totalNetSalary: input.totalNetSalary,
    status: "BROUILLON",
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
 employeeCount,
 totalBasicSalary,
 totalEarnings,
 totalDeductions,
 totalNetSalary,
 status,
 synced,
 createdAt,
 updatedAt,
 isDeleted
 )
 VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)
 `,
    [
      payrollRun._id,
      payrollRun.generatedBy,
      payrollRun.month,
      payrollRun.year,
      payrollRun.employeeCount,
      payrollRun.totalBasicSalary,
      payrollRun.totalEarnings,
      payrollRun.totalDeductions,
      payrollRun.totalNetSalary,
      payrollRun.status,
      payrollRun.synced,
      payrollRun.createdAt,
      payrollRun.updatedAt,
      payrollRun.isDeleted,
    ]
  );

  await addToSyncQueue({
    entity: "payroll_run",
    entityId: payrollRun._id,
    operation: "create",
    payload: JSON.stringify(payrollRun),
  });

  return payrollRun;
}

//Get payroll runs
export async function getPayrollRuns() {
  return await all<PayrollRun>(
    `
      SELECT
         pr.*,
         gen.firstName || ' ' || gen.lastName AS generatedByName
      FROM payroll_runs pr
      LEFT JOIN admin_users gen
      ON pr.generatedBy = gen._id;

 `
  );
}

//Get payroll by ID
export async function getPayrollRunById(_id: string) {
  return await get<PayrollRun>(
    `
      SELECT
          pr.*,
          gen.firstName || ' ' || gen.lastName AS generatedByName,
          can.firstName || ' ' ||can.lastName AS cancelledByName,
          ver.firstName || ' ' ||ver.lastName AS submittedForVerificationByName

      FROM payroll_runs pr
      LEFT JOIN admin_users gen
      ON pr.generatedBy = gen._id
      LEFT JOIN admin_users can
      ON pr.cancelledBy = can._id
      LEFT JOIN admin_users ver
      ON pr.submittedForVerificationBy = ver._id

      WHERE pr._id=?

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
//Cancel payroll run
export async function cancelPayrollRun(payrollRunId: string, admin: AdminUser) {
  const now = new Date().toISOString();

  // Fetch affected payroll result IDs before the transaction
  const results = await all<{ _id: string }>(
    `
    SELECT _id
    FROM payroll_results
    WHERE payrollRunId = ?
    `,
    [payrollRunId]
  );

  // Transaction: only direct DB operations
  await transaction(async () => {
    await runDirect(
      `
      UPDATE payroll_runs
      SET
        status = ?,
        cancelledBy = ?,
        cancelledAt = ?,
        updatedAt = ?
      WHERE _id = ?
      `,
      ["ANNULÉ", admin._id, now, now, payrollRunId]
    );

    await runDirect(
      `
      UPDATE payroll_results
      SET
        status = ?,
        updatedAt = ?
      WHERE payrollRunId = ?
      `,
      ["ANNULÉ", now, payrollRunId]
    );

    return true;
  });

  // Queue the payroll run for sync
  await addToSyncQueue({
    entity: "payroll_run",
    entityId: payrollRunId,
    operation: "update",
    payload: JSON.stringify({
      _id: payrollRunId,
      status: "ANNULÉ",
      updatedAt: now,
    }),
  });

  // Queue all affected payroll results for sync
  for (const result of results) {
    await addToSyncQueue({
      entity: "payroll_result",
      entityId: result._id,
      operation: "update",
      payload: JSON.stringify({
        _id: result._id,
        status: "ANNULÉ",
        updatedAt: now,
      }),
    });
  }

  return true;
}

//Verify payroll run
export async function verifyPayrollRun(payrollRunId: string, admin: AdminUser) {
  const now = new Date().toISOString();

  return transaction(async () => {
    await runDirect(
      `
      UPDATE payroll_runs
      SET
        status = ?,
        submittedForVerificationBy = ?,
        submittedForVerificationAt = ?,
        updatedAt = ?
      WHERE _id = ?
      `,
      ["VERIFICATION", admin._id, now, now, payrollRunId]
    );

    await runDirect(
      `
      UPDATE payroll_results
      SET
        status = ?,
        updatedAt = ?
      WHERE payrollRunId = ?
      `,
      ["VERIFICATION", now, payrollRunId]
    );

    return true;
  });
}

//Save payroll result
export async function savePayrollResult(
  payrollRunId: string,
  result: PayrollResult
) {
  const date = new Date();

  const now = date.toISOString();
  const month = date.getMonth() + 1; // 1-12
  const year = date.getFullYear();
  const payrollResultId = randomUUID();

  //Save payroll summary
  await run(
    `
 INSERT INTO payroll_results
 (
  _id,
  payrollRunId,
  employeeId,
  month,
  year,
  baseSalary,
  grossSalary,
  totalEarnings,
  totalDeductions,
  netSalary,
  status,
  createdAt,
  updatedAt,
   synced,
  isDeleted
 )
 VALUES(?,?,?,?,?,?,?,?,
 ?,?,?,?,?,0,0)
 `,
    [
      payrollResultId,
      payrollRunId,
      result.employeeId,
      month,
      year,
      result.baseSalary,
      result.grossSalary,
      result.totalEarnings,
      result.totalDeductions,
      result.netSalary,
      result.status,
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

export async function getPayrollResults(payrollRunId: string) {
  return await all(
    `
    SELECT
      pr.*,
      e.firstName,
      e.lastName,
      e.department
    FROM payroll_results pr
    LEFT JOIN employees e
      ON pr.employeeId = e._id
    WHERE pr.payrollRunId = ?
    ORDER BY pr.createdAt DESC
    `,
    [payrollRunId]
  );
}

// Get employee payroll results
// If payrollRunId is provided, return result for that run only
// Otherwise return all payroll results for the employee
export async function getEmployeePayrollResults(
  employeeId: string,
  payrollRunId?: string
) {
  let query = `
    SELECT *
    FROM payroll_results
    WHERE employeeId = ?
  `;

  const params: any[] = [employeeId];

  if (payrollRunId) {
    query += `
      AND payrollRunId = ?
    `;
    params.push(payrollRunId);
  }

  query += `
    ORDER BY year DESC, month DESC
  `;

  return await all<PayrollResultRecord>(query, params);
}

// Get one employee's payroll result for a given month and year
export async function getEmployeePayrollResultByMonthAndYear(
  employeeId: string,
  month: number,
  year: number
) {
  return await get<PayrollResultRecord>(
    `
    SELECT *
    FROM payroll_results
    WHERE employeeId = ?
      AND month = ?
      AND year = ?
      AND isDeleted = 0
    LIMIT 1
    `,
    [employeeId, month, year]
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
