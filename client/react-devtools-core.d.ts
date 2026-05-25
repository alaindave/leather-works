// react-devtools-core.d.ts
declare module "react-devtools-core" {
  export function connectToDevTools(config?: {
    host?: string;
    port?: number;
    useHttps?: boolean;
    isInsideApp?: boolean;
    resolveRNStyle?: (style: any) => any;
  }): void;
}
