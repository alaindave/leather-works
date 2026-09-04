import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Spacer,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { FaSyncAlt } from "react-icons/fa";
import EmployeeLeaveCard from "../components/LeaveCard";
import MonthDropDown from "../../../../components/MonthDropDown";
import LeaveSubmissionModal from "../components/LeaveSubmissionModal";
import DeletionDialog from "../../../../components/DeletionDialog";
import { useLeavesByMonth, useDeleteLeave } from "../hooks/useLeave";
import { useEmployees } from "../../employees/hooks/useEmployees";
import useSyncStore from "../../../../../store/sync.store";

const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: -468px 0 }
  100% { background-position: 468px 0 }
}
`;

const Shimmer = ({
  width = "100%",
  height = "18px",
}: {
  width?: string;
  height?: string;
}) => (
  <Box
    borderRadius="6px"
    height={height}
    width={width}
    bg="gray.300"
    backgroundSize="400% 100%"
    animation="shimmer 1.4s ease infinite"
  />
);

const gridTemplate = `
1.8fr 1.6fr 1.6fr 1.5fr 1.5fr 1fr 1fr
`;

const EmployeeLeavePage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isConfirmationOpen,
    onOpen: onConfirmationOpen,
    onClose: onConfirmationClose,
  } = useDisclosure();

  const syncVersion = useSyncStore((store) => store.syncVersion);

  const [submissionMonth, setSubmissionMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [selectedLeave, setSelectedLeave] = useState<any | null>(null);

  /* =========================================================
     REACT QUERY
  ========================================================= */

  const {
    data: leaves = [],
    isLoading,
    isFetching,
    refetch,
  } = useLeavesByMonth(submissionMonth);

  const { data: employees = [] } = useEmployees();

  const deleteLeaveMutation = useDeleteLeave();

  useEffect(() => {
    if (syncVersion === undefined) return;

    refetch();
  }, [syncVersion, refetch]);

  /* =========================================================
     DELETE LEAVE
  ========================================================= */

  const handleLeaveDelete = async () => {
    if (!selectedLeave?._id) return;

    try {
      await deleteLeaveMutation.mutateAsync(selectedLeave._id);

      onConfirmationClose();
      setSelectedLeave(null);
    } catch (error) {
      console.error("AN ERROR OCCURRED WHILE DELETING LEAVE:", error);
    }
  };

  /* =========================================================
     DELETE CONFIRMATION
  ========================================================= */

  const handleDeleteConfirmation = (leave: any) => {
    setSelectedLeave(leave);
    onConfirmationOpen();
  };

  /* =========================================================
     LOADING UI
  ========================================================= */

  if (isLoading) {
    return (
      <>
        <Box as="style">{shimmerKeyframes}</Box>

        <VStack>
          {/* HEADER */}
          <Box
            position="relative"
            top="0.5rem"
            ml="3px"
            bg="gray.300"
            height="200px"
            width="80vw"
            borderRadius="20px"
            p={4}
          >
            <Shimmer width="200px" height="28px" />

            <Box mt={2}>
              <Shimmer width="320px" height="16px" />
            </Box>

            <Box position="absolute" right="8px" top="8px">
              <Shimmer width="220px" height="40px" />
            </Box>
          </Box>

          {/* TABLE HEADER */}
          <Grid
            templateColumns={gridTemplate}
            bg="gray.300"
            mt="0.5rem"
            ml="0.3rem"
            mr="0.3rem"
            height="66px"
            width="80vw"
            borderRadius="12px"
            px={6}
            alignItems="center"
          >
            {[...Array(7)].map((_, i) => (
              <Shimmer key={i} width="90%" height="18px" />
            ))}
          </Grid>

          {/* ROWS */}
          <Box height="90vh" width="80vw" overflow="hidden">
            {[...Array(6)].map((_, i) => (
              <Grid
                key={i}
                templateColumns={gridTemplate}
                bg="gray.300"
                borderBottom="1px solid #1E355A"
                alignItems="center"
                px={6}
                py={4}
              >
                <Shimmer width="140px" />
                <Shimmer width="120px" />
                <Shimmer width="120px" />
                <Shimmer width="120px" />
                <Shimmer width="90px" />
                <Shimmer width="80px" />

                <HStack>
                  <Shimmer width="30px" height="30px" />
                  <Shimmer width="30px" height="30px" />
                </HStack>
              </Grid>
            ))}
          </Box>

          {/* FOOTER */}
          <Box bg="gray.300" height="80px" width="80vw" mb="1rem" />
        </VStack>
      </>
    );
  }

  return (
    <>
      <Flex
        direction="column"
        bg="#F8FAFC"
        justify="space-between"
        width="100%"
        height="100%"
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <Flex ml="0.05rem" height="10rem" width="80vw">
          <Box>
            <HStack>
              <Text
                color="#1F2937"
                fontSize="clamp(1.3rem, 1vw + 0.8rem, 1.4rem)"
                fontWeight="700"
                ml="0.5rem"
                mt="1.3rem"
              >
                Congés
              </Text>

              <Button
                bg="transparent"
                isLoading={isFetching}
                color="gray.800"
                _hover={{ bg: "transparent" }}
                fontSize="1rem"
                position="relative"
                top="0.7rem"
                right="1rem"
                onClick={() => refetch()}
              >
                <FaSyncAlt />
              </Button>
            </HStack>

            <Text
              fontWeight="500"
              left="0.45rem"
              fontSize="clamp(1rem, 1vw + 0.8rem, 1rem)"
              color="gray.500"
              position="relative"
              bottom="0.5rem"
            >
              Gérez les demandes de congés
            </Text>
          </Box>

          <Spacer />

          <Button
            colorScheme="blue"
            size="md"
            onClick={onOpen}
            zIndex="1"
            mt="1rem"
            mr="1rem"
            _hover={{
              backgroundColor: "#4F46E5",
            }}
          >
            <Box mr="0.5rem">
              <FaCirclePlus size="1.2rem" />
            </Box>

            <Text>Soumettre une demande</Text>
          </Button>
        </Flex>

        {/* =====================================================
            MAIN AREA
        ===================================================== */}

        {leaves.length === 0 ? (
          <Box>
            <Text
              fontSize="2rem"
              fontStyle="revert"
              fontWeight="600"
              color="gray.600"
              position="relative"
              left="20rem"
            >
              Aucune demande de congé retrouvée
            </Text>
          </Box>
        ) : (
          <>
            {/* TABLE HEADER */}

            <Grid
              templateColumns={gridTemplate}
              fontWeight="600"
              bg="#F8F9FB"
              borderWidth="0.3px"
              border="1px solid #E2E8F0"
              boxShadow="0 2px 10px rgba(15,23,42,.06)"
              height="4.7rem"
              width="78.5vw"
              overflowY="hidden"
              overflowX="hidden"
              mt="0.3rem"
              ml="0.4rem"
            >
              <Text color="gray.800" fontSize="1.1rem" ml={8} mt={4}>
                Employé
              </Text>

              <Text color="gray.800" fontSize="1.1rem" mt={4}>
                Debut de congé
              </Text>

              <Text color="gray.800" fontSize="1.1rem" mt={4}>
                Fin de congé
              </Text>

              <Text mt={4} ml={2} color="gray.800" fontSize="1.1rem">
                Motif
              </Text>

              <Text color="gray.800" fontSize="1.1rem" mt={4}>
                Statut
              </Text>

              <Box mt="0.4rem" position="relative" right="1rem">
                <Text color="gray.800" fontSize="1.1rem">
                  Congés
                </Text>

                <Text color="gray.800" fontSize="1.1rem">
                  restants
                </Text>
              </Box>

              <Text color="gray.800" fontSize="1.1rem" mt={4}>
                Actions
              </Text>
            </Grid>

            {/* =================================================
                LEAVE ROWS
            ================================================= */}

            <Box height="80vh" overflowX="hidden" overflowY="auto">
              {leaves.map((leave: any) => (
                <EmployeeLeaveCard
                  key={leave._id}
                  leave={leave}
                  gridTemplate={gridTemplate}
                  onDelete={() => handleDeleteConfirmation(leave)}
                />
              ))}
            </Box>
          </>
        )}

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <Flex
          mb="3.2rem"
          ml="0.01rem"
          height="4rem"
          width="80vw"
          justify="space-between"
        >
          <Box
            mt="0.47rem"
            ml="1rem"
            fontSize="1.2rem"
            fontFamily="monospace"
            fontWeight="600"
          >
            <MonthDropDown onChange={(month) => setSubmissionMonth(month)} />
          </Box>
        </Flex>
      </Flex>

      {/* =======================================================
          LEAVE SUBMISSION
      ======================================================= */}

      <LeaveSubmissionModal
        isOpen={isOpen}
        onClose={onClose}
        onRefresh={() => refetch()}
        employees={employees}
      />

      {/* =======================================================
          DELETE CONFIRMATION
      ======================================================= */}

      <DeletionDialog
        isOpen={isConfirmationOpen}
        onClose={onConfirmationClose}
        onConfirmation={handleLeaveDelete}
        header="Supprimer"
        body="Êtes vous sur de vouloir supprimer cette demande?"
      />
    </>
  );
};

export default EmployeeLeavePage;
