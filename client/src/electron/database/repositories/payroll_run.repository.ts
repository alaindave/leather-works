import { randomUUID } from "crypto";
import { run, get, all, transaction, runDirect } from "../db.js";
import {
  PayrollBatchResult,
  PayrollResult,
  PayrollItem,
} from "../../../common/types/payroll/Payroll.js";
import {
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
        ON pr.generatedBy = gen._id
      WHERE pr.isDeleted = 0
      ORDER BY pr.createdAt DESC
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

// Get payroll runs by status
export async function getPayrollRunsByStatus(status: PayrollStatus) {
  return await get<PayrollRun>(
    `
      SELECT
        pr.*,
        gen.firstName || ' ' || gen.lastName AS generatedByName
      FROM payroll_runs pr
      LEFT JOIN admin_users gen
        ON pr.generatedBy = gen._id
      WHERE pr.status = ?
        AND pr.isDeleted = 0
      ORDER BY pr.createdAt DESC
      LIMIT 1
    `,
    [status]
  );
}

// Upsert payroll run
export async function upsertPayrollRun(payrollRun: PayrollRun) {
  console.log("PAYROLL RUN TO UPSERT", payrollRun);

  // ---------------------------------------------------------
  // 1. First check by canonical _id
  // ---------------------------------------------------------
  const existingById = await get<PayrollRun>(
    `
      SELECT *
      FROM payroll_runs
      WHERE _id = ?
      LIMIT 1
    `,
    [payrollRun._id]
  );

  if (existingById) {
    await run(
      `
        UPDATE payroll_runs
        SET
          generatedBy = ?,
          month = ?,
          year = ?,
          employeeCount = ?,
          totalBasicSalary = ?,
          totalEarnings = ?,
          totalDeductions = ?,
          totalNetSalary = ?,
          status = ?,
          cancelledBy = ?,
          cancelledAt = ?,
          submittedForVerificationBy = ?,
          submittedForVerificationAt = ?,
          approvedBy = ?,
          approvedAt = ?,
          paidBy = ?,
          paidAt = ?,
          synced = 1,
          createdAt = ?,
          updatedAt = ?,
          isDeleted = ?
        WHERE _id = ?
      `,
      [
        payrollRun.generatedBy,
        payrollRun.month,
        payrollRun.year,
        payrollRun.employeeCount,
        payrollRun.totalBasicSalary,
        payrollRun.totalEarnings,
        payrollRun.totalDeductions,
        payrollRun.totalNetSalary,
        payrollRun.status,
        payrollRun.cancelledBy ?? null,
        payrollRun.cancelledAt ?? null,
        payrollRun.submittedForVerificationBy ?? null,
        payrollRun.submittedForVerificationAt ?? null,
        payrollRun.approvedBy ?? null,
        payrollRun.approvedAt ?? null,
        payrollRun.paidBy ?? null,
        payrollRun.paidAt ?? null,
        payrollRun.createdAt,
        payrollRun.updatedAt,
        payrollRun.isDeleted ?? 0,
        payrollRun._id,
      ]
    );

    return true;
  }

  // ---------------------------------------------------------
  // 2. No _id match.
  //    Check for an existing active payroll run
  //    for the same month/year.
  // ---------------------------------------------------------
  const existingByPeriod = await get<PayrollRun>(
    `
      SELECT *
      FROM payroll_runs
      WHERE month = ?
        AND year = ?
        AND isDeleted = 0
        AND status <> 'ANNULÉ'
      LIMIT 1
    `,
    [payrollRun.month, payrollRun.year]
  );

  if (existingByPeriod) {
    console.warn("PAYROLL RUN PERIOD CONFLICT", {
      incoming: payrollRun,
      existing: existingByPeriod,
    });

    // -------------------------------------------------------
    // The server has the same payroll period but a different
    // _id. Replace the local record with the server record.
    // -------------------------------------------------------
    await run(
      `
        UPDATE payroll_runs
        SET
          _id = ?,
          generatedBy = ?,
          month = ?,
          year = ?,
          employeeCount = ?,
          totalBasicSalary = ?,
          totalEarnings = ?,
          totalDeductions = ?,
          totalNetSalary = ?,
          status = ?,
          cancelledBy = ?,
          cancelledAt = ?,
          submittedForVerificationBy = ?,
          submittedForVerificationAt = ?,
          approvedBy = ?,
          approvedAt = ?,
          paidBy = ?,
          paidAt = ?,
          synced = 1,
          createdAt = ?,
          updatedAt = ?,
          isDeleted = ?
        WHERE _id = ?
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
        payrollRun.cancelledBy ?? null,
        payrollRun.cancelledAt ?? null,
        payrollRun.submittedForVerificationBy ?? null,
        payrollRun.submittedForVerificationAt ?? null,
        payrollRun.approvedBy ?? null,
        payrollRun.approvedAt ?? null,
        payrollRun.paidBy ?? null,
        payrollRun.paidAt ?? null,
        payrollRun.createdAt,
        payrollRun.updatedAt,
        payrollRun.isDeleted ?? 0,
        existingByPeriod._id,
      ]
    );

    return true;
  }

  // ---------------------------------------------------------
  // 3. No existing record.
  //    Insert the server payroll run.
  // ---------------------------------------------------------
  await run(
    `
      INSERT INTO payroll_runs (
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
        cancelledBy,
        cancelledAt,
        submittedForVerificationBy,
        submittedForVerificationAt,
        approvedBy,
        approvedAt,
        paidBy,
        paidAt,
        synced,
        createdAt,
        updatedAt,
        isDeleted
      )
      VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?,
        1, ?, ?, ?
      )
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
      payrollRun.cancelledBy ?? null,
      payrollRun.cancelledAt ?? null,
      payrollRun.submittedForVerificationBy ?? null,
      payrollRun.submittedForVerificationAt ?? null,
      payrollRun.approvedBy ?? null,
      payrollRun.approvedAt ?? null,
      payrollRun.paidBy ?? null,
      payrollRun.paidAt ?? null,
      payrollRun.createdAt,
      payrollRun.updatedAt,
      payrollRun.isDeleted ?? 0,
    ]
  );

  return true;
}

export async function upsertPayrollResult(payrollResult: PayrollResult) {
  console.log("PAYROLL RESULT TO UPSERT", payrollResult);

  // First try to find an existing result using the canonical Mongo ID.
  const existingById = await get<PayrollResult>(
    `
      SELECT *
      FROM payroll_results
      WHERE _id = ?
      LIMIT 1
    `,
    [payrollResult._id]
  );

  if (existingById) {
    await run(
      `
        UPDATE payroll_results
        SET
          payrollRunId = ?,
          employeeId = ?,
          month = ?,
          year = ?,
          baseSalary = ?,
          grossSalary = ?,
          totalEarnings = ?,
          totalDeductions = ?,
          netSalary = ?,
          status = ?,
          cancelledAt = ?,
          verifiedAt = ?,
          approvedAt = ?,
          paidAt = ?,
          createdAt = ?,
          updatedAt = ?,
          synced = 1,
          isDeleted = ?
        WHERE _id = ?
      `,
      [
        payrollResult.payrollRunId,
        payrollResult.employeeId,
        payrollResult.month,
        payrollResult.year,
        payrollResult.baseSalary,
        payrollResult.grossSalary,
        payrollResult.totalEarnings,
        payrollResult.totalDeductions,
        payrollResult.netSalary,
        payrollResult.status,
        payrollResult.cancelledAt ?? null,
        payrollResult.verifiedAt ?? null,
        payrollResult.approvedAt ?? null,
        payrollResult.paidAt ?? null,
        payrollResult.createdAt,
        payrollResult.updatedAt,
        payrollResult.isDeleted ?? 0,
        payrollResult._id,
      ]
    );

    return true;
  }

  // No record with this _id.
  // Check whether there is already an active result
  // for this employee/month/year.
  const existingByPeriod = await get<PayrollResult>(
    `
      SELECT *
      FROM payroll_results
      WHERE employeeId = ?
        AND month = ?
        AND year = ?
        AND isDeleted = 0
        AND status <> 'ANNULÉ'
      LIMIT 1
    `,
    [payrollResult.employeeId, payrollResult.month, payrollResult.year]
  );

  if (existingByPeriod) {
    console.warn("PAYROLL RESULT PERIOD CONFLICT", {
      incoming: payrollResult,
      existing: existingByPeriod,
    });

    /*
     * The local record represents the same employee/month/year.
     *
     * Replace the local record's identity and data with the
     * server record because the server is the canonical source
     * during pull sync.
     */
    await run(
      `
        UPDATE payroll_results
        SET
          _id = ?,
          payrollRunId = ?,
          employeeId = ?,
          month = ?,
          year = ?,
          baseSalary = ?,
          grossSalary = ?,
          totalEarnings = ?,
          totalDeductions = ?,
          netSalary = ?,
          status = ?,
          cancelledAt = ?,
          verifiedAt = ?,
          approvedAt = ?,
          paidAt = ?,
          createdAt = ?,
          updatedAt = ?,
          synced = 1,
          isDeleted = ?
        WHERE _id = ?
      `,
      [
        payrollResult._id,
        payrollResult.payrollRunId,
        payrollResult.employeeId,
        payrollResult.month,
        payrollResult.year,
        payrollResult.baseSalary,
        payrollResult.grossSalary,
        payrollResult.totalEarnings,
        payrollResult.totalDeductions,
        payrollResult.netSalary,
        payrollResult.status,
        payrollResult.cancelledAt ?? null,
        payrollResult.verifiedAt ?? null,
        payrollResult.approvedAt ?? null,
        payrollResult.paidAt ?? null,
        payrollResult.createdAt,
        payrollResult.updatedAt,
        payrollResult.isDeleted ?? 0,
        existingByPeriod._id,
      ]
    );

    return true;
  }

  // Nothing exists locally, so insert the server result.
  await run(
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
        cancelledAt,
        verifiedAt,
        approvedAt,
        paidAt,
        createdAt,
        updatedAt,
        synced,
        isDeleted
      )
      VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, 1, ?
      )
    `,
    [
      payrollResult._id,
      payrollResult.payrollRunId,
      payrollResult.employeeId,
      payrollResult.month,
      payrollResult.year,
      payrollResult.baseSalary,
      payrollResult.grossSalary,
      payrollResult.totalEarnings,
      payrollResult.totalDeductions,
      payrollResult.netSalary,
      payrollResult.status,
      payrollResult.cancelledAt ?? null,
      payrollResult.verifiedAt ?? null,
      payrollResult.approvedAt ?? null,
      payrollResult.paidAt ?? null,
      payrollResult.createdAt,
      payrollResult.updatedAt,
      payrollResult.isDeleted ?? 0,
    ]
  );

  return true;
}

//Upsert payroll items
export async function upsertPayrollItem(payrollItem: PayrollItem) {
  await run(
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
        updatedAt,
        synced,
        isDeleted
      )
      VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?
      )
      ON CONFLICT(_id) DO UPDATE SET
        payrollResultId = excluded.payrollResultId,
        employeeId = excluded.employeeId,
        componentId = excluded.componentId,
        name = excluded.name,
        displayName = excluded.displayName,
        type = excluded.type,
        amount = excluded.amount,
        createdAt = excluded.createdAt,
        updatedAt = excluded.updatedAt,
        synced = 1,
        isDeleted = excluded.isDeleted
    `,
    [
      payrollItem._id,
      payrollItem.payrollResultId,
      payrollItem.employeeId,
      payrollItem.componentId,
      payrollItem.name,
      payrollItem.displayName ?? null,
      payrollItem.type,
      payrollItem.amount,
      payrollItem.createdAt,
      payrollItem.updatedAt,
      payrollItem.isDeleted ?? 0,
    ]
  );

  return true;
}

//Update payroll status
export async function updatePayrollStatus(
  payrollRunId: string,
  status: PayrollStatus
) {
  const now = new Date().toISOString();

  // Get all payroll results belonging to this payroll run
  const results = await all<{ _id: string }>(
    `
      SELECT _id
      FROM payroll_results
      WHERE payrollRunId = ?
    `,
    [payrollRunId]
  );

  const resultIds = results.map((result) => result._id);

  // Update payroll run
  await run(
    `
      UPDATE payroll_runs
      SET
        status = ?,
        updatedAt = ?,
        synced = 0
      WHERE _id = ?
    `,
    [status, now, payrollRunId]
  );

  // Update all payroll results
  if (resultIds.length > 0) {
    const placeholders = resultIds.map(() => "?").join(", ");

    await run(
      `
        UPDATE payroll_results
        SET
          status = ?,
          updatedAt = ?,
          synced = 0
        WHERE _id IN (${placeholders})
      `,
      [status, now, ...resultIds]
    );
  }

  // Queue payroll run
  await addToSyncQueue({
    entity: "payroll_run",
    entityId: payrollRunId,
    operation: "update",
    payload: JSON.stringify({
      _id: payrollRunId,
      status,
      updatedAt: now,
    }),
  });

  // Queue payroll results
  for (const result of results) {
    await addToSyncQueue({
      entity: "payroll_result",
      entityId: result._id,
      operation: "update",
      payload: JSON.stringify({
        _id: result._id,
        payrollRunId,
        status,
        updatedAt: now,
      }),
    });
  }

  return true;
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

  // Transaction
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
      status: "ANNULÉ",
      cancelledBy: admin._id,
      cancelledAt: now,
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
        cancelledAt: now,
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
        payrollRunId,
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
        payrollRunId,
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
        payrollRunId,
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
  return get<PayrollResult>(
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
  return await get<PayrollResult>(
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

export async function markPayrollRunSynced(_id: string) {
  return await run(
    `
      UPDATE payroll_runs
      SET 
        synced = 1,
        lastSyncedAt = ?
      WHERE _id = ?
    `,
    [new Date().toISOString(), _id]
  );
}

export async function markPayrollResultSynced(_id: string) {
  return await run(
    `
      UPDATE payroll_results
      SET 
        synced = 1,
        lastSyncedAt = ?
      WHERE _id = ?
    `,
    [new Date().toISOString(), _id]
  );
}

export async function markPayrollItemSynced(_id: string) {
  return await run(
    `
      UPDATE payroll_items
        SET 
        synced = 1,
        lastSyncedAt = ?
      WHERE _id = ?
    `,
    [new Date().toISOString(), _id]
  );
}

// Delete payroll run
export async function deletePayrollRun(payrollRunId: string) {
  const updatedAt = new Date().toISOString();

  // Get all payroll result IDs belonging to this payroll run
  const results = await all<{ _id: string }>(
    `
      SELECT _id
      FROM payroll_results
      WHERE payrollRunId = ?
    `,
    [payrollRunId]
  );

  const resultIds = results.map((result) => result._id);

  // Get all payroll item IDs belonging to those payroll results
  let items: { _id: string }[] = [];

  if (resultIds.length > 0) {
    const placeholders = resultIds.map(() => "?").join(", ");

    items = await all<{ _id: string }>(
      `
        SELECT _id
        FROM payroll_items
        WHERE payrollResultId IN (${placeholders})
      `,
      resultIds
    );
  }

  await transaction(async () => {
    // Delete payroll items
    if (resultIds.length > 0) {
      const placeholders = resultIds.map(() => "?").join(", ");

      await runDirect(
        `
          DELETE FROM payroll_items
          WHERE payrollResultId IN (${placeholders})
        `,
        resultIds
      );
    }

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
        isDeleted: 1,
        updatedAt,
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
        isDeleted: 1,
        updatedAt,
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
      isDeleted: 1,
      updatedAt,
    }),
  });

  return true;
}
