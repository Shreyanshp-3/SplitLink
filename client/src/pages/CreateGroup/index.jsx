import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  ModalCloseButton,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { ViewIcon, ViewOffIcon, CopyIcon } from "@chakra-ui/icons";

//const BASE_URL = "http://localhost:8000/api";

const BASE_URL = import.meta.env.VITE_API_URL;

const CreateGroup = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [groupData, setGroupData] = useState(null);

  const [formData, setFormData] = useState({
    tripName: "",
    adminName: "",
    phone: "",
    adminPassword: "",
    confirmPassword: "",
  });

  const inviteLink = groupData
    ? `${window.location.origin}/join/${groupData.inviteCode}`
    : "";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    if (
      !formData.tripName ||
      !formData.adminName ||
      !formData.phone ||
      !formData.adminPassword ||
      !formData.confirmPassword
    ) {
      toast({
        title: "Missing Fields",
        description: "Please fill all fields.",
        status: "warning",
        duration: 2500,
        isClosable: true,
      });

      return false;
    }

    if (formData.phone.length !== 10) {
      toast({
        title: "Invalid Phone",
        description: "Phone number must be 10 digits.",
        status: "warning",
        duration: 2500,
      });

      return false;
    }

    if (formData.adminPassword.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password should contain at least 6 characters.",
        status: "warning",
        duration: 2500,
      });

      return false;
    }

    if (formData.adminPassword !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        status: "error",
        duration: 2500,
      });

      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const response = await axios.post(`${BASE_URL}/groups`, {
        tripName: formData.tripName,
        adminName: formData.adminName,
        phone: formData.phone,
        adminPassword: formData.adminPassword,
      });

      if (response.data.success) {
        const createdGroup = response.data.data;

        setGroupData(createdGroup);

        if (!createdGroup?.tripName || !createdGroup?.inviteCode) {
          console.log("Create group API response:", response);
        }

        onOpen();

        setFormData({
          tripName: "",
          adminName: "",
          phone: "",
          adminPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description:
          error.response?.data?.message || "Unable to create group",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);

      toast({
        title: "Copied!",
        description: "Invite link copied to clipboard.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Unable to copy",
        description: "Please copy the invite link manually.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Container maxW="container.md" py={14}>
        <Card shadow="lg" borderRadius="2xl">
          <CardBody p={10}>
            <VStack spacing={8} align="stretch">
              <Box textAlign="center">
                <Heading size="lg">
                  Create New Group
                </Heading>

                <Text mt={2} color="gray.500">
                  Create a trip and invite your friends using an invite link.
                </Text>
              </Box>

              <FormControl>
                <FormLabel>Trip Name</FormLabel>

                <Input
                  placeholder="Goa Trip 2026"
                  name="tripName"
                  value={formData.tripName}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Admin Name</FormLabel>

                <Input
                  placeholder="Your Name"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Phone Number</FormLabel>

                <Input
                  placeholder="9876543210"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Password</FormLabel>

                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="adminPassword"
                    value={formData.adminPassword}
                    onChange={handleChange}
                  />

                  <InputRightElement>
                    <IconButton
                      size="sm"
                      variant="ghost"
                      icon={
                        showPassword ? (
                          <ViewOffIcon />
                        ) : (
                          <ViewIcon />
                        )
                      }
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel>Confirm Password</FormLabel>

                <InputGroup>
                  <Input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />

                  <InputRightElement>
                    <IconButton
                      size="sm"
                      variant="ghost"
                      icon={
                        showConfirmPassword ? (
                          <ViewOffIcon />
                        ) : (
                          <ViewIcon />
                        )
                      }
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                colorScheme="blue"
                size="lg"
                isLoading={loading}
                loadingText="Creating..."
                onClick={handleSubmit}
              >
                Create Group
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </Container>

      {/* Success Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />

        <ModalContent borderRadius="2xl">
          <ModalHeader>🎉 Group Created Successfully</ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={5} align="stretch">
              <Box>
                <Text fontSize="sm" color="gray.500">
                  Trip Name
                </Text>
<Text
  fontWeight="bold"
  fontSize="lg"
  color="gray.800"
>
  {groupData?.tripName}
</Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.500">
                  Invite Code
                </Text>

                <Text
                  fontWeight="bold"
                  fontSize="2xl"
                  color="gray.800"
                  letterSpacing="2px"
                >
                  {groupData?.inviteCode}
                </Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.500" mb={2}>
                  Invite Link
                </Text>

                <Flex gap={2}>
                  <Input
                    value={inviteLink}
                    isReadOnly
                    color="gray.800"
                  />

                  <Button
                    leftIcon={<CopyIcon />}
                    onClick={handleCopy}
                  >
                    Copy
                  </Button>
                </Flex>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              w="full"
              onClick={() => {
                onClose();

                if (groupData?.inviteCode) {
                  navigate(`/dashboard/${groupData.inviteCode}`);
                }
              }}
            >
              Continue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateGroup;
