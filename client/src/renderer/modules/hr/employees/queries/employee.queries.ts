export const employeeQueryKeys = {
  all: ["employees"] as const,

  list: (companyId: string) => ["employees", "list", { companyId }] as const,

  details: (companyId: string) =>
    ["employees", "detail", { companyId }] as const,

  detail: (companyId: string, employeeId: string) =>
    [
      "employees",
      "detail",
      {
        companyId,
        employeeId,
      },
    ] as const,
};
