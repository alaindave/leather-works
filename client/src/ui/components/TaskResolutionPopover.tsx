import { useRef, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  PopoverHeader,
  Textarea,
  Button,
  useDisclosure,
  Text,
} from "@chakra-ui/react";

interface Props {
  onSubmit: (notes: string | undefined) => Promise<boolean>;
}

const TaskResolutionPopover = ({ onSubmit }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [notes, setNotes] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      console.log("Notes to save:", notes);
      const success = await onSubmit(notes);
      if (success) {
        setIsSubmitting(false);
        setNotes("");
        onClose();
      }
    } catch (error) {
      console.error("Failed to save notes:", error);
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
        <Button colorScheme="green">Resoudre</Button>
      </PopoverTrigger>

      <PopoverContent
        position="relative"
        top="4rem"
        bg="#0E1E47"
        borderColor="#22345F"
        color="white"
      >
        <PopoverArrow />

        <PopoverHeader>Notes de resolution</PopoverHeader>

        <PopoverBody>
          <Textarea
            ref={textareaRef}
            value={notes ?? ""}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes de resolution..."
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

export default TaskResolutionPopover;
