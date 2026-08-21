import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Switch,
  Button,
  Stack,
} from "@chakra-ui/react";

export default function PayrollComponentForm() {
  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>Component Name</FormLabel>

        <Input placeholder="Transport Allowance" />
      </FormControl>

      <FormControl>
        <FormLabel>Calculation Type</FormLabel>

        <Select>
          <option value="FIXED">Fixed Amount</option>

          <option value="PERCENTAGE">Percentage</option>

          <option value="MANUAL">Manual Entry</option>
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>Default Value</FormLabel>

        <Input type="number" />
      </FormControl>

      <FormControl display="flex">
        <FormLabel>Active</FormLabel>

        <Switch defaultChecked />
      </FormControl>

      <Button colorScheme="yellow">Save Component</Button>
    </Stack>
  );
}
