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
import { Select } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AddPayrollEmployeeProfileModal from "../../components/AddPayrollEmployeeProfileModal";
import { FaDeleteLeft } from "react-icons/fa6";
import PayrollEmployeeProfile from "../../../shared/types/payroll/PayrollEmployeeProfile";

interface Props {
  type: "EARNING" | "DEDUCTION";
  employeeID: string;
}

export default function PayrollEmployeeProfileList({
  type,
  employeeID,
}: Props) {
  const toast = useToast();
  const [profiles, setProfiles] = useState<PayrollEmployeeProfile[]>([]);
  const [originalProfiles, setOriginalProfiles] = useState<
    PayrollEmployeeProfile[]
  >([]);

  useEffect(() => {
    loadProfiles();
  }, [type]);

  const loadProfiles = async () => {
    try {
      const data = await window.electron.payrollEmployeeProfiles.getAll(
        employeeID,
        type
      );
      console.log("FETCHED PAYROLL PROFILES", data);
      setProfiles(structuredClone(data));
      setOriginalProfiles(structuredClone(data));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleComponent = (_id: string) => {
    setProfiles((prev) =>
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
      const modifiedProfiles = profiles.filter((profile) => {
        const original = originalProfiles.find((o) => o._id === profile._id);

        if (!original) return true;

        return (
          original.displayName !== profile.displayName ||
          original.enabled !== profile.enabled ||
          original.calculationType !== profile.calculationType ||
          original.value !== profile.value
        );
      });

      if (modifiedProfiles.length === 0) {
        toast({
          title: "Aucune modification.",
          status: "info",
        });

        return;
      }

      await window.electron.payrollEmployeeProfiles.update(modifiedProfiles);

      toast({
        title: "Paramètres sauvegardés.",
        status: "success",
      });

      loadProfiles();
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
      await window.electron.payrollEmployeeProfiles.delete(_id);
      await loadProfiles();
    } catch (error) {
      console.error("AN ERROR OCCURED WHILE DELETING COMPONENT:", error);
    }
  };

  const reset = async () => {
    try {
      await window.electron.payrollEmployeeProfiles.resetToDefaults(employeeID);
      await loadProfiles();
    } catch (error) {
      console.error("AN ERROR OCCURED WHILE RESETTING COMPONENTS:", error);
    }
  };

  return (
    <Box>
      <Flex justify="space-between" mb={3}>
        <Text fontWeight="bold" fontSize="xl">
          {type === "EARNING" ? "Rémunérations" : "Déductions"}
        </Text>

        <Flex gap={3}>
          <AddPayrollEmployeeProfileModal
            employeeID={employeeID}
            type={type}
            onCreated={loadProfiles}
          />
          <Button colorScheme="yellow" onClick={save}>
            Enregistrer
          </Button>
          <Button colorScheme="green" onClick={reset}>
            Reinitialiser
          </Button>
        </Flex>
      </Flex>

      <Stack spacing={1} height="65vh" overflowY="auto">
        {profiles.map((item) => (
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
                onChange={() => toggleComponent(item._id!)}
              />
              <Box ml="3rem" mb="2rem">
                <Input
                  value={item.displayName}
                  fontWeight="bold"
                  variant="flushed"
                  onChange={(e) =>
                    setProfiles((prev) =>
                      prev.map((profile) =>
                        profile._id === item._id
                          ? {
                              ...profile,
                              displayName: e.target.value,
                            }
                          : profile
                      )
                    )
                  }
                />
                <Select
                  size="sm"
                  mt={2}
                  value={item.calculationType}
                  onChange={(e) =>
                    setProfiles((prev) =>
                      prev.map((profile) =>
                        profile._id === item._id
                          ? {
                              ...profile,
                              calculationType: e.target.value as any,
                              defaultValue:
                                e.target.value === "MANUEL"
                                  ? null
                                  : profile.value,
                            }
                          : profile
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
                    value={item.value ?? ""}
                    onChange={(e) =>
                      setProfiles((prev) =>
                        prev.map((profile) =>
                          profile._id === item._id
                            ? {
                                ...profile,
                                value:
                                  e.target.value === ""
                                    ? null
                                    : Number(e.target.value),
                              }
                            : profile
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
                onClick={() => handleDelete(item._id!)}
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
