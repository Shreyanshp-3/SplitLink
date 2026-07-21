import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardBody,
  Container,
  Heading,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";

const BASE_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const { inviteCode } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    if (!inviteCode) {
      setError("Invite code is missing.");
      setLoading(false);
      return;
    }

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${BASE_URL}/groups/${inviteCode}/`
        );

        if (response.data.success) {
          setDashboard(response.data.data);
        } else {
          setError(response.data.message || "Unable to load dashboard.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [inviteCode]);

  if (loading) {
    return (
      <Container maxW="container.md" py={14} textAlign="center">
        <Spinner size="xl" color="blue.500" />
        <Text mt={4} color="gray.500">
          Loading dashboard...
        </Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.md" py={14}>
        <Heading size="md" mb={2}>
          Something went wrong
        </Heading>
        <Text color="red.500">{error}</Text>
      </Container>
    );
  }

  const adminName = dashboard?.members?.[0]?.name || "—";
  const membersCount = dashboard?.summary?.totalMembers ?? 0;
  const expensesCount = dashboard?.summary?.totalExpenses ?? 0;
  const totalExpenses = dashboard?.summary?.totalGroupExpense ?? 0;

  return (
    <Container maxW="container.md" py={14}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Dashboard</Heading>

        <Card shadow="md" borderRadius="xl">
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontSize="sm" color="gray.500">
                  Group Name (Trip Name)
                </Text>
                <Text fontWeight="bold" fontSize="lg">
                  {dashboard?.tripName || "—"}
                </Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.500">
                  Invite Code
                </Text>
                <Text fontWeight="bold" letterSpacing="1px">
                  {inviteCode || "—"}
                </Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.500">
                  Group ID
                </Text>
                <Text fontWeight="medium" fontSize="sm">
                  {dashboard?.groupId || "—"}
                </Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.500">
                  Admin Name
                </Text>
                <Text fontWeight="medium">{adminName}</Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.500">
                  Admin Phone
                </Text>
                <Text fontWeight="medium">—</Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.500">
                  Created Date
                </Text>
                <Text fontWeight="medium">—</Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.500">
                  Members Count
                </Text>
                <Text fontWeight="medium">{membersCount}</Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.500">
                  Expenses Count
                </Text>
                <Text fontWeight="medium">{expensesCount}</Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.500">
                  Total Expenses
                </Text>
                <Text fontWeight="bold" fontSize="lg">
                  {totalExpenses}
                </Text>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default Dashboard;
