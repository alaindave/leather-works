export type EmployeeDocumentType = "EMPLOYMENT_CONTRACT" | "NATIONAL_ID";

export interface EmployeeDocument {
  _id: string;
  employeeId: string;
  uploadedBy: string;
  documentType: EmployeeDocumentType;
  originalName: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  localPath: string;
  hash: string;
  version: number;
  needsUpload: number;
  isDeleted: number;
  createdAt: string;
  updatedAt: string;
}

export interface UploadedEmployeeDocument {
  employeeId: string;
  uploadedBy: string;
  documentType: EmployeeDocumentType;
  name: string;
  mimeType: string;
  buffer: Uint8Array;
}
