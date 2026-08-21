import { WarningIcon } from "@chakra-ui/icons";
import {
  Button,
  Icon as ChakraIcon,
  HStack,
  Icon,
  PlacementWithLogical,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { IconType } from "react-icons";

interface Props {
  buttonText: string;
  placement: PlacementWithLogical;
  icon?: IconType;
  width: string;
  color: string;
}

const NotAuthorized = ({
  buttonText,
  icon,
  placement,
  width,
  color,
}: Props) => {
  const [buttonClicked, setButtonClicked] = useState(false);

  return (
    <Popover placement={placement} trigger="click">
      <PopoverTrigger>
        <Button
          color="#ffffff"
          bg={buttonClicked ? "red" : color}
          w={width}
          mt={4}
          leftIcon={
            <ChakraIcon
              as={icon}
              color="#ffffff"
              boxSize="1.3rem"
              mr="0.5rem"
            />
          }
          onClick={() => setButtonClicked((prev) => !prev)}
          fontSize="1.1rem"
        >
          <Text position="relative" right="0.3rem" top="0.5rem">
            {buttonText}
          </Text>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        height="4.5rem"
        width="17rem"
        bg="red.50"
        border="1px solid"
        borderColor="red.200"
        borderLeftWidth="5px"
        borderLeftColor="red.500"
        boxShadow="lg"
      >
        <PopoverArrow bg="red.50" />

        <PopoverBody py={3}>
          <HStack align="start" spacing={3}>
            <Icon as={WarningIcon} color="red.500" boxSize={5} mt="2px" />
            <span>Vous n'êtes pas autorisé à effectuer cette opération.</span>
          </HStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default NotAuthorized;
