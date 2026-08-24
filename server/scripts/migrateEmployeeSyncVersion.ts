import Employee from "../models/employee.model.js";
import SyncCounter from "../models/syncCounter.model.js";

export default async function migrateEmployeeSyncVersions() {
  console.log("STARTING EMPLOYEE SYNC MIGRATION...");

  const existingCounter = await SyncCounter.findOne({
    _id: "employee",
  }).lean();

  const highestVersionEmployee = await Employee.findOne()
    .sort({
      serverVersion: -1,
    })
    .select("serverVersion")
    .lean();

  const currentCounter = Number(existingCounter?.value ?? 0);

  const highestExistingVersion = Number(
    highestVersionEmployee?.serverVersion ?? 0
  );

  let nextVersion = Math.max(currentCounter, highestExistingVersion) + 1;

  const employees = await Employee.find({
    $or: [
      {
        serverVersion: {
          $exists: false,
        },
      },
      {
        serverVersion: 0,
      },
    ],
  })
    .sort({
      createdAt: 1,
      _id: 1,
    })
    .select("_id serverVersion");

  console.log(`EMPLOYEES REQUIRING MIGRATION: ${employees.length}`);

  /*
   * Assign versions.
   */
  for (const employee of employees) {
    await Employee.updateOne(
      {
        _id: employee._id,
      },
      {
        $set: {
          serverVersion: nextVersion,
        },
      }
    );

    console.log(`EMPLOYEE ${employee._id} -> VERSION ${nextVersion}`);

    nextVersion++;
  }

  const finalVersion =
    employees.length > 0
      ? nextVersion - 1
      : Math.max(currentCounter, highestExistingVersion);

  await SyncCounter.updateOne(
    {
      _id: "employee",
    },
    {
      $set: {
        value: finalVersion,
      },
    },
    {
      upsert: true,
    }
  );

  console.log(`EMPLOYEE SYNC COUNTER INITIALIZED TO ${finalVersion}`);

  const totalEmployees = await Employee.countDocuments();

  const employeesWithoutVersion = await Employee.countDocuments({
    $or: [
      {
        serverVersion: {
          $exists: false,
        },
      },
      {
        serverVersion: 0,
      },
    ],
  });

  const counter = await SyncCounter.findOne({
    _id: "employee",
  }).lean();

  const highestVersion = await Employee.findOne()
    .sort({
      serverVersion: -1,
    })
    .select("serverVersion")
    .lean();

  const actualHighestVersion = Number(highestVersion?.serverVersion ?? 0);

  const actualCounter = Number(counter?.value ?? 0);

  console.log("");
  console.log("==============================");
  console.log("EMPLOYEE SYNC MIGRATION RESULT");
  console.log("==============================");
  console.log("TOTAL EMPLOYEES:", totalEmployees);
  console.log("EMPLOYEES WITHOUT VERSION:", employeesWithoutVersion);
  console.log("HIGHEST EMPLOYEE VERSION:", actualHighestVersion);
  console.log("EMPLOYEE COUNTER:", actualCounter);
  console.log("==============================");
  console.log("");

  if (employeesWithoutVersion > 0) {
    throw new Error(
      `${employeesWithoutVersion} EMPLOYEES STILL HAVE NO SERVER VERSION`
    );
  }

  if (actualHighestVersion !== actualCounter) {
    throw new Error(
      `EMPLOYEE VERSION AND SYNC COUNTER DO NOT MATCH. ` +
        `HIGHEST VERSION: ${actualHighestVersion}, ` +
        `COUNTER: ${actualCounter}`
    );
  }

  console.log("EMPLOYEE SYNC VERSION MIGRATION COMPLETED SUCCESSFULLY.");
}
