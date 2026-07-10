import { useEffect, useRef, useState } from "react";
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
  Portal,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

interface Props {
  onSubmit: (notes: string | undefined) => Promise<boolean>;
  existingNotes?: string | undefined;
}

const AddClockInNotesPopover = ({ onSubmit, existingNotes }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lateNote, setLateNote] = useState(existingNotes);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLateNote(existingNotes);
  }, [existingNotes]);

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

  const flashLate = keyframes`
  0% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.2;
    transform: scale(1.08);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement="right"
      closeOnBlur={false}
      initialFocusRef={textareaRef}
    >
      <PopoverTrigger>
        <Badge
          animation={`${flashLate} 1.5s ease-in-out 2`}
          bg="#DD6B20"
          color="gray.200"
          fontSize="14px"
          cursor="pointer"
        >
          En retard
        </Badge>
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          bg="#0E1E47"
          borderColor="#22345F"
          color="white"
          w="320px"
        >
          <PopoverArrow />

          <PopoverHeader>Ajouter une note</PopoverHeader>

          <PopoverBody>
            <Textarea
              ref={textareaRef}
              value={lateNote ?? ""}
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
      </Portal>
    </Popover>
  );
};

export default AddClockInNotesPopover;
