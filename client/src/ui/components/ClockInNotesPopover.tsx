import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react";

interface Props {
  clockInTime: string;
  lateMinutes: number;
  notes: string;
}

function formatLateMinutes(lateMinutes: number): string {
  if (lateMinutes < 60) {
    return `${lateMinutes} min`;
  }

  const hours = Math.floor(lateMinutes / 60);
  const minutes = lateMinutes % 60;

  if (minutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${minutes} min`;
}

const ClockInNotesPopover = ({ clockInTime, lateMinutes, notes }: Props) => {
  return (
    <Popover trigger="hover" placement="left">
      <PopoverTrigger>
        <Text
          fontSize="1.1rem"
          color="#FF8787"
          cursor="pointer"
          _hover={{
            color: "#F2B705",
          }}
        >
          {clockInTime}
        </Text>
      </PopoverTrigger>

      <PopoverContent bg="#08162b" borderColor="#22345F" color="white">
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
