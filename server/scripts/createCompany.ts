import "dotenv/config";

import readline from "readline";
import mongoose from "mongoose";
import { createCompany } from "../services/companies.service.js";
import { connectDatabase } from "../utils/databaseConnection.js";

function askQuestion(
  rl: readline.Interface,
  question: string
): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    console.log("");
    console.log("=================================");
    console.log("       AKILI SETUP");
    console.log("       Create New Company");
    console.log("=================================");
    console.log("");

    const companyName = await askQuestion(rl, "Company name: ");

    const adminFirstName = await askQuestion(rl, "Admin first name: ");

    const adminLastName = await askQuestion(rl, "Admin last name: ");

    const adminEmail = await askQuestion(rl, "Admin email: ");

    const adminPassword = await askQuestion(rl, "Admin password: ");

    if (
      !companyName ||
      !adminFirstName ||
      !adminLastName ||
      !adminEmail ||
      !adminPassword
    ) {
      throw new Error("All fields are required.");
    }

    console.log("");
    await connectDatabase();

    console.log("Creating company...");

    console.log("Creating company...");

    const result = await createCompany({
      companyName,
      adminFirstName,
      adminLastName,
      adminEmail,
      adminPassword,
    });

    console.log("");
    console.log("=================================");
    console.log("      Company created!");
    console.log("=================================");
    console.log("");

    console.log(`Company: ${result.company.name}`);

    console.log(`Company ID: ${result.company._id}`);

    console.log(`Admin: ${result.adminUser.email}`);

    console.log(`Admin ID: ${result.adminUser._id}`);

    console.log(`Roles created: ${result.roles.length}`);

    console.log("");
  } catch (error) {
    console.error("");
    console.error("Failed to create company:");
    console.error(error);
    console.error("");
    process.exitCode = 1;
  } finally {
    rl.close();

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

main();
