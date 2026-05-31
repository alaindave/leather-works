import {
  Box,
  Grid,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineDeleteForever } from "react-icons/md";
import { PiDotsThreeOutlineVerticalDuotone } from "react-icons/pi";
import { TiDeleteOutline } from "react-icons/ti";

import Employee from "../../shared/types/Employee";
import Leave from "../../shared/types/Leave";
import LeaveNotesPopover from "./LeaveNotesPopover";

interface Props {
  leave: Leave;
  onDelete: () => void;
  gridTemplate: string;
}

const EmployeeLeaveCard = ({ leave, onDelete, gridTemplate }: Props) => {
  const [localLeave, setLocalLeave] = useState<Leave>(leave);
  const {
    _id,
    employee: { employeeID, firstName, lastName, remainingLeave },
    startDate,
    endDate,
    subject,
    notes,
    status,
  } = localLeave;

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  //Handle leave approval
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
    console.log("Employee ID to leave:", leave.employee._id);
    console.log("updatedRemainingLeave:", updatedRemainingLeave);

    axios
      .put<Employee>(`${API_URL}/employees/${leave.employee._id}`, {
        remainingLeave: updatedRemainingLeave,
      })
      .then((res) => {
        console.log("Updated employee: ", res.data);
        return axios.put<Leave>(`${API_URL}/leaves/${_id}`, {
          status: "Approuvé",
        });
      })
      .then((res) => {
        console.log("Updated leave: ", res.data);
        setLocalLeave(res.data);
      })
      .catch((error) =>
        console.error("An error occured while approving the leave", error)
      );
  };
  //Handle leave denial
  const handleDeny = () => {
    axios
      .put<Leave>(`${API_URL}/leaves/${_id}`, { status: "Refusé" })
      .then((res) => {
        console.log("Denied leave: ", res.data);
        setLocalLeave(res.data);
      })
      .catch((error) =>
        console.error("An error occured while denying the leave", error)
      );
  };

  return (
    <Grid
      templateColumns={gridTemplate}
      alignItems="center"
      px={4}
      py={4}
      bg="#0E1E47"
      borderRadius="18px"
      border="1px solid #22345F"
      height="78px"
      width="80vw"
      marginBottom="0.8px"
    >
      <Box ml="11px" mb={14}>
        <Text color="gray.200" fontSize="1.1rem">
          {firstName} {lastName}
        </Text>
      </Box>
      <Box ml="12px" mb={14}>
        <Text color="gray.200" fontSize="1.1rem">
          {new Date(startDate).toLocaleDateString("fr-FR")}
        </Text>
      </Box>
      <Box ml="1rem" mb={14}>
        <Text color="gray.200" fontSize="1.1rem">
          {new Date(endDate).toLocaleDateString("fr-FR")}
        </Text>
      </Box>
      <Box mb={14} ml="1rem">
        <Text color="gray.200" fontSize="1.1rem">
          <LeaveNotesPopover subject={subject} notes={notes} />
        </Text>
      </Box>
      <Box mb={14}>
        <Text
          color={
            status === "Approuvé"
              ? "#68D391"
              : status === "Refusé"
              ? "#FC8181"
              : "#F6E05E"
          }
          fontWeight="600"
          fontSize="1.05rem"
        >
          {status}
        </Text>
      </Box>
      <Box mb={12}>
        <Text
          color="gray.200"
          fontSize="1.1rem"
          position="relative"
          bottom="8px"
          ml="1rem"
        >
          {remainingLeave}
        </Text>
      </Box>
      <Box mb={6} position="relative" left="40px">
        <Text color="gray.200" fontSize="1.1rem">
          <Menu placement="bottom-end">
            <MenuButton
              mb={10}
              as={IconButton}
              icon={<PiDotsThreeOutlineVerticalDuotone size="18px" />}
              variant="ghost"
              size="sm"
              borderRadius="full"
              color="yellow.300"
              _hover={{
                bg: "#1D326B",
                color: "white",
              }}
              _expanded={{
                bg: "#1D326B",
              }}
              aria-label="Actions"
            />

            <MenuList
              bg="#132250"
              border="1px solid #2A3D70"
              borderRadius="14px"
              minW="170px"
              p="6px"
              boxShadow="0 8px 30px rgba(0,0,0,0.35)"
            >
              {status === "En attente d'approbation" && (
                <>
                  <MenuItem
                    icon={
                      <IoIosCheckmarkCircleOutline
                        color="green.300"
                        size="20px"
                      />
                    }
                    bg="transparent"
                    borderTop="1px solid #2A3D70"
                    color="white"
                    borderRadius="10px"
                    _hover={{ bg: "#1D326B" }}
                    onClick={handleApprove}
                  >
                    Approuver
                  </MenuItem>

                  <MenuItem
                    icon={<TiDeleteOutline color="orange.300" size="20px" />}
                    bg="transparent"
                    borderTop="1px solid #2A3D70"
                    color="white"
                    borderRadius="10px"
                    _hover={{ bg: "#1D326B" }}
                    onClick={handleDeny}
                  >
                    Refuser
                  </MenuItem>
                </>
              )}

              <MenuItem
                height="30px"
                mt={2}
                pt={3}
                borderTop="0.3px solid #2A3D70"
                icon={<MdOutlineDeleteForever color="red.300" size="20px" />}
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
            </MenuList>
          </Menu>
        </Text>
      </Box>
    </Grid>
  );
};

export default EmployeeLeaveCard;
