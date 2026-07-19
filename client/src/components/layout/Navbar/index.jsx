import {
  Box,
  Flex,
  Text,
  Link,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const colors = {
  surface: "#0B1120",
  onSurface: "#e6e0e9",
  onSurfaceVariant: "#cbc4d2",
  primary: "#3B82F6",
  outlineVariant: "#494551",
};

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <Box
      as="nav"
      position="fixed"
      top={0}
      w="full"
      zIndex={50}
      bg="rgba(11, 17, 32, 0.8)"
      backdropFilter="blur(16px)"
      borderBottom="1px solid rgba(255, 255, 255, 0.08)"
      boxShadow="0 1px 0 rgba(255, 255, 255, 0.02)"
    >
      <Flex
        justify="space-between"
        align="center"
        maxW="7xl"
        mx="auto"
        px={{ base: "16px", md: "24px" }}
        py="14px"
      >
        {/* Logo */}
        <Text
          fontSize="24px"
          fontWeight="600"
          color={colors.onSurface}
          cursor="pointer"
          onClick={() => navigate("/")}
        >
          SplitLink
        </Text>

        {/* Navigation Links */}
        <HStack
          spacing="32px"
          display={{ base: "none", md: "flex" }}
          align="center"
        >
          <Link
            href="#features"
            fontSize="16px"
            color={colors.onSurfaceVariant}
            _hover={{ color: colors.primary }}
            transition="all 0.3s"
          >
            Features
          </Link>

          <Link
            href="#how-it-works"
            fontSize="16px"
            color={colors.onSurfaceVariant}
            _hover={{ color: colors.primary }}
            transition="all 0.3s"
          >
            How it Works
          </Link>

          <Link
            href="#"
            fontSize="16px"
            color={colors.onSurfaceVariant}
            _hover={{ color: colors.primary }}
            transition="all 0.3s"
          >
            GitHub
          </Link>
        </HStack>

        {/* Launch App Button */}
        <Button
          bg={colors.primary}
          color="white"
          minH="40px"
          px={{ base: "20px", md: "24px" }}
          borderRadius="full"
          fontSize="14px"
          fontWeight="500"
          _active={{ transform: "scale(0.98)" }}
          _hover={{
            filter: "brightness(1.1)",
            transform: "translateY(-1px)",
          }}
          transition="transform 0.2s ease, filter 0.2s ease"
          onClick={() => navigate("/create-group")}
        >
          Launch App
        </Button>
      </Flex>
    </Box>
  );
}