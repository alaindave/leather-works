import { useToast } from "@chakra-ui/react";

const toast = useToast();

toast({
  title: "Success",
  status: "success",
});
