import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { useRef } from "react";
import { SlMagnifier } from "react-icons/sl";

interface Props {
  onSearch: (searchText: string) => void;
}

const SearchBar = ({ onSearch }: Props) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <form
      onChange={(e) => {
        e.preventDefault();
        if (ref.current) onSearch(ref.current?.value);
      }}
    >
      <InputGroup>
        <InputLeftElement children={<SlMagnifier color="#ffffff" />} />
        <Input
          ref={ref}
          borderRadius="5px"
          borderWidth="0.3px"
          borderColor="gray.600"
          bg="#FFFFFF"
          placeholder="Rechercher un employé"
          _placeholder={{ color: "black", fontSize: "1rem", fontWeight: "500" }}
          variant="filled"
          width="40vw"
          height="45px"
          textColor="black"
          _focus={{ bg: "#FFFFFF" }}
          _hover={{ bg: "#FFFFFF", borderColor: "gray.600" }}
        />
      </InputGroup>
    </form>
  );
};

export default SearchBar;
