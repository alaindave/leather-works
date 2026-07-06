import { Box, Image, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import defaultAvatar from "../assets/default-avatar.jpeg";

interface Props {
  employeeId: string;
  currentPhoto?: string | null;
  onUploaded?: (newPath: string) => void;
}

export default function EmployeePhotoUpload({
  employeeId,
  currentPhoto,
  onUploaded,
}: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  async function upload(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await window.electron.employees.uploadPhoto(employeeId, {
      name: file.name,
      buffer: arrayBuffer,
    });

    setPreview(null);
    onUploaded?.(result.photo_path!);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    upload(file);
  }

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    upload(file);
  }

  return (
    <VStack spacing={3}>
      <Box
        w="140px"
        h="140px"
        borderRadius="full"
        overflow="hidden"
        border="2px dashed"
        borderColor={isDragging ? "blue.400" : "gray.300"}
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        position="relative"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer",
          }}
          onChange={handleSelect}
        />

        <Image
          src={preview || currentPhoto || defaultAvatar}
          boxSize="140px"
          objectFit="cover"
        />
      </Box>

      <Text fontSize="sm" color="gray.500">
        Drag & drop or click to upload
      </Text>
    </VStack>
  );
}
