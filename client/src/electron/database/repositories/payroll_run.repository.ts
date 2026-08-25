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

// ============================================================
// CREATE PAYROLL RUN
// ============================================================

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

    // Server assigns the real version after sync.
    serverVersion: 0,

    synced: 0,
    createdAt: now,
    updatedAt: now,
    isDeleted: 0,
  };

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
      serverVersion,
      synced,
      createdAt,
      updatedAt,
      isDeleted
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      payrollRun.serverVersion,
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

// ============================================================
// GET PAYROLL RUNS
// ============================================================

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

// ============================================================
// GET PAYROLL RUN BY ID
// ============================================================

export async function getPayrollRunById(_id: string) {
  return await get<PayrollRun>(
    `
    SELECT
      pr.*,
      gen.firstName || ' ' || gen.lastName AS generatedByName,
      can.firstName || ' ' || can.lastName AS cancelledByName,
      ver.firstName || ' ' || ver.lastName AS submittedForVerificationByName,
      app.firstName || ' ' || app.lastName AS approvedByName,
      paid.firstName || ' ' || paid.lastName AS paidByName
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
    WHERE pr._id = ?
    `,
    [_id]
  );
}

// ============================================================
// GET PAYROLL RUN BY STATUS
// ============================================================

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

// ============================================================
// UPSERT PAYROLL RUN FROM SERVER
// ============================================================

export async function upsertPayrollRun(payrollRun: PayrollRun) {
  console.log("PAYROLL RUN TO UPSERT", payrollRun);

  // ----------------------------------------------------------
  // 1. Look for the canonical ID
  // ----------------------------------------------------------

  const existingById = await get<
    PayrollRun & {
      synced: number;
      serverVersion: number;
    }
  >(
    `
    SELECT *
    FROM payroll_runs
    WHERE _id = ?
    LIMIT 1
    `,
    [payrollRun._id]
  );

  if (existingById) {
    /*
     * IMPORTANT:
     *
     * A local record with synced = 0 contains changes that have
     * not yet reached the server.
     *
     * Do not allow a pull to overwrite those changes.
     */
    if (existingById.synced === 0) {
      console.log(
        `SKIPPING PAYROLL RUN PULL. LOCAL CHANGES ARE PENDING: ${payrollRun._id}`
      );

      return existingById;
    }

    /*
     * ServerVersion is now the source of truth for sync ordering.
     *
     * If the incoming version is older or equal, there is nothing
     * to apply.
     */
    if (
      payrollRun.serverVersion &&
      payrollRun.serverVersion <= (existingById.serverVersion ?? 0)
    ) {
      console.log(
        `SKIPPING PAYROLL RUN PULL. LOCAL SERVER VERSION IS NEWER/EQUAL: ${payrollRun._id}`,
        {
          local: existingById.serverVersion,
          remote: payrollRun.serverVersion,
        }
      );

      return existingById;
    }

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
        serverVersion = ?,
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
        payrollRun.serverVersion,
        payrollRun.createdAt,
        payrollRun.updatedAt,
        payrollRun.isDeleted ?? 0,
        payrollRun._id,
      ]
    );

    return true;
  }

  // ----------------------------------------------------------
  // 2. No ID match.
  //    Check the natural payroll period.
  // ----------------------------------------------------------

  const existingByPeriod = await get<
    PayrollRun & {
      synced: number;
      serverVersion: number;
    }
  >(
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

    /*
     * If this local record has pending changes, don't replace it.
     */
    if (existingByPeriod.synced === 0) {
      console.log(
        `SKIPPING PAYROLL RUN PERIOD CONFLICT. LOCAL CHANGES ARE PENDING: ${existingByPeriod._id}`
      );

      return existingByPeriod;
    }

    /*
     * Only replace the local period record when the server
     * has a newer version.
     */
    if (
      payrollRun.serverVersion &&
      payrollRun.serverVersion <= (existingByPeriod.serverVersion ?? 0)
    ) {
      console.log(
        `SKIPPING PAYROLL RUN PERIOD CONFLICT. LOCAL SERVER VERSION IS NEWER/EQUAL`
      );

      return existingByPeriod;
    }

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
        serverVersion = ?,
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
        payrollRun.serverVersion,
        payrollRun.createdAt,
        payrollRun.updatedAt,
        payrollRun.isDeleted ?? 0,
        existingByPeriod._id,
      ]
    );

    return true;
  }

  // ----------------------------------------------------------
  // 3. No local record exists.
  // ----------------------------------------------------------

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
      serverVersion,
      synced,
      createdAt,
      updatedAt,
      isDeleted
    )
    VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, 1, ?, ?, ?
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
      payrollRun.serverVersion,
      payrollRun.createdAt,
      payrollRun.updatedAt,
      payrollRun.isDeleted ?? 0,
    ]
  );

  return true;
}

// ============================================================
// UPSERT PAYROLL RESULT FROM SERVER
// ============================================================

export async function upsertPayrollResult(payrollResult: PayrollResult) {
  console.log("PAYROLL RESULT TO UPSERT", payrollResult);

  const existingById = await get<
    PayrollResult & {
      synced: number;
      serverVersion: number;
    }
  >(
    `
    SELECT *
    FROM payroll_results
    WHERE _id = ?
    LIMIT 1
    `,
    [payrollResult._id]
  );

  if (existingById) {
    // Never overwrite pending local changes.
    if (existingById.synced === 0) {
      console.log(
        `SKIPPING PAYROLL RESULT PULL. LOCAL CHANGES ARE PENDING: ${payrollResult._id}`
      );

      return existingById;
    }

    // ServerVersion is the conflict-resolution mechanism.
    if (
      payrollResult.serverVersion &&
      payrollResult.serverVersion <= (existingById.serverVersion ?? 0)
    ) {
      console.log(
        `SKIPPING PAYROLL RESULT PULL. LOCAL SERVER VERSION IS NEWER/EQUAL: ${payrollResult._id}`,
        {
          local: existingById.serverVersion,
          remote: payrollResult.serverVersion,
        }
      );

      return existingById;
    }

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
        serverVersion = ?,
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
        payrollResult.serverVersion,
        payrollResult.createdAt,
        payrollResult.updatedAt,
        payrollResult.isDeleted ?? 0,
        payrollResult._id,
      ]
    );

    return true;
  }

  // ----------------------------------------------------------
  // Check natural employee/month/year key
  // ----------------------------------------------------------

  const existingByPeriod = await get<
    PayrollResult & {
      synced: number;
      serverVersion: number;
    }
  >(
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

    if (existingByPeriod.synced === 0) {
      console.log(
        `SKIPPING PAYROLL RESULT PERIOD CONFLICT. LOCAL CHANGES ARE PENDING: ${existingByPeriod._id}`
      );

      return existingByPeriod;
    }

    if (
      payrollResult.serverVersion &&
      payrollResult.serverVersion <= (existingByPeriod.serverVersion ?? 0)
    ) {
      console.log(
        `SKIPPING PAYROLL RESULT PERIOD CONFLICT. LOCAL SERVER VERSION IS NEWER/EQUAL`
      );

      return existingByPeriod;
    }

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
        serverVersion = ?,
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
        payrollResult.serverVersion,
        payrollResult.createdAt,
        payrollResult.updatedAt,
        payrollResult.isDeleted ?? 0,
        existingByPeriod._id,
      ]
    );

    return true;
  }

  // ----------------------------------------------------------
  // Insert server payroll result
  // ----------------------------------------------------------

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
      serverVersion,
      createdAt,
      updatedAt,
      synced,
      isDeleted
    )
    VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, 1, ?
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
      payrollResult.serverVersion,
      payrollResult.createdAt,
      payrollResult.updatedAt,
      payrollResult.isDeleted ?? 0,
    ]
  );

  return true;
}

// ============================================================
// UPSERT PAYROLL ITEM FROM SERVER
// ============================================================

export async function upsertPayrollItem(payrollItem: PayrollItem) {
  const existing = await get<
    PayrollItem & {
      synced: number;
      serverVersion: number;
    }
  >(
    `
    SELECT *
    FROM payroll_items
    WHERE _id = ?
    LIMIT 1
    `,
    [payrollItem._id]
  );

  if (existing) {
    // Don't overwrite pending local changes.
    if (existing.synced === 0) {
      console.log(
        `SKIPPING PAYROLL ITEM PULL. LOCAL CHANGES ARE PENDING: ${payrollItem._id}`
      );

      return existing;
    }

    // Ignore old/equal server versions.
    if (
      payrollItem.serverVersion &&
      payrollItem.serverVersion <= (existing.serverVersion ?? 0)
    ) {
      console.log(
        `SKIPPING PAYROLL ITEM PULL. LOCAL SERVER VERSION IS NEWER/EQUAL: ${payrollItem._id}`
      );

      return existing;
    }
  }

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
      serverVersion,
      createdAt,
      updatedAt,
      synced,
      isDeleted
    )
    VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, 1, ?
    )
    ON CONFLICT(_id)
    DO UPDATE SET
      payrollResultId = excluded.payrollResultId,
      employeeId = excluded.employeeId,
      componentId = excluded.componentId,
      name = excluded.name,
      displayName = excluded.displayName,
      type = excluded.type,
      amount = excluded.amount,
      serverVersion = excluded.serverVersion,
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
      payrollItem.serverVersion,
      payrollItem.createdAt,
      payrollItem.updatedAt,
      payrollItem.isDeleted ?? 0,
    ]
  );

  return true;
}

// ============================================================
// UPDATE PAYROLL STATUS
// ============================================================

export async function updatePayrollStatus(
  payrollRunId: string,
  status: PayrollStatus
) {
  const now = new Date().toISOString();

  const results = await all<{ _id: string }>(
    `
    SELECT _id
    FROM payroll_results
    WHERE payrollRunId = ?
    `,
    [payrollRunId]
  );

  // Update payroll run.
  //
  // IMPORTANT:
  // We do NOT change serverVersion locally.
  // The server assigns the next version when it processes
  // this sync operation.
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

  // Update all payroll results.
  if (results.length > 0) {
    const resultIds = results.map((result) => result._id);
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

// ============================================================
// CANCEL PAYROLL RUN
// ============================================================

export async function cancelPayrollRun(payrollRunId: string, admin: AdminUser) {
  const now = new Date().toISOString();

  const results = await all<{ _id: string }>(
    `
    SELECT _id
    FROM payroll_results
    WHERE payrollRunId = ?
    `,
    [payrollRunId]
  );

  await transaction(async () => {
    await runDirect(
      `
      UPDATE payroll_runs
      SET
        status = ?,
        cancelledBy = ?,
        cancelledAt = ?,
        updatedAt = ?,
        synced = 0
      WHERE _id = ?
      `,
      ["ANNULÉ", admin._id, now, now, payrollRunId]
    );

    await runDirect(
      `
      UPDATE payroll_results
      SET
        status = ?,
        cancelledAt = ?,
        updatedAt = ?,
        synced = 0
      WHERE payrollRunId = ?
      `,
      ["ANNULÉ", now, now, payrollRunId]
    );

    return true;
  });

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

  for (const result of results) {
    await addToSyncQueue({
      entity: "payroll_result",
      entityId: result._id,
      operation: "update",
      payload: JSON.stringify({
        _id: result._id,
        payrollRunId,
        status: "ANNULÉ",
        cancelledAt: now,
        updatedAt: now,
      }),
    });
  }

  return true;
}

// ============================================================
// VERIFY PAYROLL RUN
// ============================================================

export async function verifyPayrollRun(payrollRunId: string, admin: AdminUser) {
  const now = new Date().toISOString();

  const results = await all<{ _id: string }>(
    `
    SELECT _id
    FROM payroll_results
    WHERE payrollRunId = ?
    `,
    [payrollRunId]
  );

  await transaction(async () => {
    await runDirect(
      `
      UPDATE payroll_runs
      SET
        status = ?,
        submittedForVerificationBy = ?,
        submittedForVerificationAt = ?,
        updatedAt = ?,
        synced = 0
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
        updatedAt = ?,
        synced = 0
      WHERE payrollRunId = ?
      `,
      ["VERIFICATION", now, now, payrollRunId]
    );
  });

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

// ============================================================
// APPROVE PAYROLL RUN
// ============================================================

export async function approvePayrollRun(
  payrollRunId: string,
  admin: AdminUser
) {
  const now = new Date().toISOString();

  const results = await all<{ _id: string }>(
    `
    SELECT _id
    FROM payroll_results
    WHERE payrollRunId = ?
    `,
    [payrollRunId]
  );

  await transaction(async () => {
    await runDirect(
      `
      UPDATE payroll_runs
      SET
        status = ?,
        approvedBy = ?,
        approvedAt = ?,
        updatedAt = ?,
        synced = 0
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
        updatedAt = ?,
        synced = 0
      WHERE payrollRunId = ?
      `,
      ["APPROUVÉ", now, now, payrollRunId]
    );
  });

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

// ============================================================
// PAYMENT PAYROLL RUN
// ============================================================

export async function paymentPayrollRun(
  payrollRunId: string,
  admin: AdminUser
) {
  const now = new Date().toISOString();

  const results = await all<{ _id: string }>(
    `
    SELECT _id
    FROM payroll_results
    WHERE payrollRunId = ?
    `,
    [payrollRunId]
  );

  await transaction(async () => {
    await runDirect(
      `
      UPDATE payroll_runs
      SET
        status = ?,
        paidBy = ?,
        paidAt = ?,
        updatedAt = ?,
        synced = 0
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
        updatedAt = ?,
        synced = 0
      WHERE payrollRunId = ?
      `,
      ["PAYÉ", now, now, payrollRunId]
    );
  });

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

// ============================================================
// SAVE PAYROLL RESULT
// ============================================================

export async function savePayrollResult(
  payrollRunId: string,
  result: PayrollResult
) {
  const date = new Date();
  const now = date.toISOString();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const payrollResultId = randomUUID();

  const items = [...result.earnings, ...result.deductions].map((item) => ({
    _id: randomUUID(),
    payrollResultId,
    employeeId: result.employeeId,
    componentId: item.componentId,
    name: item.name,
    displayName: item.displayName,
    type: item.type,
    amount: item.amount,

    // Server assigns the actual version.
    serverVersion: 0,

    createdAt: now,
    updatedAt: now,
  }));

  await transaction(async () => {
    // --------------------------------------------------------
    // Payroll result
    // --------------------------------------------------------

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
        serverVersion,
        createdAt,
        updatedAt,
        synced,
        isDeleted
      )
      VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, 0, 0
      )
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
        0,
        now,
        now,
      ]
    );

    // --------------------------------------------------------
    // Payroll items
    // --------------------------------------------------------

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
          serverVersion,
          createdAt,
          updatedAt,
          synced,
          isDeleted
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)
        `,
        [
          item._id,
          item.payrollResultId,
          item.employeeId,
          item.componentId,
          item.name,
          item.displayName ?? null,
          item.type,
          item.amount,
          0,
          item.createdAt,
          item.updatedAt,
        ]
      );
    }
  });

  // ----------------------------------------------------------
  // Queue payroll result
  // ----------------------------------------------------------

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
      serverVersion: 0,
      createdAt: now,
      updatedAt: now,
      isDeleted: 0,
    }),
  });

  // ----------------------------------------------------------
  // Queue payroll items
  // ----------------------------------------------------------

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

// ============================================================
// BULK SAVE PAYROLL RESULTS
// ============================================================

export async function savePayrollResults(
  payrollRunId: string,
  results: PayrollResult[]
) {
  for (const result of results) {
    await savePayrollResult(payrollRunId, result);
  }
}

// ============================================================
// GET PAYROLL RESULTS
// ============================================================

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

// ============================================================
// GET EMPLOYEE PAYROLL RESULTS
// ============================================================

export async function getEmployeePayrollResults(
  employeeId: string,
  payrollRunId?: string
) {
  return get<PayrollResult>(
    `
    SELECT *
    FROM payroll_results
    WHERE payrollRunId = ?
      AND employeeId = ?
    `,
    [payrollRunId, employeeId]
  );
}

// ============================================================
// GET EMPLOYEE PAYROLL RESULT BY MONTH/YEAR
// ============================================================

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

// ============================================================
// GET PAYROLL ITEMS
// ============================================================

export async function getPayrollItems(
  payrollResultId: string,
  employeeId?: string
) {
  if (employeeId) {
    return await all<PayrollItem[]>(
      `
      SELECT *
      FROM payroll_items
      WHERE payrollResultId = ?
        AND employeeId = ?
      ORDER BY createdAt ASC
      `,
      [payrollResultId, employeeId]
    );
  }

  return await all<PayrollItem[]>(
    `
    SELECT *
    FROM payroll_items
    WHERE payrollResultId = ?
    ORDER BY createdAt ASC
    `,
    [payrollResultId]
  );
}

// ============================================================
// MARK PAYROLL RUN SYNCED
// ============================================================

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

// ============================================================
// MARK PAYROLL RESULT SYNCED
// ============================================================

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

// ============================================================
// MARK PAYROLL ITEM SYNCED
// ============================================================

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

// ============================================================
// DELETE PAYROLL RUN
// ============================================================

export async function deletePayrollRun(payrollRunId: string) {
  const updatedAt = new Date().toISOString();

  // ----------------------------------------------------------
  // Get payroll results
  // ----------------------------------------------------------

  const results = await all<{ _id: string }>(
    `
    SELECT _id
    FROM payroll_results
    WHERE payrollRunId = ?
    `,
    [payrollRunId]
  );

  const resultIds = results.map((result) => result._id);

  // ----------------------------------------------------------
  // Get payroll items
  // ----------------------------------------------------------

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

  // ----------------------------------------------------------
  // Delete locally
  // ----------------------------------------------------------

  await transaction(async () => {
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

    await runDirect(
      `
      DELETE FROM payroll_results
      WHERE payrollRunId = ?
      `,
      [payrollRunId]
    );

    await runDirect(
      `
      DELETE FROM payroll_runs
      WHERE _id = ?
      `,
      [payrollRunId]
    );
  });

  // ----------------------------------------------------------
  // Queue payroll items
  // ----------------------------------------------------------

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

  // ----------------------------------------------------------
  // Queue payroll results
  // ----------------------------------------------------------

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

  // ----------------------------------------------------------
  // Queue payroll run
  // ----------------------------------------------------------

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
