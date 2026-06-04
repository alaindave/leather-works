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
  onSubmit: (notes: string) => Promise<boolean>;
}

const AddClockInNotesPopover = ({ onSubmit }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lateNote, setLateNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      console.log("Notes to save:", lateNote);
      const success = await onSubmit(lateNote);
      if (success) {
        setIsSubmitting(false);
        setLateNote("");
        onClose();
      }
    } catch (error) {
      console.error("Failed to save late notes:", error);
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

          <Button
            mt={3}
            size="sm"
            colorScheme="yellow"
            onClick={handleSave}
            isLoading={isSubmitting}
            loadingText="Patientez..."
            spinnerPlacement="start"
            isDisabled={isSubmitting}
          >
            Sauvegarder
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default AddClockInNotesPopover;
