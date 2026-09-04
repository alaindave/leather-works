import "dotenv/config";

import { randomInt, randomUUID } from "crypto";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

import Company from "../models/company.model.js";
import Role from "../models/role.model.js";
import AdminUser from "../models/adminUser.model.js";
import { defaultRoles } from "../permissions/defaultRole.js";

interface CreateCompanyInput {
  companyName: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPassword: string;
}

interface CreateCompanyResult {
  company: any;
  adminUser: any;
  roles: any[];
}

function generateSignUpCode(): string {
  const numbers = randomInt(100000, 1000000);

  return `AKL-${numbers}`;
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  );
}

export async function createCompany(
  input: CreateCompanyInput
): Promise<CreateCompanyResult> {
  const maxAttempts = 5;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const session = await mongoose.startSession();

    try {
      let result: CreateCompanyResult | undefined;

      try {
        await session.withTransaction(async () => {
          const companyId = randomUUID();
          const now = new Date();
          const signUpCode = generateSignUpCode();
          // Create company
          const company = await Company.create(
            [
              {
                _id: companyId,
                name: input.companyName.trim(),
                signUpCode,
                createdAt: now,
                updatedAt: now,
                isDeleted: 0,
              },
            ],
            { session }
          );
          // Create role
          const roles = [];

          for (const defaultRole of defaultRoles) {
            const role = await Role.create(
              [
                {
                  _id: randomUUID(),
                  companyId,
                  name: defaultRole.name,
                  permissions: defaultRole.permissions,
                  createdAt: now,
                  updatedAt: now,
                  isDeleted: 0,
                },
              ],
              { session }
            );

            roles.push(role[0]);
          }

          const adminRole = roles.find((role) => role.name === "ADMIN");

          if (!adminRole) {
            throw new Error("Default ADMIN role was not created");
          }
          // Create admin user
          const passwordHash = await bcrypt.hash(input.adminPassword, 12);

          const adminUser = await AdminUser.create(
            [
              {
                _id: randomUUID(),
                companyId,
                firstName: input.adminFirstName.trim(),
                lastName: input.adminLastName.trim(),
                email: input.adminEmail.toLowerCase().trim(),
                passwordHash,
                roleId: adminRole._id,
                createdAt: now,
                updatedAt: now,
                serverVersion: 0,
                isDeleted: 0,
              },
            ],
            { session }
          );

          result = {
            company: company[0],
            adminUser: adminUser[0],
            roles,
          };
        });
      } catch (error) {
        if (isDuplicateKeyError(error) && attempt < maxAttempts) {
          console.warn(
            `Signup code collision detected. Retrying (${attempt}/${maxAttempts})...`
          );

          continue;
        }

        throw error;
      }

      if (!result) {
        throw new Error("Company creation failed");
      }

      console.log("COMPANY CREATED SUCCESSFULLY.");

      console.log("COMPANY SIGN UP CODE:", result.company.signUpCode);

      return result;
    } finally {
      await session.endSession();
    }
  }

  throw new Error(
    `Failed to generate a unique company signup code after ${maxAttempts} attempts`
  );
}
