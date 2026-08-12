import {
  Box,
  Flex,
  Text,
  HStack,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { FaSyncAlt } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import Task from "../../common/types/Task";
import useAdminUser from "../../store/auth.store";
import TaskTable from "../components/tasks/TaskTable";
import TaskSubmissionModal from "../components/tasks/TaskSubmissionModal";
import AdminUser from "../../common/types/AdminUser";

const TaskPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [adminUsersList, setAdminUsersList] = useState<AdminUser[]>([]);
  const user = useAdminUser((store) => store.adminUser);

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  useEffect(() => {
    loadTasks();
    loadAdminUsers();
  }, []);

  const loadTasks = async () => {
    try {
      const tasks = await window.electron.tasks.getAll();
      console.log("FETCHED TASKS", tasks);
      setTasks(tasks);
    } catch (error) {
      console.log("AN ERROR OCCURED WHILE FETCHING LOADING TASKS:", error);
    }
  };

  const loadAdminUsers = async () => {
    try {
      const admin_users = await window.electron.adminUsers.getAll();
      setAdminUsersList(admin_users);
    } catch (error) {
      console.log("AN ERROR OCCURED WHILE FETCHING ADMIN USERS:", error);
    }
  };
  //refresh tasks
  const handleTaskRefresh = async () => {
    try {
      await loadTasks();
    } catch (error) {
      console.log("AN ERROR OCCURED WHILE FETCHING TASKS:", error);
    }
  };

  const handleTaskSync = async () => {
    try {
      setLoading(true);
      const result = await window.electron.sync();
      if (result.success) {
        console.log("SYNC COMPLETED");
        loadTasks();
      } else {
        console.error(result.message);
      }
    } catch (e) {
      console.error("AN ERROR OCCURED WHILE SYNCING");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex direction="column" width="100%">
      <Flex width="100%" justify="space-between">
        <Box>
          <HStack>
            <Text
              color="#1F2937"
              fontSize="clamp(1.3rem, 1vw + 0.8rem, 1.4rem)"
              fontWeight="700"
              ml="1rem"
              mt="0.7rem"
            >
              Taches
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
              onClick={handleTaskSync}
            >
              <FaSyncAlt />
            </Button>
          </HStack>
          <Text
            fontWeight="500"
            fontSize="clamp(1rem, 1vw + 0.8rem, 1.1rem)"
            color="gray.500"
            position="relative"
            bottom="1.4rem"
            left="1rem"
          >
            Gérez les taches
          </Text>
        </Box>
        <Button
          mt="1rem"
          mr="1rem"
          colorScheme="blue"
          onClick={() => onCreateOpen()}
        >
          Créer une nouvelle tache
        </Button>
      </Flex>
      <Box mt="3rem" ml="2rem">
        <TaskTable tasks={tasks} />
      </Box>
      <TaskSubmissionModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onRefresh={handleTaskRefresh}
        adminUsersList={adminUsersList}
        author={user}
      />
    </Flex>
  );
};

export default TaskPage;
