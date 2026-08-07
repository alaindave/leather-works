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
import PayrollItem from "../../../common/types/payroll/PayrollItem.js";

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
          ver.firstName || ' ' ||ver.lastName AS submittedForVerificationByName,
          app.firstName || ' ' ||app.lastName AS approvedByName,
          paid.firstName || ' ' ||paid.lastName AS paidByName


      FROM payroll_runs pr
      LEFT JOIN admin_users gen
      ON pr.generatedBy = gen._id
      LEFT JOIN admin_users can
      ON pr.cancelledBy = can._id
      LEFT JOIN admin_users ver
      ON pr.submittedForVerificationBy = ver._id
      LEFT JOIN admin_users app
      ON pr.approvedBy = app._id
      LEFT JOIN admin_users paid
      ON pr.paidBy = paid._id

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
        cancelledAt=?,
        updatedAt = ?
      WHERE payrollRunId = ?
      `,
      ["ANNULÉ", now, now, payrollRunId]
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
      cancelledBy: admin._id,
      cancelledAt: now,
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
        _id: payrollRunId,
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

  // Fetch affected payroll result IDs before the transaction
  const results = await all<{ _id: string }>(
    `
      SELECT _id
      FROM payroll_results
      WHERE payrollRunId = ?
    `,
    [payrollRunId]
  );

  // Update local database
  await transaction(async () => {
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
          verifiedAt = ?,
          updatedAt = ?
        WHERE payrollRunId = ?
      `,
      ["VERIFICATION", now, now, payrollRunId]
    );
  });

  // Queue payroll run for sync
  await addToSyncQueue({
    entity: "payroll_run",
    entityId: payrollRunId,
    operation: "update",
    payload: JSON.stringify({
      _id: payrollRunId,
      status: "VERIFICATION",
      submittedForVerificationBy: admin._id,
      submittedForVerificationAt: now,
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
        status: "VERIFICATION",
        verifiedAt: now,
        updatedAt: now,
      }),
    });
  }

  return true;
}

//Approve payroll run
export async function approvePayrollRun(
  payrollRunId: string,
  admin: AdminUser
) {
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

  // Update local database
  await transaction(async () => {
    await runDirect(
      `
        UPDATE payroll_runs
        SET
          status = ?,
          approvedBy = ?,
          approvedAt = ?,
          updatedAt = ?
        WHERE _id = ?
      `,
      ["APPROUVÉ", admin._id, now, now, payrollRunId]
    );

    await runDirect(
      `
        UPDATE payroll_results
        SET
          status = ?,
          approvedAt = ?,
          updatedAt = ?
        WHERE payrollRunId = ?
      `,
      ["APPROUVÉ", now, now, payrollRunId]
    );
  });

  // Queue payroll run for sync
  await addToSyncQueue({
    entity: "payroll_run",
    entityId: payrollRunId,
    operation: "update",
    payload: JSON.stringify({
      _id: payrollRunId,
      status: "APPROUVÉ",
      approvedBy: admin._id,
      approvedAt: now,
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
        status: "APPROUVÉ",
        approvedAt: now,
        updatedAt: now,
      }),
    });
  }

  return true;
}

//Payment payroll run
export async function paymentPayrollRun(
  payrollRunId: string,
  admin: AdminUser
) {
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

  // Update local database
  await transaction(async () => {
    await runDirect(
      `
        UPDATE payroll_runs
        SET
          status = ?,
          paidBy = ?,
          paidAt = ?,
          updatedAt = ?
        WHERE _id = ?
      `,
      ["PAYÉ", admin._id, now, now, payrollRunId]
    );

    await runDirect(
      `
        UPDATE payroll_results
        SET
          status = ?,
          paidAt = ?,
          updatedAt = ?
        WHERE payrollRunId = ?
      `,
      ["PAYÉ", now, now, payrollRunId]
    );
  });

  // Queue payroll run for sync
  await addToSyncQueue({
    entity: "payroll_run",
    entityId: payrollRunId,
    operation: "update",
    payload: JSON.stringify({
      _id: payrollRunId,
      status: "PAYÉ",
      paidBy: admin._id,
      paidAt: now,
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
        status: "PAYÉ",
        paidAt: now,
        updatedAt: now,
      }),
    });
  }

  return true;
}

//Save payroll result
export async function savePayrollResult(
  payrollRunId: string,
  result: PayrollResult
) {
  const date = new Date();
  const now = date.toISOString();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const payrollResultId = randomUUID();

  // Generate IDs before saving so they can be used for sync
  const items = [...result.earnings, ...result.deductions].map((item) => ({
    _id: randomUUID(),
    payrollResultId,
    employeeId: result.employeeId,
    componentId: item.componentId,
    name: item.name,
    displayName: item.displayName,
    type: item.type,
    amount: item.amount,
    createdAt: now,
    updatedAt: now,
  }));

  await transaction(async () => {
    // Save payroll result
    await runDirect(
      `
        INSERT INTO payroll_results (
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
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)
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

    // Save payroll items
    for (const item of items) {
      await runDirect(
        `
          INSERT INTO payroll_items (
            _id,
            payrollResultId,
            employeeId,
            componentId,
            name,
            displayName,
            type,
            amount,
            createdAt,
            updatedAt
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          item._id,
          item.payrollResultId,
          item.employeeId,
          item.componentId,
          item.name,
          item.displayName,
          item.type,
          item.amount,
          item.createdAt,
          item.updatedAt,
        ]
      );
    }
  });

  // Queue payroll result
  await addToSyncQueue({
    entity: "payroll_result",
    entityId: payrollResultId,
    operation: "create",
    payload: JSON.stringify({
      _id: payrollResultId,
      payrollRunId,
      employeeId: result.employeeId,
      month,
      year,
      baseSalary: result.baseSalary,
      grossSalary: result.grossSalary,
      totalEarnings: result.totalEarnings,
      totalDeductions: result.totalDeductions,
      netSalary: result.netSalary,
      status: result.status,
      createdAt: now,
      updatedAt: now,
      isDeleted: 0,
    }),
  });

  // Queue payroll items
  for (const item of items) {
    await addToSyncQueue({
      entity: "payroll_item",
      entityId: item._id,
      operation: "create",
      payload: JSON.stringify(item),
    });
  }

  return payrollResultId;
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

// Get employee payroll results for a given payroll run ID
export async function getEmployeePayrollResults(
  employeeId: string,
  payrollRunId?: string
) {
  return get<PayrollResultRecord>(
    `
    SELECT *
    FROM payroll_results
    WHERE payrollRunId = ?
      AND employeeId=?
    `,
    [payrollRunId, employeeId]
  );
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
  payrollResultId: string,
  employeeId?: string
) {
  if (employeeId) {
    return await all<PayrollItem[]>(
      `
      SELECT *
      FROM payroll_items
      WHERE payrollResultId=?
        AND employeeId=?
      ORDER BY createdAt ASC

      `,
      [payrollResultId, employeeId]
    );
  }

  return await all<PayrollItem[]>(
    `
    SELECT *
     FROM payroll_items
        WHERE payrollResultId=?
    ORDER BY createdAt ASC

    `,
    [payrollResultId]
  );
}

/**
 * Delete payroll run data
 *
 *
 */
export async function deletePayrollRun(payrollRunId: string) {
  // Get IDs before deleting the records
  const results = await all<{ _id: string }>(
    `
      SELECT _id
      FROM payroll_results
      WHERE payrollRunId = ?
    `,
    [payrollRunId]
  );

  const items = await all<{ _id: string }>(
    `
      SELECT _id
      FROM payroll_items
      WHERE payrollRunId = ?
    `,
    [payrollRunId]
  );

  await transaction(async () => {
    // Delete payroll items
    await runDirect(
      `
        DELETE FROM payroll_items
        WHERE payrollRunId = ?
      `,
      [payrollRunId]
    );

    // Delete payroll results
    await runDirect(
      `
        DELETE FROM payroll_results
        WHERE payrollRunId = ?
      `,
      [payrollRunId]
    );

    // Delete payroll run
    await runDirect(
      `
        DELETE FROM payroll_runs
        WHERE _id = ?
      `,
      [payrollRunId]
    );
  });

  // Queue payroll items for deletion
  for (const item of items) {
    await addToSyncQueue({
      entity: "payroll_item",
      entityId: item._id,
      operation: "delete",
      payload: JSON.stringify({
        _id: item._id,
      }),
    });
  }

  // Queue payroll results for deletion
  for (const result of results) {
    await addToSyncQueue({
      entity: "payroll_result",
      entityId: result._id,
      operation: "delete",
      payload: JSON.stringify({
        _id: result._id,
      }),
    });
  }

  // Queue payroll run for deletion
  await addToSyncQueue({
    entity: "payroll_run",
    entityId: payrollRunId,
    operation: "delete",
    payload: JSON.stringify({
      _id: payrollRunId,
    }),
  });

  return true;
}
