import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Switch,
  Stack,
} from "@chakra-ui/react";

export default function PayrollDefaults() {
  return (
    <Box>
      <Stack spacing={5}>
        <FormControl>
          <FormLabel>Monnaie</FormLabel>

          <Select>
            <option>BIF</option>
            <option>RWF</option>
            <option>KSH</option>
            <option>USD</option>
            <option>EURO</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Jour de paie</FormLabel>

          <Input type="number" placeholder="30" />
        </FormControl>

        <FormControl>
          <FormLabel>Jours ouvrables par mois</FormLabel>

          <Input defaultValue={26} />
        </FormControl>

        <FormControl display="flex">
          <FormLabel>Générer fiches de paye automatiquement</FormLabel>

          <Switch defaultChecked />
        </FormControl>
      </Stack>
    </Box>
  );
}
