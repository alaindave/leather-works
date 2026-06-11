declare module "os-utils" {
  export function cpuUsage(callback: (v: number) => void): void;
  export function freemem(): number;
  export function freememPercentage(): number;
  export function totalmem(): number;
}
