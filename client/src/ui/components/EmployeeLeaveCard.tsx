import {
  Avatar,
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
} from "@chakra-ui/react";
import { useState } from "react";
import useAdminUser from "../../store/auth.store";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineDeleteForever } from "react-icons/md";
import { PiDotsThreeOutlineVerticalDuotone } from "react-icons/pi";
import { TiDeleteOutline } from "react-icons/ti";
import { FaRegEdit } from "react-icons/fa";
import LeaveNotesPopover from "./LeaveNotesPopover";
import LeaveEdit from "./LeaveEdit";
import { LeaveWithEmployee } from "../../shared/types/LeaveWithEmployee";

interface Props {
  leave: LeaveWithEmployee;
  onDelete: () => void;
  gridTemplate: string;
}

const EmployeeLeaveCard = ({ leave, onDelete, gridTemplate }: Props) => {
  const [localLeave, setLocalLeave] = useState<LeaveWithEmployee>(leave);
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  // //Handle leave approval
  const handleApprove = () => {
    const _startDate: Date = new Date(startDate);
    const _endDate: Date = new Date(endDate);
    console.log("startDate :", _startDate);
    console.log("endDate :", _endDate);

    const leaveDays =
      Math.ceil(
        (_endDate.getTime() - _startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
    console.log("Leave days :", leaveDays);
    let updatedRemainingLeave = remainingLeave - leaveDays;
    if (updatedRemainingLeave <= 0) {
      updatedRemainingLeave = 0;
    }
    console.log("Employee ID to leave:", employeeId);
    console.log("updatedRemainingLeave:", updatedRemainingLeave);

    window.electron.employees
      .update(employeeId, { remainingLeave: updatedRemainingLeave })
      .then((employee) => {
        console.log("Updated employee: ", employee);
        console.log("ID of leave to update:", leave._id);
        return window.electron.leave.update(leave._id, {
          status: "Approuvé",
        });
      })
      .then((leave) => {
        console.log("Updated leave: ", leave);
        setLocalLeave(leave);
      })
      .catch((error) =>
        console.error("An error occured while approving the leave", error)
      );
  };
  //Handle leave denial
  const handleDeny = () => {
    window.electron.leave
      .update(leave._id, {
        status: "Refusé",
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
        status: "Annulé",
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
      ml="0.1rem"
      px={3}
      py={3}
      bg="#F8F9FB"
      minH="6.3rem"
      border="0.3px solid gray"
      width="80vw"
      marginBottom="0.8px"
    >
      <Box>
        <HStack>
          <Box mr="0.3rem" mb="0.8rem">
            <Avatar size="sm" name={`${firstName} ${lastName}`} />
          </Box>
          <Text
            color="gray.800"
            fontWeight="500"
            fontSize="1.1rem"
            whiteSpace="normal"
            wordBreak="break-word"
            maxW="8rem"
            noOfLines={2}
          >
            {firstName} {lastName}
          </Text>
        </HStack>
      </Box>
      <Box>
        <Text fontSize="1.1rem" color="gray.800" fontWeight="500">
          {new Date(startDate).toLocaleDateString("fr-FR")}
        </Text>
      </Box>
      <Box>
        <Text fontSize="1.1rem" color="gray.800" fontWeight="500">
          {new Date(endDate).toLocaleDateString("fr-FR")}
        </Text>
      </Box>
      <Box>
        <LeaveNotesPopover subject={subject} notes={notes} />
      </Box>
      <Box width="7rem">
        {status === "En attente d'approbation" ? (
          <Text
            color="yellow.600"
            fontWeight="600"
            fontSize="1.05rem"
            whiteSpace="normal"
            wordBreak="break-word"
          >
            En attente{"\n"}d'approbation
          </Text>
        ) : (
          <Text
            color={
              status === "Approuvé"
                ? "green.700"
                : status === "Refusé"
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
      <Box>
        <Text color="gray.800" fontSize="1.1rem">
          {remainingLeave}
        </Text>
      </Box>
      {adminUser?.role === "manager" ? (
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
              />

              <MenuList
                bg="#132250"
                border="1px solid #2A3D70"
                borderRadius="14px"
                minW="170px"
                p="6px"
                boxShadow="0 8px 30px rgba(0,0,0,0.35)"
              >
                {status === "En attente d'approbation" ? (
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
                {status === "En attente d'approbation" ? (
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
