import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import PdfUpload from "./PdfUpload";
import { EmployeeDocumentType } from "../../shared/types/EmployeeDocuments";
import { useState } from "react";

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  uploadedBy?: string;
  documentType: EmployeeDocumentType;
  onRefresh?: () => void;
}

export default function UploadDocumentModal({
  isOpen,
  onClose,
  employeeId,
  uploadedBy,
  documentType,
  onRefresh,
}: UploadDocumentModalProps) {
  const [uploaded, setUploaded] = useState<boolean>(false);
  const handleClose = () => {
    if (!uploaded) return;
    onRefresh?.();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Documents</ModalHeader>

        <ModalCloseButton />

        <ModalBody pb={6}>
          <PdfUpload
            employeeId={employeeId}
            uploadedBy={uploadedBy}
            documentType={documentType}
            onUploaded={(uploaded) => setUploaded(uploaded)}
          />
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={handleClose}>
            Fermer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
