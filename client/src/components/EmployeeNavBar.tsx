import { Box, Button, Divider, useDisclosure } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import "../styles/App.css";
import ReminderModal from "./ReminderModal";
import { useReminders } from "../hooks/useReminders";

const EmployeeNavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { reminders, addReminder } = useReminders();

  return (
    <>
      <Box className="nav-bar">
        <ul className="nav-list">
          <li>
            <NavLink className="nav-button" to="/employees_admin">
              Tableau de bord
            </NavLink>
          </li>
          <Divider orientation="horizontal" w="160px" borderColor="white" />
          <li>
            <NavLink className="nav-button" to="/employees_admin/employees_list">
              Employés
            </NavLink>
          </li>
          <Divider orientation="horizontal" w="160px" borderColor="white" />
          <li>
            <NavLink className="nav-button" to="/employees_admin/attendance">
              Presence
            </NavLink>
          </li>
          <Divider orientation="horizontal" w="160px" borderColor="white" />
          <li>
            <NavLink className="nav-button" to="/employees_admin/leave">
              Congés
            </NavLink>
          </li>
          <Divider orientation="horizontal" w="160px" borderColor="white" />

          <li>
            <NavLink className="nav-button" to="/employees_admin/payslips">
              Fiches de paye
            </NavLink>
          </li>
          <Divider orientation="horizontal" w="160px" borderColor="white" />

          <li>
            <Button
              onClick={onOpen}
              className="nav-button"
              bg="transparent"
              _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
              w="100%"
              justifyContent="flex-start"
              fontWeight="400"
              fontSize="14px"
              padding="8px 16px"
            >
              Rappel
            </Button>
          </li>
        </ul>
      </Box>

      <ReminderModal
        isOpen={isOpen}
        onClose={onClose}
        onAddReminder={addReminder}
        reminders={reminders}
      />
    </>
  );
};

export default EmployeeNavBar;
