import {
  Image,
  Box,
  Grid,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useAdminUser from "../../store/auth.store";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineDeleteForever } from "react-icons/md";
import { PiDotsThreeOutlineVerticalDuotone } from "react-icons/pi";
import { TiDeleteOutline } from "react-icons/ti";
import { FaRegEdit } from "react-icons/fa";
import LeaveNotesPopover from "./LeaveNotesPopover";
import LeaveEdit from "./LeaveEdit";
import { LeaveWithEmployee } from "../../common/types/LeaveWithEmployee";
import defaultAvatar from "../assets/default-avatar.jpeg";
import Employee from "../../common/types/Employee";

interface Props {
  leave: LeaveWithEmployee;
  onDelete: () => void;
  gridTemplate: string;
}

const EmployeeLeaveCard = ({ leave, onDelete, gridTemplate }: Props) => {
  const [localLeave, setLocalLeave] = useState<LeaveWithEmployee>(leave);
  const [employee, setEmployee] = useState<Employee>({} as Employee);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [photo_url, setPhotoUrl] = useState("");
  const toast = useToast();
  const {
    _id,
    firstName,
    lastName,
    employeeId,
    remainingLeave,
    startDate,
    endDate,
    subject,
    notes,
    status,
  } = localLeave;

  const adminUser = useAdminUser((store) => store.adminUser);

  //Fetch employee
  useEffect(() => {
    async function fetchEmployee() {
      try {
        const employee = await window.electron.employees.getById(
          leave.employeeId
        );
        setEmployee(employee);
      } catch (e) {
        console.error("AN ERROR OCCURED WHILE FETCHING THE EMPLOYEE.", e);
      }
    }
    fetchEmployee();
  }, []);

  //Fetch employee photos URL
  useEffect(() => {
    async function load() {
      if (!employee.photo_path) return;
      const base64 = await window.electron.employees.getPhotoUrl(
        employee.photo_path
      );
      setPhotoUrl(`data:image/jpeg;base64,${base64}`);
    }

    load();
  }, [employee.photo_path]);

  // //Handle leave approval
  const handleApprove = async () => {
    try {
      const _startDate = new Date(startDate);
      const _endDate = new Date(endDate);

      const leaveDays =
        Math.ceil(
          (_endDate.getTime() - _startDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;

      console.log("LEAVE DAYS:", leaveDays);
      console.log("REMAINING LEAVE:", remainingLeave);

      // Validate dates
      if (_endDate < _startDate) {
        console.error("END DATE CANNOT BE BEFORE START DATE");
        toast({
          title: "Dates invalides",
          description:
            "La date de fin ne peut pas être antérieure à la date de début.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        return;
      }

      // Not enough leave days
      if (leaveDays > remainingLeave) {
        console.error(
          `INSUFFICIENT LEAVE BALANCE. REQUESTED: ${leaveDays}, AVAILABLE: ${remainingLeave}`
        );

        toast({
          title: "Solde de congé insuffisant",
          description: `L'employé dispose de ${remainingLeave} jour${
            remainingLeave !== 1 ? "s" : ""
          } de congé restant${
            remainingLeave !== 1 ? "s" : ""
          }, mais ${leaveDays} jour${
            leaveDays !== 1 ? "s" : ""
          } sont demandés.`,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        return;
      }

      const updatedRemainingLeave = remainingLeave - leaveDays;

      console.log("UPDATED REMAINING LEAVE:", updatedRemainingLeave);

      const employee = await window.electron.employees.update(employeeId, {
        remainingLeave: updatedRemainingLeave,
      });

      console.log("UPDATED EMPLOYEE:", employee);

      const updatedLeave = await window.electron.leave.update(leave._id, {
        status: "APPROUVÉ",
      });

      console.log("UPDATED LEAVE:", updatedLeave);

      setLocalLeave(updatedLeave);
    } catch (error) {
      console.error("AN ERROR OCCURRED WHILE APPROVING LEAVE:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'approbation du congé.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  //Handle leave denial
  const handleDeny = () => {
    window.electron.leave
      .update(leave._id, {
        status: "REFUSÉ",
      })

      .then((leave) => {
        console.log("Denied leave: ", leave);
        setLocalLeave(leave);
      })
      .catch((error) =>
        console.error("An error occured while denying the leave", error)
      );
  };

  // // Handle cancel
  const handleCancel = () => {
    window.electron.leave
      .update(leave._id, {
        status: "ANNULÉ",
      })

      .then((leave) => {
        console.log("Cancelled leave: ", leave);
        setLocalLeave(leave);
      })
      .catch((error) =>
        console.error("An error occured while cancelling the leave", error)
      );
  };

  //Leave refresh
  const refreshLeave = async () => {
    const freshLeave = await window.electron.leave.getLeaveById(_id);
    setLocalLeave(freshLeave);
  };

  return (
    <Grid
      templateColumns={gridTemplate}
      alignItems="center"
      ml="0.5rem"
      px={3}
      py={3}
      bg="#ffffff"
      border="1px solid #E2E8F0"
      borderWidth="0.3px"
      boxShadow="0 2px 10px rgba(15,23,42,.06)"
      minH="6.3rem"
      width="80vw"
      marginBottom="0.8px"
    >
      <Box>
        <HStack>
          <Image
            src={photo_url || defaultAvatar}
            boxSize="70px"
            borderRadius="full"
            fit="cover"
          />
          <Text
            color="gray.800"
            fontWeight="500"
            fontSize="1.1rem"
            whiteSpace="normal"
            wordBreak="break-word"
            maxW="7rem"
            noOfLines={2}
          >
            {firstName} {lastName}
          </Text>
        </HStack>
      </Box>
      <Box>
        <Text ml="0.5rem" color="gray.600" fontWeight="500" fontSize="1.1rem">
          {new Date(startDate).toLocaleDateString("fr-FR")}
        </Text>
      </Box>
      <Box>
        <Text color="gray.600" fontWeight="500" fontSize="1.1rem">
          {new Date(endDate).toLocaleDateString("fr-FR")}
        </Text>
      </Box>
      <Box>
        <LeaveNotesPopover subject={subject} notes={notes} />
      </Box>
      <Box width="7rem">
        {status === "ATTENTE_APPROBATION" ? (
          <Text
            color="yellow.600"
            fontWeight="600"
            fontSize="1.05rem"
            whiteSpace="normal"
            wordBreak="break-word"
          >
            Attente approbation
          </Text>
        ) : (
          <Text
            color={
              status === "APPROUVÉ"
                ? "green.700"
                : status === "REFUSÉ"
                ? "#FC8181"
                : "yellow.500"
            }
            fontWeight="600"
            fontSize="1.05rem"
            whiteSpace="normal"
            wordBreak="break-word"
          >
            {status}
          </Text>
        )}
      </Box>
      <Box position="relative" left="1rem">
        <Text color="gray.800" fontSize="1.1rem">
          {remainingLeave}
        </Text>
      </Box>
      {adminUser?.role === "MANAGER" ? (
        // Manager area
        <Box>
          <Text color="gray.200" fontSize="1.1rem">
            <Menu placement="bottom-end">
              <MenuButton
                mb={10}
                as={IconButton}
                icon={<PiDotsThreeOutlineVerticalDuotone size="1.5rem" />}
                variant="ghost"
                size="1rem"
                borderRadius="full"
                fontWeight="600"
                color="red.600"
                _hover={{
                  bg: "#1D326B",
                  color: "white",
                }}
                _expanded={{
                  bg: "#1D326B",
                }}
                aria-label="Actions"
                position="relative"
                top="1rem"
                left="2rem"
              />

              <MenuList
                bg="#132250"
                border="1px solid #2A3D70"
                borderRadius="14px"
                minW="170px"
                p="6px"
                boxShadow="0 8px 30px rgba(0,0,0,0.35)"
              >
                {status === "ATTENTE_APPROBATION" ? (
                  <>
                    <MenuItem
                      fontWeight="600"
                      mb={2}
                      icon={
                        <IoIosCheckmarkCircleOutline
                          color="green.300"
                          size="20px"
                        />
                      }
                      borderBottom="1px solid #2A3D70"
                      bg="transparent"
                      color="white"
                      borderRadius="10px"
                      _hover={{ bg: "#1D326B" }}
                      onClick={handleApprove}
                    >
                      Approuver
                    </MenuItem>

                    <MenuItem
                      fontWeight="600"
                      icon={<TiDeleteOutline color="orange.300" size="20px" />}
                      bg="transparent"
                      borderBottom="1px solid #2A3D70"
                      color="white"
                      borderRadius="10px"
                      _hover={{ bg: "#1D326B" }}
                      onClick={handleDeny}
                      mb={2}
                    >
                      Refuser
                    </MenuItem>

                    <MenuItem
                      icon={<FaRegEdit color="orange.300" size="20px" />}
                      bg="transparent"
                      color="white"
                      borderRadius="10px"
                      _hover={{ bg: "#1D326B" }}
                      onClick={onOpen}
                    >
                      <Text fontWeight="600" position="relative" top="8px">
                        Modifier
                      </Text>
                      <LeaveEdit
                        leave={leave}
                        isOpen={isOpen}
                        onClose={onClose}
                        onUpdated={refreshLeave}
                      />
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem
                    height="20px"
                    mb={2}
                    pt={3}
                    icon={
                      <MdOutlineDeleteForever color="red.300" size="20px" />
                    }
                    bg="transparent"
                    color="red.300"
                    borderRadius="10px"
                    _hover={{
                      bg: "rgba(255,0,0,0.08)",
                    }}
                    onClick={() => onDelete()}
                  >
                    Supprimer
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          </Text>
        </Box>
      ) : (
        // Admin area
        <Box>
          <Text color="gray.200" fontSize="1.1rem">
            <Menu placement="bottom-end">
              <MenuButton
                mb={10}
                as={IconButton}
                icon={<PiDotsThreeOutlineVerticalDuotone size="1.6rem" />}
                color="brown"
                variant="ghost"
                borderRadius="full"
                _hover={{
                  bg: "#1D326B",
                  color: "white",
                }}
                _expanded={{
                  bg: "#1D326B",
                }}
                aria-label="Actions"
                position="relative"
                top="1rem"
              />

              <MenuList
                bg="#132250"
                border="1px solid #2A3D70"
                borderRadius="14px"
                minW="170px"
                p="6px"
                boxShadow="0 8px 30px rgba(0,0,0,0.35)"
              >
                {status === "ATTENTE_APPROBATION" ? (
                  <>
                    <MenuItem
                      icon={<FaRegEdit color="orange.300" size="1rem" />}
                      bg="transparent"
                      color="white"
                      borderRadius="10px"
                      _hover={{ bg: "#1D326B" }}
                      onClick={onOpen}
                      fontSize="1.1rem"
                    >
                      Modifier la demande
                    </MenuItem>
                    <LeaveEdit
                      leave={leave}
                      onUpdated={refreshLeave}
                      isOpen={isOpen}
                      onClose={onClose}
                    />
                    <MenuItem
                      bg="transparent"
                      borderTop="1px solid #2A3D70"
                      color="white"
                      borderRadius="10px"
                      _hover={{ bg: "#1D326B" }}
                      onClick={() => onDelete()}
                      icon={
                        <MdOutlineDeleteForever color="red.300" size="1.2rem" />
                      }
                    >
                      <Text fontWeight="600" fontSize="1.1rem">
                        Annuler
                      </Text>
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem
                    bg="transparent"
                    color="white"
                    borderRadius="10px"
                    _hover={{ bg: "#1D326B" }}
                    fontSize="1rem"
                    fontWeight="600"
                    onClick={handleCancel}
                  >
                    Annuler
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          </Text>
        </Box>
      )}
    </Grid>
  );
};

export default EmployeeLeaveCard;
