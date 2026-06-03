import { useRef, useState } from "react";
import {
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  PopoverHeader,
  Textarea,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

interface Props {
  onSubmit: (notes: string) => void;
}

const AddClockInNotesPopover = ({ onSubmit }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lateNote, setLateNote] = useState("");

  const handleSave = async () => {
    try {
      console.log("Saving note:", lateNote);
      onSubmit(lateNote);
      onClose();
      setLateNote("");
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement="left"
      closeOnBlur={false}
      initialFocusRef={textareaRef}
    >
      <PopoverTrigger>
        <Badge bg="#4A1F2D" color="#FF6B81" fontSize="14px" cursor="pointer">
          En retard
        </Badge>
      </PopoverTrigger>

      <PopoverContent bg="#0E1E47" borderColor="#22345F" color="white">
        <PopoverArrow />

        <PopoverHeader>Ajouter une note</PopoverHeader>

        <PopoverBody>
          <Textarea
            ref={textareaRef}
            value={lateNote}
            onChange={(e) => setLateNote(e.target.value)}
            placeholder="Raison du retard..."
            bg="#08162b"
            color="white"
            resize="none"
            minH="100px"
          />

          <Button mt={3} size="sm" colorScheme="yellow" onClick={handleSave}>
            Sauvegarder
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default AddClockInNotesPopover;
