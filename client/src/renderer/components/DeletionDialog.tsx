import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import Employee from "../../common/types/Employee";
import { AttendanceWithEmployee } from "../../common/types/Attendance";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isDeleting?: boolean;
  onConfirmation: () => void;
  header: string;
  body?: string;
  employee?: Employee;
  attendance?: AttendanceWithEmployee;
}

const DeletionDialog = ({
  isOpen,
  onClose,
  isDeleting,
  onConfirmation,
  header,
  body,
  employee,
  attendance,
}: Props) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay backdropFilter="auto" backdropBlur="10px">
        <AlertDialogContent bg="#08162b">
          <AlertDialogHeader fontSize="lg" fontWeight="bold" color="#ffffff">
            {header}
          </AlertDialogHeader>
          {employee ? (
            <AlertDialogBody color="#ffffff" fontSize="1rem">
              Êtes-vous sûr de vouloir supprimer{" "}
              <b style={{ color: "#F2B705" }}>
                {employee?.firstName} {employee?.lastName}
              </b>{" "}
              de la liste des employés ?
            </AlertDialogBody>
          ) : attendance ? (
            <AlertDialogBody color="#ffffff" fontSize="1rem">
              Etes vous sur de vouloir supprimer{" "}
              <span
                style={{
                  color: "#F2B705",
                  fontWeight: "bold",
                }}
              >
                {attendance?.firstName}
              </span>{" "}
              <span
                style={{
                  color: "#F2B705",
                  fontWeight: "bold",
                }}
              >
                {attendance?.lastName}
              </span>{" "}
              de la liste de présence?
            </AlertDialogBody>
          ) : (
            <AlertDialogBody color="#ffffff">{body}</AlertDialogBody>
          )}
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Non
            </Button>
            <Button
              colorScheme="red"
              onClick={onConfirmation}
              ml={3}
              isLoading={isDeleting}
              loadingText="Patientez..."
              spinnerPlacement="start"
              isDisabled={isDeleting}
            >
              Oui
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default DeletionDialog;
