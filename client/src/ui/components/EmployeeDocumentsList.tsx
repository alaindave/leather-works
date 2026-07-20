import {
  Badge,
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  List,
  ListItem,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiDownload, FiEye, FiFileText, FiTrash2 } from "react-icons/fi";
import { EmployeeDocument } from "../../shared/types/EmployeeDocuments";

interface EmployeeDocumentsListProps {
  documents: EmployeeDocument[];
  onView?: (document: EmployeeDocument) => void;
  onDownload?: (document: EmployeeDocument) => void;
  onDelete?: (document: EmployeeDocument) => void;
}

export default function EmployeeDocumentsList({
  documents,
  onView,
  onDownload,
  onDelete,
}: EmployeeDocumentsListProps) {
  if (documents.length === 0) {
    return (
      <Box
        borderWidth="1px"
        borderRadius="lg"
        p={10}
        textAlign="center"
        color="gray.500"
      >
        Aucun document disponible.
      </Box>
    );
  }

  return (
    <List spacing={3}>
      {documents.map((document) => (
        <ListItem
          key={document._id}
          borderWidth="1px"
          borderRadius="lg"
          p={4}
          _hover={{
            bg: "whiteAlpha.50",
          }}
        >
          <Flex align="center">
            <HStack spacing={4}>
              <Icon as={FiFileText} boxSize={8} color="red.400" />

              <VStack align="start" spacing={1}>
                <Text fontWeight="600">
                  {document.documentType === "EMPLOYMENT_CONTRACT"
                    ? "Contrat de travail"
                    : "Carte d'identite"}
                </Text>

                <Text fontSize="sm" color="gray.400">
                  {document.originalName}
                </Text>

                <Text fontSize="xs" color="gray.500">
                  {(document.fileSize / 1024 / 1024).toFixed(2)} MB
                </Text>
              </VStack>
            </HStack>

            <Spacer />

            <Badge colorScheme={document.needsUpload ? "orange" : "green"}>
              {document.needsUpload
                ? "En attente de synchronization"
                : "Synchronise"}
            </Badge>

            <HStack ml={6}>
              <IconButton
                aria-label="View"
                icon={<FiEye />}
                variant="ghost"
                onClick={() => onView?.(document)}
              />

              <IconButton
                aria-label="Download"
                icon={<FiDownload />}
                variant="ghost"
                onClick={() => onDownload?.(document)}
              />

              <IconButton
                aria-label="Delete"
                icon={<FiTrash2 />}
                colorScheme="red"
                variant="ghost"
                onClick={() => onDelete?.(document)}
              />
            </HStack>
          </Flex>
        </ListItem>
      ))}
    </List>
  );
}
