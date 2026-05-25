import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { useRef } from "react";
import { SlMagnifier } from "react-icons/sl";
const SearchBar = ({ onSearch }) => {
    const ref = useRef(null);
    return (_jsx("form", { onChange: (e) => {
            e.preventDefault();
            if (ref.current)
                onSearch(ref.current?.value);
        }, children: _jsxs(InputGroup, { children: [_jsx(InputLeftElement, { children: _jsx(SlMagnifier, { color: "#ffffff" }) }), _jsx(Input, { ref: ref, borderRadius: "15px", borderWidth: "0.3px", borderColor: "gray.600", bg: "#08162b", placeholder: "Rechercher un employ\u00E9", variant: "filled", width: "40vw", height: "45px", textColor: "#ffffff", _hover: { bg: "#08162b", borderColor: "gray.600" } })] }) }));
};
export default SearchBar;
