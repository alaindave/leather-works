import { Box, Flex, Text, HStack, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { IoSettings } from "react-icons/io5";
import { FaSyncAlt } from "react-icons/fa";
import { useState } from "react";
import Payroll from "../../../common/types/payroll/Payroll";

export default function PayrollPage() {
  const [payslips, setPayslips] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(false);

  //Payroll sync and refresh
  const handlePayrollSync = async () => {
    // try {
    //   setLoading(true);
    //   const result = await window.electron.sync();
    //   if (result.success) {
    //     console.log("Sync completed");
    //     const leaves = await window.electron.leave.getLeaveByMonth(
    //       submissionMonth
    //     );
    //     setLeaves(leaves);
    //     console.log(
    //       `Fetched leaves for the month of ${submissionMonth}:${leaves}`
    //     );
    //   } else {
    //     console.error(result.message);
    //   }
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <Flex width="100%" justify="space-between">
      <Box>
        <HStack>
          <Text
            color="#1F2937"
            fontSize="clamp(1.3rem, 1vw + 0.8rem, 1.4rem)"
            fontWeight="700"
            ml="0.5rem"
            mt="0.7rem"
          >
            Fiches de paye
          </Text>
          <Button
            bg="transparent"
            isLoading={loading}
            color="gray.800"
            _hover={{ bg: "transparent" }}
            fontSize="1rem"
            position="relative"
            bottom="0.2rem"
            right="1rem"
            onClick={handlePayrollSync}
          >
            <FaSyncAlt />
          </Button>
        </HStack>
        <Text
          fontWeight="500"
          left="0.45rem"
          fontSize="clamp(1rem, 1vw + 0.8rem, 1.1rem)"
          color="gray.500"
          position="relative"
          bottom="1.4rem"
        >
          Gérez les fiches de payes
        </Text>
      </Box>

      <Button mt="2rem">Generer fiches de paye</Button>

      <Box mt="1rem" mr="2rem">
        <Link to="/employees_admin/payroll/settings">
          <IoSettings fontSize="1.7rem" />
        </Link>
      </Box>
    </Flex>
  );
}
