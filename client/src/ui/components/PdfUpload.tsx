import { Box, Button, Flex, Icon, Input, Text, VStack } from "@chakra-ui/react";
import { FiFileText, FiUpload, FiTrash2 } from "react-icons/fi";
import { useRef, useState } from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface PdfUploadProps {
  onChange?: (file: File | null) => void;
}

export default function PdfUpload({ onChange }: PdfUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);

  const handleFile = (selected: File | null) => {
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      alert("Maximum file size is 10MB.");
      return;
    }

    setFile(selected);
    onChange?.(selected);
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
          transition="0.2s"
          _hover={{
            borderColor: "yellow.400",
            bg: "whiteAlpha.50",
          }}
          onClick={() => inputRef.current?.click()}
        >
          <VStack gap={3}>
            <Icon as={FiUpload} boxSize={10} color="yellow.400" />

            <Text fontWeight="bold">Upload PDF</Text>

            <Text color="gray.400" fontSize="sm">
              Click here to select a PDF
            </Text>

            <Text fontSize="xs" color="gray.500">
              Maximum size: 10 MB
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
              onClick={() => {
                setFile(null);
                onChange?.(null);
              }}
            >
              Remove
            </Button>
          </Flex>
        </Box>
      )}
    </>
  );
}
