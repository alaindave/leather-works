import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  VStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import type { Reminder } from '../hooks/useReminders';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReminder: (note: string, scheduledTime: Date) => void;
  reminders?: Reminder[];
}

const ReminderModal = ({
  isOpen,
  onClose,
  onAddReminder,
  reminders = [],
}: ReminderModalProps) => {
  const [note, setNote] = useState('');
  const [dateTime, setDateTime] = useState('');
  const toast = useToast();

  const handleAddReminder = () => {
    if (!note.trim()) {
      toast({
        title: 'Note required',
        description: 'Please enter a note',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!dateTime) {
      toast({
        title: 'Date and time required',
        description: 'Please select a date and time',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const scheduledTime = new Date(dateTime);
    const now = new Date();

    if (scheduledTime <= now) {
      toast({
        title: 'Invalid time',
        description: 'Please select a future date and time',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    onAddReminder(note, scheduledTime);
    setNote('');
    setDateTime('');
    toast({
      title: 'Reminder set',
      description: `Reminder will trigger at ${scheduledTime.toLocaleString()}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  const getMinDateTime = (): string => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="#faf8f3">
        <ModalHeader color="#262626" fontWeight="700">
          Set Note Reminder
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text color="#262626" fontWeight="600" mb={2}>
                Note
              </Text>
              <Textarea
                placeholder="Enter your note here..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                minH="100px"
                borderColor="#c39409"
                _focus={{ borderColor: '#c39409', boxShadow: '0 0 0 1px #c39409' }}
                color="#262626"
              />
            </Box>
            <Box>
              <Text color="#262626" fontWeight="600" mb={2}>
                Date and Time
              </Text>
              <Input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                min={getMinDateTime()}
                borderColor="#c39409"
                _focus={{ borderColor: '#c39409', boxShadow: '0 0 0 1px #c39409' }}
                color="#262626"
              />
            </Box>

            {reminders.length > 0 && (
              <Box bg="#f0ede7" p={3} borderRadius="8px">
                <Text color="#262626" fontWeight="600" mb={2}>
                  Active Reminders ({reminders.length})
                </Text>
                <VStack align="start" spacing={2}>
                  {reminders.map((reminder) => (
                    <Box key={reminder.id} fontSize="sm" color="#5a4a42">
                      <Text fontWeight="500">{reminder.note}</Text>
                      <Text fontSize="xs" color="#8a7a72">
                        {new Date(reminder.scheduledTime).toLocaleString()}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter gap={3}>
          <Button
            variant="ghost"
            onClick={onClose}
            color="#262626"
            _hover={{ bg: '#e8e3dd' }}
          >
            Cancel
          </Button>
          <Button
            bg="#c39409"
            color="white"
            onClick={handleAddReminder}
            _hover={{ bg: '#b0821f' }}
          >
            Set Reminder
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReminderModal;
