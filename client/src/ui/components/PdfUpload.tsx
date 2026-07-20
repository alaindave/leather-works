import { Box, Button, Flex, Icon, Input, Text, VStack } from "@chakra-ui/react";

import { FiFileText, FiUpload, FiTrash2 } from "react-icons/fi";
import { useRef, useState } from "react";
import { EmployeeDocumentType } from "../../shared/types/EmployeeDocuments";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface PdfUploadProps {
  employeeId: string;
  uploadedBy?: string;
  documentType: EmployeeDocumentType;
  onUploaded?: (uploaded: boolean) => void;
}

export default function PdfUpload({
  employeeId,
  uploadedBy,
  documentType,
  onUploaded,
}: PdfUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const uploadDocument = async (selectedFile: File) => {
    try {
      setUploading(true);

      const arrayBuffer = await selectedFile.arrayBuffer();

      await window.electron.employees_documents.upload({
        employeeId,
        uploadedBy,
        documentType,
        name: selectedFile.name,
        mimeType: selectedFile.type,
        buffer: new Uint8Array(arrayBuffer),
      });

      setFile(selectedFile);
      onUploaded?.(true);
    } catch (error) {
      console.error("DOCUMENT UPLOAD FAILED:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleFile = async (selected: File | null) => {
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      alert("Veuillez sélectionner un document PDF");
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      alert("Taille maximale: 10MB.");
      return;
    }

    await uploadDocument(selected);
  };

  return (
    <>
      <Input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        display="none"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      {!file ? (
        <Box
          border="2px dashed"
          borderColor="gray.500"
          borderRadius="lg"
          p={8}
          cursor="pointer"
          textAlign="center"
          onClick={() => inputRef.current?.click()}
          _hover={{
            borderColor: "yellow.400",
            bg: "whiteAlpha.50",
          }}
        >
          <VStack gap={3}>
            <Icon as={FiUpload} boxSize={10} color="yellow.400" />

            <Text fontWeight="bold">Ajouter un document</Text>

            <Text color="gray.400" fontSize="sm">
              Cliquez ici pour sélectionner un PDF
            </Text>

            <Text fontSize="xs" color="gray.500">
              Taille maximale: 10 MB
            </Text>
          </VStack>
        </Box>
      ) : (
        <Box borderWidth="1px" borderRadius="lg" p={4} bg="gray.800">
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={3}>
              <Icon as={FiFileText} color="red.400" boxSize={7} />

              <Box>
                <Text fontWeight="medium">{file.name}</Text>

                <Text fontSize="sm" color="gray.400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </Text>
              </Box>
            </Flex>

            <Button
              size="sm"
              colorScheme="red"
              leftIcon={<FiTrash2 />}
              isLoading={uploading}
              onClick={() => {
                setFile(null);
              }}
            >
              Retirer
            </Button>
          </Flex>
        </Box>
      )}
    </>
  );
}
