import { useEffect, useRef, useState } from "react";
import {
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
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

const AbsenceNotesPopover = ({ onSubmit, existingNotes }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [absenceNote, setAbsenceNote] = useState(existingNotes);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setAbsenceNote(existingNotes);
  }, [existingNotes]);

  const close = () => {
    setAbsenceNote("");
    onClose();
  };

  const handleSave = async () => {
    setAbsenceNote("");
    setIsSubmitting(true);

    try {
      console.log("Notes to save:", absenceNote);
      const success = await onSubmit(absenceNote);
      if (success) {
        setIsSubmitting(false);
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
      onClose={close}
      placement="right"
      closeOnBlur={false}
      initialFocusRef={textareaRef}
    >
      <PopoverTrigger>
        <Badge
          animation={`${flashLate} 1.5s ease-in-out 2`}
          bg="red.500"
          color="gray.200"
          fontSize="14px"
          cursor="pointer"
        >
          ABSENT
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

          <PopoverBody>
            <Textarea
              ref={textareaRef}
              value={absenceNote ?? ""}
              onChange={(e) => setAbsenceNote(e.target.value)}
              placeholder="Raison de l'absence..."
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

export default AbsenceNotesPopover;
