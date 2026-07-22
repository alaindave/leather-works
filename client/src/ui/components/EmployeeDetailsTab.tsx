import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { FaBuilding, FaCalendarAlt, FaHashtag } from "react-icons/fa";
import { FaHouseChimneyWindow } from "react-icons/fa6";
import { GiRelationshipBounds, GiRotaryPhone } from "react-icons/gi";
import { IoPerson } from "react-icons/io5";
import { MdAttachMoney, MdWork } from "react-icons/md";
import { LuPaperclip } from "react-icons/lu";
import useAdminUser from "../../store/auth.store";
import type Employee from "../../shared/types/Employee";
import EmployeeDetailsCard from "./EmployeeDetailsCard";
import { useEffect, useState, useRef } from "react";
import { EmployeeDocument } from "../../shared/types/EmployeeDocuments";
import EmployeeDocumentsList from "./EmployeeDocumentsList";
import UploadDocumentModal from "./UploadDocumentModal";

interface Props {
  employee: Employee | null;
}

const EmployeeDetailsTab = ({ employee }: Props) => {
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeletionOpen,
    onOpen: onDeletionOpen,
    onClose: onDeletionClose,
  } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [documentToDelete, setDocumentToDelete] =
    useState<EmployeeDocument | null>(null);
  const toast = useToast();
  useEffect(() => {
    if (!employee) return;
    console.log("EMPLOYEE ID TESTING", employee._id);
    window.electron.employees_documents
      .getByEmployee(employee._id)
      .then((documents) => {
        setDocuments(documents);
        console.log("DOCUMENTS FETCHED: ", documents);
      })
      .catch((error) => {
        console.error("ERROR FETCHING DOCUMENT:", error);
      });
  }, [employee]);

  const user = useAdminUser((store) => store.adminUser);

  const handleRefresh = () => {
    if (!employee) return;
    window.electron.employees_documents
      .getByEmployee(employee._id)
      .then((documents) => {
        setDocuments(documents);
        console.log("DOCUMENTS FETCHED: ", documents);
      })
      .catch((error) => {
        console.error("ERROR FETCHING DOCUMENT:", error);
      });
  };

  const handleView = async (document: EmployeeDocument) => {
    await window.electron.employees_documents.view(document.localPath);
  };

  const handleDownload = async (document: EmployeeDocument) => {
    await window.electron.employees_documents.download(document);

    toast({
      title: "Telechargement",
      status: "success",
    });
  };

  const handleDelete = (document: EmployeeDocument) => {
    setDocumentToDelete(document);
    onDeletionOpen();
  };

  const confirmDelete = async () => {
    if (!documentToDelete) return;

    try {
      await window.electron.employees_documents.delete(documentToDelete._id);

      setDocuments((prev) =>
        prev.filter((d) => d._id !== documentToDelete._id)
      );

      toast({
        title: "Document supprimé",
        status: "success",
      });

      onDeletionClose();
    } catch (error) {
      toast({
        title: "Suppression echouée",
        status: "error",
      });
    } finally {
      setDocumentToDelete(null);
      onClose();
    }
  };

  if (!employee) return null;

  return (
    <Box maxH="90vh" w="47vw">
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
              color: "purple.600",
              borderColor: "#F2B705",
              bg: "transparent",
            }}
            _hover={{
              color: "purple.600",
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
              color: "purple.600",
              borderColor: "#F2B705",
              bg: "transparent",
            }}
            _hover={{
              color: "purple.600",
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
              color: "purple.600",
              borderColor: "#F2B705",
              bg: "transparent",
            }}
            _hover={{
              color: "purple.600",
            }}
          >
            Contact
          </Tab>
          <Tab
            flexShrink={0}
            color="gray.600"
            fontSize={{ base: "sm", md: "md", lg: "lg" }}
            fontWeight="600"
            px={{ base: 3, md: 5 }}
            _selected={{
              color: "purple.600",
              borderColor: "#F2B705",
              bg: "transparent",
            }}
            _hover={{
              color: "purple.600",
            }}
          >
            Documents
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
              value={employee?.matricule || "N.D."}
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
          <TabPanel p={0}>
            <UploadDocumentModal
              isOpen={isOpen}
              onClose={onClose}
              employeeId={employee._id}
              uploadedBy={user._id}
              documentType="EMPLOYMENT_CONTRACT"
              onRefresh={handleRefresh}
            />
            <EmployeeDocumentsList
              documents={documents}
              onView={handleView}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
            <Button
              position="absolute"
              top="3rem"
              right="0.01rem"
              onClick={onOpen}
              bg="transparent"
              fontSize="1.4rem"
              _hover={{ bg: "transparent" }}
            >
              <LuPaperclip />
            </Button>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <AlertDialog
        isOpen={isDeletionOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => {
          setDocumentToDelete(null);
          onDeletionClose();
        }}
      >
        <AlertDialogOverlay backdropFilter="auto" backdropBlur="0.5rem">
          <AlertDialogContent
            bg="#08162b"
            color="white"
            mx={4}
            position="relative"
            top="8rem"
          >
            <AlertDialogHeader>Supprimer le document</AlertDialogHeader>

            <AlertDialogBody>
              {documentToDelete ? (
                <>
                  Êtes vous sur de vouloir supprimer{" "}
                  <strong style={{ color: "#F2B705" }}>
                    {documentToDelete.originalName}
                  </strong>
                  ?
                  <br />
                </>
              ) : (
                "Êtes vous sur de vouloir supprimer ce document"
              )}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeletionClose}>
                Annuler
              </Button>

              <Button colorScheme="red" ml={3} onClick={confirmDelete}>
                Supprimer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default EmployeeDetailsTab;
