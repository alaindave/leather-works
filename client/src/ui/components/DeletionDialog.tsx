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

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirmation: () => void;
  header: string;
  body: string;
}

const DeletionDialog = ({
  isOpen,
  onClose,
  onConfirmation,
  header,
  body,
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

          <AlertDialogBody color="#ffffff">{body}</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Non
            </Button>
            <Button colorScheme="red" onClick={onConfirmation} ml={3}>
              Oui
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default DeletionDialog;
