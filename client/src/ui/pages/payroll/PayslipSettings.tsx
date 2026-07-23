import { Box, Stack, FormControl, FormLabel, Switch } from "@chakra-ui/react";

export default function PayslipSettings() {
  const options = [
    "Logo",
    "Addresse",
    "Numero d'employé",
    "Departement",
    "Poste",
    "Signature",
    "Notes",
  ];

  return (
    <Box>
      <Stack spacing={4}>
        {options.map((option) => (
          <FormControl
            key={option}
            display="flex"
            justifyContent="space-between"
          >
            <FormLabel>{option}</FormLabel>

            <Switch />
          </FormControl>
        ))}
      </Stack>
    </Box>
  );
}
