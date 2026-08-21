import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { FaSyncAlt } from "react-icons/fa";

export default function SyncButton() {
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    try {
      setLoading(true);
      const result = await window.electron.sync();
      if (result.success) {
        console.log("Sync completed");
      } else {
        console.error(result.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      bg="transparent"
      onClick={handleSync}
      isLoading={loading}
      color="gray.800"
      _hover={{ bg: "transparent" }}
      fontSize="1.1rem"
    >
      <FaSyncAlt />
    </Button>
  );
}
