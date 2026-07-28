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
import { Editable, EditableInput, EditablePreview } from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import PayrollComponent from "../../../shared/types/payroll/PayrollComponent";
import AddPayrollComponentModal from "../../components/AddPayrollComponentModal";
import { FaDeleteLeft } from "react-icons/fa6";

interface Props {
  type: "EARNING" | "DEDUCTION";
}

export default function PayrollComponentList({ type }: Props) {
  const toast = useToast();
  const [components, setComponents] = useState<PayrollComponent[]>([]);
  const [originalComponents, setOriginalComponents] = useState<
    PayrollComponent[]
  >([]);

  useEffect(() => {
    loadComponents();
  }, [type]);

  const loadComponents = async () => {
    try {
      const data = await window.electron.payrollComponents.getEnabled(type);

      setComponents(structuredClone(data));
      setOriginalComponents(structuredClone(data));
    } catch (error) {
      console.error(error);
    }
  };

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
    try {
      const modifiedComponents = components.filter((component) => {
        const original = originalComponents.find(
          (o) => o._id === component._id
        );

        if (!original) return true;

        return (
          original.displayName !== component.displayName ||
          original.displayOrder !== component.displayOrder ||
          original.enabled !== component.enabled ||
          original.calculationType !== component.calculationType ||
          original.defaultValue !== component.defaultValue
        );
      });

      if (modifiedComponents.length === 0) {
        toast({
          title: "Aucune modification.",
          status: "info",
        });

        return;
      }

      await window.electron.payrollComponents.update(modifiedComponents);

      toast({
        title: "Paramètres sauvegardés.",
        status: "success",
      });

      loadComponents();
    } catch (error) {
      console.error("AN ERROR OCCURED WHILE SAVING CHANGES", error);

      toast({
        title: "Erreur lors de la sauvegarde.",
        status: "error",
      });
    }
  };

  const handleDelete = async (_id: string) => {
    try {
      await window.electron.payrollComponents.delete(_id);
      await loadComponents();
    } catch (error) {
      console.error("AN ERROR OCCURED WHILE DELETING COMPONENT:", error);
    }
  };

  return (
    <Box>
      <Flex justify="space-between" mb={3}>
        <Text fontWeight="bold" fontSize="xl">
          {type === "EARNING" ? "Rémunérations" : "Déductions"}
        </Text>

        <Flex gap={3}>
          <AddPayrollComponentModal type={type} onCreated={loadComponents} />
          <Button colorScheme="yellow" onClick={save}>
            Enregistrer
          </Button>
        </Flex>
      </Flex>

      <Stack spacing={1} height="65vh" overflowY="auto">
        {components.map((item) => (
          <Flex
            position="relative"
            key={item._id}
            justify="space-between"
            p={2}
            borderWidth="1px"
            borderRadius="lg"
          >
            <Box>
              <Checkbox
                isChecked={item.enabled === 1 ? true : false}
                onChange={() => toggleComponent(item._id)}
              />
              <Box ml="3rem" mb="2rem">
                <Flex align="center" gap={3}>
                  <Editable
                    value={String(item.displayOrder)}
                    onChange={(value) => {
                      const displayOrder = Number(value);

                      if (Number.isNaN(displayOrder)) return;

                      setComponents((prev) =>
                        prev.map((component) =>
                          component._id === item._id
                            ? {
                                ...component,
                                displayOrder,
                              }
                            : component
                        )
                      );
                    }}
                  >
                    <EditablePreview
                      px={2}
                      py={1}
                      minW="40px"
                      textAlign="center"
                      borderRadius="md"
                      borderWidth="1px"
                      fontWeight="bold"
                      cursor="pointer"
                      _hover={{ bg: "gray.100" }}
                    />
                    <EditableInput
                      type="number"
                      textAlign="center"
                      width="40px"
                      px={2}
                    />
                  </Editable>

                  <Input
                    flex={1}
                    value={item.displayName}
                    fontWeight="bold"
                    variant="flushed"
                    onChange={(e) =>
                      setComponents((prev) =>
                        prev.map((component) =>
                          component._id === item._id
                            ? {
                                ...component,
                                displayName: e.target.value,
                              }
                            : component
                        )
                      )
                    }
                  />
                </Flex>
                <Select
                  size="sm"
                  mt={2}
                  value={item.calculationType}
                  onChange={(e) =>
                    setComponents((prev) =>
                      prev.map((component) =>
                        component._id === item._id
                          ? {
                              ...component,
                              calculationType: e.target.value as any,
                              defaultValue:
                                e.target.value === "MANUEL"
                                  ? null
                                  : component.defaultValue,
                            }
                          : component
                      )
                    )
                  }
                >
                  <option value="FIXE">Montant fixe</option>
                  <option value="MANUEL">Manuel</option>
                  <option value="POURCENTAGE">Pourcentage</option>
                </Select>
              </Box>
              {item.calculationType === "POURCENTAGE" ||
              item.calculationType === "FIXE" ? (
                <Box>
                  <Text fontSize="xs" color="gray.500">
                    {item.calculationType === "POURCENTAGE"
                      ? "Pourcentage"
                      : "Montant"}
                  </Text>
                  <Input
                    size="sm"
                    type="number"
                    value={item.defaultValue ?? ""}
                    onChange={(e) =>
                      setComponents((prev) =>
                        prev.map((component) =>
                          component._id === item._id
                            ? {
                                ...component,
                                defaultValue:
                                  e.target.value === ""
                                    ? null
                                    : Number(e.target.value),
                              }
                            : component
                        )
                      )
                    }
                  />
                </Box>
              ) : null}
            </Box>
            <Box>
              <Box
                position="absolute"
                top="0.1rem"
                right="0.4rem"
                onClick={() => handleDelete(item._id)}
              >
                <FaDeleteLeft />
              </Box>
              <Badge mt="3rem" colorScheme={item.enabled ? "green" : "gray"}>
                {item.enabled ? "Activé" : "Désactivé"}
              </Badge>
            </Box>
          </Flex>
        ))}
      </Stack>
    </Box>
  );
}
