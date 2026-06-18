import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { FaBuilding, FaCalendarAlt, FaHashtag } from "react-icons/fa";
import { FaHouseChimneyWindow } from "react-icons/fa6";
import { GiRelationshipBounds, GiRotaryPhone } from "react-icons/gi";
import { IoPerson } from "react-icons/io5";
import { MdAttachMoney, MdWork } from "react-icons/md";

import type Employee from "../../shared/types/Employee";
import EmployeeDetailsCard from "./EmployeeDetailsCard";

interface Props {
  employee: Employee | null;
}

const EmployeeDetailsTab = ({ employee }: Props) => {
  return (
    <Box h="100%" w="50vw">
      <Tabs variant="enclosed" h="100%" display="flex" flexDirection="column">
        <TabList
          borderBottomColor="rgba(255,255,255,0.08)"
          overflowX="hidden"
          overflowY="hidden"
          whiteSpace="nowrap"
          flexShrink={0}
          sx={{
            "&::-webkit-scrollbar": {
              height: "4px",
            },
          }}
        >
          <Tab
            flexShrink={0}
            color="gray.600"
            fontSize={{ base: "sm", md: "md", lg: "lg" }}
            fontWeight="600"
            px={{ base: 3, md: 5 }}
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
            flexShrink={0}
            color="gray.600"
            fontSize={{ base: "sm", md: "md", lg: "lg" }}
            fontWeight="600"
            px={{ base: 3, md: 5 }}
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
            flexShrink={0}
            color="gray.600"
            fontSize={{ base: "sm", md: "md", lg: "lg" }}
            fontWeight="600"
            px={{ base: 3, md: 5 }}
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

        <TabPanels flex="1" overflowY="auto" px={{ base: 2, md: 4 }} py={4}>
          <TabPanel p={0}>
            <EmployeeDetailsCard
              property="Nom"
              value={employee?.lastName || "N.D."}
              icon={IoPerson}
            />

            <EmployeeDetailsCard
              property="Prénom"
              value={employee?.firstName || "N.D."}
              icon={IoPerson}
            />

            <EmployeeDetailsCard
              property="Matricule"
              value={employee?.employeeID || "N.D."}
              icon={FaHashtag}
            />
            <EmployeeDetailsCard
              property="No carte d'identité"
              value={employee?.idNum || "N.D."}
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

          <TabPanel p={0}>
            <EmployeeDetailsCard
              property="Poste"
              value={employee?.role || "N.D."}
              icon={MdWork}
            />

            <EmployeeDetailsCard
              property="Département"
              value={employee?.department || "N.D."}
              icon={FaBuilding}
            />

            <EmployeeDetailsCard
              property="Salaire"
              value={employee?.salary?.toLocaleString("fr-BI") || "N.D."}
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
            <EmployeeDetailsCard
              property="Congés restants"
              value={employee?.remainingLeave || "N.D."}
              icon={FaCalendarAlt}
            />
          </TabPanel>

          <TabPanel p={0}>
            <EmployeeDetailsCard
              property="Adresse"
              value={employee?.address || "N.D."}
              icon={FaHouseChimneyWindow}
            />

            <EmployeeDetailsCard
              property="Téléphone"
              value={employee?.telephone || "N.D."}
              icon={GiRotaryPhone}
            />

            <EmployeeDetailsCard
              property="Nom du contact d'urgence"
              value={employee?.emergencyContact || "N.D."}
              icon={IoPerson}
            />

            <EmployeeDetailsCard
              property="Relation avec l'employé"
              value={employee?.relationship || "N.D."}
              icon={GiRelationshipBounds}
            />

            <EmployeeDetailsCard
              property="Téléphone du contact d'urgence"
              value={employee?.contactPhone || "N.D."}
              icon={GiRotaryPhone}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default EmployeeDetailsTab;
