import { Tooltip } from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props {
  label: string;
  children: ReactNode;
}

export function AppTooltip({ label, children }: Props) {
  return <Tooltip label={label}>{children}</Tooltip>;
}
