import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Text,
  VStack,
  HStack,
  Editable,
  EditableInput,
  EditablePreview,
} from "@chakra-ui/react";
import { useState } from "react";

interface Props {
  clockInTime: string;
  lateMinutes: number;
  notes: string;
  onTimeEdit: (time: string) => Promise<boolean>;
}

const formatLateMinutes = (lateMinutes: number): string => {
  if (lateMinutes < 60) {
    return `${lateMinutes} min`;
  }
  const hours = Math.floor(lateMinutes / 60);
  const minutes = lateMinutes % 60;
  if (minutes === 0) {
    return `${hours} h`;
  }
  return `${hours} h ${minutes} min`;
};

const ClockInNotesPopover = ({
  clockInTime,
  lateMinutes,
  notes,
  onTimeEdit,
}: Props) => {
  const [clockInValue, setClockInValue] = useState(clockInTime);

  const handleEditClockIn = async (newTime: string) => {
    console.log("Time to be edited:", newTime);
    try {
      const success = await onTimeEdit(newTime);
      console.log("Time updated successfully: ", success);
    } catch (error) {
      console.error("An error occured while updating time:", error);
    }
  };

  return (
    <Popover trigger="hover" placement="left">
      <PopoverTrigger>
        <Text
          fontSize="18px"
          color="#FF8787"
          cursor="pointer"
          _hover={{
            color: "#F2B705",
          }}
        >
          <Editable
            position="relative"
            right="1rem"
            value={clockInValue}
            onChange={setClockInValue}
            submitOnBlur={false}
            width="80px"
            selectAllOnFocus
            onSubmit={handleEditClockIn}
          >
            <EditablePreview
              color="#FF8787"
              fontSize="18px"
              fontWeight="500"
              px={2}
              borderRadius="6px"
              transition="0.2s"
              _hover={{
                bg: "rgba(255,255,255,0.05)",
                cursor: "pointer",
              }}
            />

            <EditableInput color="white" fontSize="18px" width="80px" />
          </Editable>
        </Text>
      </PopoverTrigger>

      <PopoverContent
        bg="#08162b"
        borderColor="#22345F"
        color="white"
        position="relative"
        right="1rem"
      >
        <PopoverArrow bg="#08162b" />

        <PopoverBody>
          <VStack>
            <HStack>
              <Text color="red.300">{formatLateMinutes(lateMinutes)}</Text>
              <Text>de retard</Text>
            </HStack>
            <Text position="relative" bottom="1rem">
              <strong>Justification:</strong> {notes}
            </Text>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ClockInNotesPopover;
