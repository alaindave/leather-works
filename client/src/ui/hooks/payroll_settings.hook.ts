import { useEffect, useState } from "react";
import PayrollSettings from "../../common/types/payroll/PayrollSettings";

export function usePayrollSettings() {
  const [settings, setSettings] = useState<PayrollSettings | null>(null);

  useEffect(() => {
    loadPayrollSettings();
  }, []);

  const loadPayrollSettings = async () => {
    try {
      const result = await window.electron.payrollSettings.get();
      setSettings(result);
    } catch (error) {
      console.error("FAILED TO LOAD PAYROLL SETTINGS:", error);
    }
  };

  return settings;
}
