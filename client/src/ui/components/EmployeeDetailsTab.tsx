import {
  Box,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { FaBuilding, FaCalendarAlt, FaHashtag } from "react-icons/fa";
import { FaHouseChimneyWindow } from "react-icons/fa6";
import { GiRotaryPhone } from "react-icons/gi";
import { IoPerson } from "react-icons/io5";
import { MdAttachMoney, MdWork } from "react-icons/md";
import { GiRelationshipBounds } from "react-icons/gi";

import type Employee from "../../types/Employee";
import "../styles/App.css";
import EmployeeDetailsCard from "./EmployeeDetailsCard";

interface Props {
  employee: Employee | null;
}

const EmployeeDetailsTab = ({ employee }: Props) => {
  return (
    <Box marginTop="10px">
      <Tabs variant="enclosed">
        <TabList borderBottomColor="rgba(255,255,255,0.08)">
          <Tab
            color="gray.200"
            fontSize="20px"
            fontWeight="600"
            _selected={{
              color: "#F2B705",
              borderColor: "#F2B705",
              bg: "rgba(242,183,5,0.08)",
            }}
            _hover={{
              color: "#F2B705",
            }}
          >
            Info personnelles
          </Tab>

          <Tab
            color="gray.200"
            fontSize="20px"
            fontWeight="600"
            _selected={{
              color: "#F2B705",
              borderColor: "#F2B705",
              bg: "rgba(242,183,5,0.08)",
            }}
            _hover={{
              color: "#F2B705",
            }}
          >
            Info professionnelles
          </Tab>

          <Tab
            color="gray.200"
            fontSize="20px"
            fontWeight="600"
            _selected={{
              color: "#F2B705",
              borderColor: "#F2B705",
              bg: "rgba(242,183,5,0.08)",
            }}
            _hover={{
              color: "#F2B705",
            }}
          >
            Contact
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <EmployeeDetailsCard
              property="Nom"
              value={employee?.lastName ?? "N.D."}
              icon={IoPerson}
            />
            <EmployeeDetailsCard
              property="Prenom"
              value={employee?.firstName ?? "N.D."}
              icon={IoPerson}
            />
            <EmployeeDetailsCard
              property="Matricule"
              value={employee?.employeeID ?? "N.D."}
              icon={FaHashtag}
            />
            <EmployeeDetailsCard
              property="Date de naissance"
              value={
                employee?.dateBirth
                  ? new Date(employee.dateBirth).toLocaleDateString("fr-FR")
                  : "N.D."
              }
              icon={FaCalendarAlt}
            />
          </TabPanel>
          <TabPanel>
            <EmployeeDetailsCard
              property="Poste"
              value={employee?.role || "N.D."}
              icon={MdWork}
            />
            <EmployeeDetailsCard
              property="Departement"
              value={employee?.department || "N.D."}
              icon={FaBuilding}
            />
            <EmployeeDetailsCard
              property="Salaire"
              value={employee?.salary || "N.D."}
              icon={MdAttachMoney}
            />

            <EmployeeDetailsCard
              property="Date d'embauche"
              value={
                employee?.dateHired
                  ? new Date(employee.dateHired).toLocaleDateString("fr-FR")
                  : "N.D."
              }
              icon={FaCalendarAlt}
            />
          </TabPanel>
          <TabPanel>
            <EmployeeDetailsCard
              property="Addresse"
              value={employee?.address}
              icon={FaHouseChimneyWindow}
            />
            <EmployeeDetailsCard
              property="Telephone"
              value={employee?.telephone}
              icon={GiRotaryPhone}
            />

            <EmployeeDetailsCard
              property="Nom du contact d'urgence"
              value={employee?.emergencyContact}
              icon={IoPerson}
            />

            <EmployeeDetailsCard
              property="Relation avec l'employé"
              value={employee?.relationship}
              icon={GiRelationshipBounds}
            />
            <EmployeeDetailsCard
              property="Telephone du contact d'urgence"
              value={employee?.contactPhone}
              icon={GiRotaryPhone}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default EmployeeDetailsTab;
