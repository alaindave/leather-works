import {
  Badge,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import TimePicker from "react-time-picker";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import Employee from "../../common/types/Employee";

interface AddAttendanceModalProps {
  date: string;
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

type AttendanceType = "PRESENT" | "ABSENT" | "CONGÉ";

const AddAttendanceModal = ({
  date,
  isOpen,
  onClose,
  onCreated,
}: AddAttendanceModalProps) => {
  const toast = useToast();
  const [employeeId, setEmployeeId] = useState("");
  const [attendanceType, setAttendanceType] =
    useState<AttendanceType>("PRESENT");
  const [clockIn, setClockIn] = useState<string | null>("08:00");
  const [clockOut, setClockOut] = useState<string | null>("17:00");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [saving, setSaving] = useState(false);

  /*
   * -------------------------------------------------------
   * Load employees who DON'T have attendance for the date
   * -------------------------------------------------------
   */

  useEffect(() => {
    if (!isOpen) return;

    loadEmployeesWithoutAttendance();
  }, [isOpen, date]);

  const loadEmployeesWithoutAttendance = async () => {
    try {
      setLoadingEmployees(true);
      const result =
        await window.electron.attendance.getEmployeesWithoutAttendance(date);
      console.log(`EMPLOYEES WITHOUT ATTENDANDE RECORD FOR ${date}`, result);
      setEmployees(result);
    } catch (error) {
      console.error("FAILED TO LOAD EMPLOYEES WITHOUT ATTENDANCE", error);

      toast({
        title: "Erreur",
        description: "Impossible de charger les employés sans présence.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoadingEmployees(false);
    }
  };

  /*
   * -------------------------------------------------------
   * Reset form
   * -------------------------------------------------------
   */

  const resetForm = () => {
    setEmployeeId("");
    setAttendanceType("PRESENT");
    setClockIn("08:00");
    setClockOut("17:00");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  /*
   * -------------------------------------------------------
   * Save
   * -------------------------------------------------------
   */

  const handleSubmit = async () => {
    if (!employeeId) {
      toast({
        title: "Employé requis",
        description: "Veuillez sélectionner un employé.",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });

      return;
    }

    if (attendanceType === "PRESENT") {
      if (!clockIn) {
        toast({
          title: "Heure d'arrivée requise",
          description: "Veuillez sélectionner une heure d'arrivée.",
          status: "warning",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });

        return;
      }

      if (!clockOut) {
        toast({
          title: "Heure de départ requise",
          description: "Veuillez sélectionner une heure de départ.",
          status: "warning",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });

        return;
      }
    }

    try {
      setSaving(true);

      await window.electron.attendance.create({
        employeeId,
        date,
        clockIn: clockIn ?? null,
        clockOut: clockOut ?? null,
        status: attendanceType ?? null,
      });

      toast({
        title: "Présence ajoutée",
        description: "La présence a été ajoutée avec succès.",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });

      onCreated?.();
      handleClose();
    } catch (error) {
      console.error("FAILED TO CREATE ATTENDANCE", error);

      const message =
        error instanceof Error
          ? error.message
          : "Impossible d'ajouter la présence.";

      toast({
        title: "Échec de l'ajout",
        description: message,
        status: "error",
        duration: 6000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size="lg">
      <ModalOverlay backdropFilter="blur(4px)" />

      <ModalContent borderRadius="14px">
        <ModalHeader>
          Ajouter une présence
          <Text fontSize="sm" fontWeight="400" color="gray.500" mt="0.3rem">
            Ajoutez manuellement une présence manquante.
          </Text>
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={5} align="stretch">
            {/* DATE */}
            <FormControl>
              <FormLabel fontWeight="600">Date</FormLabel>

              <Box
                border="1px solid"
                borderColor="gray.300"
                borderRadius="8px"
                px="0.7rem"
                py="0.6rem"
                bg="gray.50"
                height="3rem"
              >
                <Text fontSize="1.1rem" fontWeight="500" color="gray.700">
                  {new Date(`${date}T00:00:00`).toLocaleDateString("fr-FR")}
                </Text>
              </Box>
            </FormControl>
            {/* EMPLOYEE */}
            <FormControl>
              <FormLabel fontWeight="600">Employé</FormLabel>

              <Select
                placeholder={
                  loadingEmployees
                    ? "Chargement des employés..."
                    : employees.length === 0
                    ? "Tous les employés ont une présence"
                    : "Sélectionner un employé"
                }
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                isDisabled={loadingEmployees || employees.length === 0}
              >
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.firstName} {employee.lastName}
                  </option>
                ))}
              </Select>

              {employees.length > 0 && (
                <Text fontSize="xs" color="gray.500" mt="1">
                  {employees.length} employé(s) sans présence pour cette date.
                </Text>
              )}
            </FormControl>
            <Divider />
            {/* ATTENDANCE TYPE */}
            <FormControl>
              <FormLabel fontWeight="600">Type de présence</FormLabel>

              <RadioGroup
                value={attendanceType}
                onChange={(value) => setAttendanceType(value as AttendanceType)}
              >
                <Stack direction="row" spacing={6}>
                  <Radio value="PRESENT">PRÉSENT</Radio>

                  <Radio value="ABSENT">ABSENT</Radio>

                  <Radio value="CONGÉ">CONGÉ</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
            {/* TIMES */}
            {attendanceType === "PRESENT" && (
              <HStack spacing={4} align="start">
                <FormControl>
                  <FormLabel fontWeight="600">Heure d'arrivée</FormLabel>

                  <Box
                    border="1px solid"
                    borderColor="gray.300"
                    borderRadius="8px"
                    px="0.7rem"
                    py="0.35rem"
                  >
                    <TimePicker
                      value={clockIn}
                      onChange={setClockIn}
                      format="HH:mm"
                      disableClock
                      clearIcon={null}
                    />
                  </Box>
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="600">Heure de départ</FormLabel>

                  <Box
                    border="1px solid"
                    borderColor="gray.300"
                    borderRadius="8px"
                    px="0.7rem"
                    py="0.35rem"
                  >
                    <TimePicker
                      value={clockOut}
                      onChange={setClockOut}
                      format="HH:mm"
                      disableClock
                      clearIcon={null}
                    />
                  </Box>
                </FormControl>
              </HStack>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Annuler
          </Button>

          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={saving}
            loadingText="Ajout..."
            isDisabled={
              !employeeId || loadingEmployees || employees.length === 0
            }
          >
            Ajouter
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddAttendanceModal;
