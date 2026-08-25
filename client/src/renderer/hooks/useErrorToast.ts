import { useToast } from "@chakra-ui/react";

const formatErrorMessage = (error: Error | string): string => {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : "Une erreur est survenue.";

  const ipcErrorPrefix = /^Error invoking remote method '[^']+':\s*Error:\s*/;

  const cleanedMessage = message.replace(ipcErrorPrefix, "").trim();

  if (cleanedMessage.includes("SQLITE_ERROR")) {
    return "Une erreur est survenue. Veuillez contacter ADB Tech.";
  }

  return cleanedMessage;
};

export const useErrorToast = () => {
  const toast = useToast();

  const showErrorMessage = (
    title: string,
    error: unknown,
    fallbackMessage: string
  ) => {
    console.error(title, error);

    const message =
      error instanceof Error || typeof error === "string"
        ? formatErrorMessage(error)
        : fallbackMessage;

    toast({
      title,
      description: message,
      status: "error",
      duration: 3500,
      isClosable: true,
      position: "top-left",
    });
  };

  return showErrorMessage;
};
