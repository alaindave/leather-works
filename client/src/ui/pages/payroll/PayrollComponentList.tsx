import {
  Box,
  Button,
  Checkbox,
  Flex,
  Stack,
  Text,
  Badge,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import PayrollComponent from "../../../shared/types/payroll/PayrollComponent";

interface Props {
  type: "EARNING" | "DEDUCTION";
}

export default function PayrollComponentList({ type }: Props) {
  const toast = useToast();

  const [components, setComponents] = useState<PayrollComponent[]>([]);

  useEffect(() => {
    loadComponents();
  }, [type]);

  async function loadComponents() {
    try {
      const data = await window.electron.payrollComponents.getEnabled(type);
      console.log("PAYROLL COMPONENTS FETCHED", data);
      setComponents(data);
    } catch (error) {
      console.error(
        "AN ERROR OCCURED WHILE FETCHING PAYROLL COMPONENTS",
        error
      );
    }
  }

  const toggleComponent = (_id: string) => {
    setComponents((prev) =>
      prev.map((item) =>
        item._id === _id
          ? {
              ...item,
              enabled: item.enabled === 1 ? 0 : 1,
            }
          : item
      )
    );
  };

  const save = async () => {
    await window.electron.payrollComponents.create(components);

    toast({
      title: "Parametres sauvegardes.",
      status: "success",
    });
  };

  return (
    <Box>
      <Flex justify="space-between" mb={5}>
        <Text fontWeight="bold" fontSize="xl">
          {type === "EARNING" ? "Rémunérations" : "Déductions"}
        </Text>

        <Button colorScheme="yellow" onClick={save}>
          Enregistrer
        </Button>
      </Flex>

      <Stack spacing={1} height="65vh" overflowY="auto">
        {components.map((item) => (
          <Flex
            key={item._id}
            justify="space-between"
            align="center"
            p={2}
            borderWidth="1px"
            borderRadius="lg"
          >
            <Checkbox
              isChecked={item.enabled === 1 ? true : false}
              onChange={() => toggleComponent(item._id)}
            >
              <Box ml={2}>
                <Text fontWeight="bold">{item.displayName}</Text>

                <Text fontSize="sm" color="gray.500">
                  {item.calculationType}
                </Text>
              </Box>
            </Checkbox>

            <Badge colorScheme={item.enabled ? "green" : "gray"}>
              {item.enabled ? "Activé" : "Désactivé"}
            </Badge>
          </Flex>
        ))}
      </Stack>
    </Box>
  );
}
