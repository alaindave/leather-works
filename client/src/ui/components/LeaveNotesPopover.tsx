import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Text,
  VStack,
  Badge,
} from "@chakra-ui/react";

interface Props {
  subject: string;
  notes: string;
}

const LeaveNotesPopover = ({ subject, notes }: Props) => {
  return (
    <Popover trigger="hover" placement="right">
      <PopoverTrigger>
        <Text
          color="white"
          cursor="pointer"
          _hover={{
            color: "#F2B705",
          }}
        >
          {subject}
        </Text>
      </PopoverTrigger>

      <PopoverContent
        bg="#08162b"
        borderColor="#22345F"
        color="white"
        width="320px"
      >
        <PopoverArrow bg="#08162b" />

        <PopoverBody>
          <Text>
            <strong>Notes:</strong> {notes}
          </Text>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default LeaveNotesPopover;
