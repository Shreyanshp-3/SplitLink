import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  VStack,
  HStack,
  Grid,
  GridItem,
  Input,
  Link,
} from "@chakra-ui/react";

const colors = {
  surface: "#0B1120",
  surfaceContainerLow: "#1E293B",
  onSurface: "#e6e0e9",
  onSurfaceVariant: "#cbc4d2",
  outlineVariant: "#494551",
  primary: "#3B82F6",
  secondary: "#cdc0e9",
  tertiary: "#e7c365",
  error: "#ffb4ab",
  success: "#4ade80",
};

const MaterialIcon = ({ name, ...props }) => (
  <Box as="span" className="material-symbols-outlined" {...props}>
    {name}
  </Box>
);

export default function Hero() {
  return (
    <>
      {/* ============ HERO SECTION ============ */}
      <Box
        as="section"
        position="relative"
        pt={{ base: "112px", md: "128px" }}
        pb={{ base: "40px", md: "56px" }}
        overflow="hidden"
        minH="100vh"
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        px={{ base: "16px", md: "24px" }}
      >
        <Box
          position="absolute"
          top="34%"
          left="50%"
          transform="translate(-50%, -50%)"
          w={{ base: "420px", md: "600px" }}
          h={{ base: "420px", md: "600px" }}
          bg="radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 70%)"
          zIndex={0}
          pointerEvents="none"
        />

        <VStack maxW="4xl" w="full" mx="auto" zIndex={1} spacing={{ base: "20px", md: "24px" }}>
          <Text
            display="inline-block"
            px="16px"
            py="4px"
            borderRadius="full"
            bg="rgba(59, 130, 246, 0.1)"
            color={colors.primary}
            fontSize="12px"
            fontWeight="600"
            border="1px solid rgba(59, 130, 246, 0.2)"
          >
            Now in Private Beta
          </Text>

          <Heading
            as="h1"
            fontSize={{ base: "36px", sm: "42px", md: "52px" }}
            lineHeight="1.08"
            letterSpacing="-0.04em"
            fontWeight="700"
            color="white"
          >
            Split expenses, <Box as="br" display={{ base: "none", md: "inline" }} /> without the headache.
          </Heading>

          <Text
            fontSize={{ base: "16px", md: "18px" }}
            lineHeight="1.65"
            letterSpacing="-0.01em"
            color={colors.onSurfaceVariant}
            maxW="2xl"
            mx="auto"
          >
            SplitLink is the high-performance ledger for modern teams and households.
            Track shared costs with millisecond precision and automated settlement workflows.
          </Text>

          <Flex direction={{ base: "column", sm: "row" }} gap="12px" justify="center" w={{ base: "full", sm: "auto" }}>
            <Button
              bg={colors.primary}
              color="white"
              minH="52px"
              px="32px"
              w={{ base: "full", sm: "auto" }}
              borderRadius="full"
              fontSize="14px"
              fontWeight="500"
              boxShadow="0 10px 15px -3px rgba(59,130,246,0.2)"
              _hover={{ filter: "brightness(1.1)", transform: "translateY(-1px)" }}
              transition="transform 0.2s ease, filter 0.2s ease"
            >
              Get Started Free
            </Button>
            <Button
              bg={colors.surfaceContainerLow}
              color="#e6e0e9"
              minH="52px"
              px="32px"
              w={{ base: "full", sm: "auto" }}
              borderRadius="full"
              fontSize="14px"
              fontWeight="500"
              border="1px solid"
              borderColor={colors.outlineVariant}
              _hover={{ bg: "#211f24", transform: "translateY(-1px)" }}
              transition="transform 0.2s ease, background 0.2s ease"
            >
              View Demo
            </Button>
          </Flex>
        </VStack>

        {/* Dashboard Preview */}
        <Box mt={{ base: "48px", md: "64px" }} w="full" maxW="6xl" mx="auto" px={{ base: 0, md: "24px" }} zIndex={1}>
          <Box
            bg="rgba(30, 41, 59, 0.7)"
            backdropFilter="blur(16px)"
            border="1px solid rgba(255, 255, 255, 0.1)"
            boxShadow="0 18px 40px rgba(0, 0, 0, 0.24)"
            borderRadius="xl"
            p={{ base: "12px", md: "16px" }}
            overflow="hidden"
            transition="transform 0.3s ease, box-shadow 0.3s ease"
            _hover={{ transform: "scale(1.01)", boxShadow: "0 22px 48px rgba(0, 0, 0, 0.3)" }}
          >
            <Flex align="center" gap="8px" mb="16px" px="8px">
              <Box w="12px" h="12px" borderRadius="full" bg="rgba(255,180,171,0.4)" />
              <Box w="12px" h="12px" borderRadius="full" bg="rgba(231,195,101,0.4)" />
              <Box w="12px" h="12px" borderRadius="full" bg="rgba(59,130,246,0.4)" />
              <HStack ml="auto" spacing="16px">
                <Box h="24px" w="128px" borderRadius="4px" bg="rgba(148,142,156,0.2)" />
                <Box h="24px" w="24px" borderRadius="full" bg="rgba(148,142,156,0.3)" />
              </HStack>
            </Flex>

            <Box
              display="grid"
              gridTemplateColumns={{ base: "1fr", md: "repeat(12, 1fr)" }}
              gap={{ base: "12px", md: "24px" }}
              h={{ base: "auto", md: "500px" }}
            >
              <VStack gridColumn={{ md: "span 3" }} spacing="8px" align="stretch">
                <Box h="40px" w="full" borderRadius="4px" bg="rgba(59,130,246,0.1)" border="1px solid rgba(59,130,246,0.2)" />
                <Box h="40px" w="full" borderRadius="4px" bg="rgba(148,142,156,0.1)" />
                <Box h="40px" w="full" borderRadius="4px" bg="rgba(148,142,156,0.1)" />
                <Box mt="auto" h="96px" w="full" borderRadius="lg" bg="rgba(43,41,47,0.4)" p="16px">
                  <Box h="8px" w="75%" bg="rgba(203,196,210,0.3)" borderRadius="4px" mb="4px" />
                  <Box h="8px" w="50%" bg="rgba(203,196,210,0.2)" borderRadius="4px" />
                </Box>
              </VStack>

              <Box
                gridColumn={{ md: "span 9" }}
                display="grid"
                gridTemplateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                gap="16px"
              >
                <Box
                  gridColumn={{ md: "span 2" }}
                  borderRadius="lg"
                  bg="rgba(33,31,36,0.5)"
                  border="1px solid"
                  borderColor={colors.outlineVariant}
                  p={{ base: "16px", md: "24px" }}
                  position="relative"
                  overflow="hidden"
                >
                  <Flex justify="space-between" align="flex-start" mb="32px">
                    <Box>
                      <Text fontSize="12px" textTransform="uppercase" color={colors.onSurfaceVariant}>
                        Total Balance
                      </Text>
                      <Heading fontSize="32px" color="white">$4,280.50</Heading>
                    </Box>
                    <MaterialIcon name="insights" color={colors.primary} fontSize="30px" />
                  </Flex>

                  <VStack spacing="16px" align="stretch">
                    <Flex
                      justify="space-between"
                      align="center"
                      p="16px"
                      bg="rgba(11,17,32,0.4)"
                      borderRadius="lg"
                      border="1px solid"
                      borderColor="rgba(73,69,81,0.5)"
                    >
                      <HStack spacing="16px">
                        <Flex w="32px" h="32px" borderRadius="full" bg="rgba(231,195,101,0.2)" align="center" justify="center">
                          <MaterialIcon name="shopping_cart" color={colors.tertiary} fontSize="14px" />
                        </Flex>
                        <Box>
                          <Text fontSize="14px">Weekly Groceries</Text>
                          <Text fontSize="10px" color={colors.onSurfaceVariant}>Today, 2:45 PM</Text>
                        </Box>
                      </HStack>
                      <Text fontSize="14px" color={colors.error}>-$142.00</Text>
                    </Flex>

                    <Flex
                      justify="space-between"
                      align="center"
                      p="16px"
                      bg="rgba(11,17,32,0.4)"
                      borderRadius="lg"
                      border="1px solid"
                      borderColor="rgba(73,69,81,0.5)"
                    >
                      <HStack spacing="16px">
                        <Flex w="32px" h="32px" borderRadius="full" bg="rgba(59,130,246,0.2)" align="center" justify="center">
                          <MaterialIcon name="home" color={colors.primary} fontSize="14px" />
                        </Flex>
                        <Box>
                          <Text fontSize="14px">Monthly Rent</Text>
                          <Text fontSize="10px" color={colors.onSurfaceVariant}>Yesterday</Text>
                        </Box>
                      </HStack>
                      <Text fontSize="14px" color={colors.error}>-$1,800.00</Text>
                    </Flex>
                  </VStack>
                </Box>

                <Box
                  borderRadius="lg"
                  bg="rgba(33,31,36,0.3)"
                  border="1px solid"
                  borderColor={colors.outlineVariant}
                  p={{ base: "16px", md: "24px" }}
                  display="flex"
                  flexDir="column"
                  justifyContent="space-between"
                >
                  <Box>
                    <Text fontSize="12px" textTransform="uppercase" color={colors.onSurfaceVariant} mb="16px">
                      Members
                    </Text>
                    <HStack spacing="0">
                      <Flex w="40px" h="40px" borderRadius="full" bg="rgba(59,130,246,0.4)" border="2px solid" borderColor={colors.surface} align="center" justify="center" fontSize="14px">JD</Flex>
                      <Flex ml="-8px" w="40px" h="40px" borderRadius="full" bg="rgba(205,192,233,0.4)" border="2px solid" borderColor={colors.surface} align="center" justify="center" fontSize="14px">AM</Flex>
                      <Flex ml="-8px" w="40px" h="40px" borderRadius="full" bg="rgba(231,195,101,0.4)" border="2px solid" borderColor={colors.surface} align="center" justify="center" fontSize="14px">SK</Flex>
                    </HStack>
                  </Box>
                  <Box pt="24px" borderTop="1px solid" borderColor="rgba(73,69,81,0.3)">
                    <Text fontSize="12px" color={colors.onSurfaceVariant} mb="4px">Next Settlement</Text>
                    <Text fontSize="16px" color="white">Aug 15th, 2024</Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ============ BENTO FEATURES GRID ============ */}
      <Box as="section" py="64px" px="24px" maxW="7xl" mx="auto" id="features">
        <Box textAlign="center" mb="64px">
          <Heading fontSize="32px" color="white" mb="16px">
            Built for the modern ledger.
          </Heading>
          <Text fontSize="16px" color={colors.onSurfaceVariant} maxW="xl" mx="auto">
            Engineered to handle complex splits, multi-currency conversions, and instant
            settlements without breaking a sweat.
          </Text>
        </Box>

        <Grid
          templateColumns={{ base: "1fr", md: "repeat(12, 1fr)" }}
          gap="24px"
          sx={{ gridAutoRows: "280px" }}
        >
          {/* Big Feature */}
          <GridItem
            colSpan={{ md: 8 }}
            bg="rgba(30, 41, 59, 0.7)"
            backdropFilter="blur(12px)"
            border="1px solid rgba(255, 255, 255, 0.08)"
            borderRadius="xl"
            p="32px"
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            position="relative"
            overflow="hidden"
            role="group"
          >
            <Box
              position="absolute"
              top={0}
              right={0}
              p="32px"
              opacity={0.2}
              _groupHover={{ opacity: 0.4 }}
              transition="opacity 0.3s"
            >
              <MaterialIcon name="account_balance_wallet" fontSize="120px" color={colors.primary} />
            </Box>
            <Box position="relative" zIndex={10}>
              <MaterialIcon name="sync_alt" color={colors.primary} display="block" mb="16px" />
              <Heading fontSize="24px" color="white" mb="8px">Real-time Synchronization</Heading>
              <Text fontSize="16px" color={colors.onSurfaceVariant} maxW="md">
                Every transaction is synced across all devices instantly. No more "I thought
                you paid" conversations.
              </Text>
            </Box>
          </GridItem>

          {/* Small Feature */}
          <GridItem
            colSpan={{ md: 4 }}
            bg="rgba(30, 41, 59, 0.7)"
            backdropFilter="blur(12px)"
            border="1px solid rgba(255, 255, 255, 0.08)"
            borderRadius="xl"
            p="32px"
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            role="group"
          >
            <Flex
              w="64px"
              h="64px"
              borderRadius="full"
              bg="rgba(231,195,101,0.1)"
              align="center"
              justify="center"
              mb="24px"
              transition="transform 0.3s"
              _groupHover={{ transform: "scale(1.1)" }}
            >
              <MaterialIcon name="shield" color={colors.tertiary} fontSize="30px" />
            </Flex>
            <Heading fontSize="24px" color="white" mb="8px">Bank-Grade Security</Heading>
            <Text fontSize="16px" color={colors.onSurfaceVariant}>
              Your data is encrypted with AES-256 at rest and TLS 1.3 in transit.
            </Text>
          </GridItem>

          {/* Feature 3 */}
          <GridItem
            colSpan={{ md: 4 }}
            bg="rgba(30, 41, 59, 0.7)"
            backdropFilter="blur(12px)"
            border="1px solid rgba(255, 255, 255, 0.08)"
            borderRadius="xl"
            p="32px"
            display="flex"
            flexDir="column"
            justifyContent="space-between"
          >
            <MaterialIcon name="currency_exchange" color={colors.secondary} fontSize="30px" />
            <Box>
              <Heading fontSize="24px" color="white" mb="8px">160+ Currencies</Heading>
              <Text fontSize="16px" color={colors.onSurfaceVariant}>
                Automated exchange rates updated every 60 seconds.
              </Text>
            </Box>
          </GridItem>

          {/* Feature 4 */}
          <GridItem
            colSpan={{ md: 8 }}
            bg="rgba(30, 41, 59, 0.7)"
            backdropFilter="blur(12px)"
            border="1px solid rgba(255, 255, 255, 0.08)"
            borderRadius="xl"
            p="32px"
            display="flex"
            flexDir="column"
            justifyContent="center"
            position="relative"
            overflow="hidden"
          >
            <Flex direction={{ base: "column", md: "row" }} align="center" gap="32px">
              <Box flex="1">
                <Heading fontSize="24px" color="white" mb="8px">Smart Expense Detection</Heading>
                <Text fontSize="16px" color={colors.onSurfaceVariant}>
                  Snap a photo of any receipt, and our AI will automatically parse the items
                  and suggest splits.
                </Text>
              </Box>
              <Box
                w={{ base: "full", md: "33%" }}
                bg="rgba(11,17,32,0.5)"
                border="1px solid"
                borderColor={colors.outlineVariant}
                borderRadius="lg"
                p="16px"
              >
                <HStack spacing="8px" mb="8px">
                  <Box w="8px" h="8px" borderRadius="full" bg={colors.primary} />
                  <Box h="8px" w="80px" bg="rgba(203,196,210,0.2)" borderRadius="4px" />
                </HStack>
                <VStack spacing="8px" align="stretch">
                  <Box h="6px" w="full" bg="rgba(203,196,210,0.1)" borderRadius="4px" />
                  <Box h="6px" w="full" bg="rgba(203,196,210,0.1)" borderRadius="4px" />
                  <Box h="6px" w="66%" bg="rgba(203,196,210,0.1)" borderRadius="4px" />
                </VStack>
              </Box>
            </Flex>
          </GridItem>
        </Grid>
      </Box>

      {/* ============ TIMELINE / HOW IT WORKS ============ */}
      <Box as="section" py="64px" bg="rgba(30, 41, 59, 0.3)" id="how-it-works">
        <Box maxW="7xl" mx="auto" px="24px">
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="64px" alignItems="center">
            {/* Steps */}
            <Box>
              <Heading fontSize="32px" color="white" mb="32px">
                The workflow you've always wanted.
              </Heading>
              <Box position="relative">
                <VStack spacing="32px" align="stretch" position="relative">
                  {/* Connecting Line */}
                  <Box
                    position="absolute"
                    left="19px"
                    top="16px"
                    bottom="16px"
                    w="2px"
                    bgGradient={`linear(to-b, ${colors.primary}, ${colors.secondary}, transparent)`}
                  />

                  <Flex gap="24px" position="relative">
                    <Flex
                      zIndex={10}
                      w="40px"
                      h="40px"
                      borderRadius="full"
                      bg={colors.primary}
                      align="center"
                      justify="center"
                      flexShrink={0}
                      boxShadow="lg"
                    >
                      <MaterialIcon name="group_add" color="white" fontSize="14px" />
                    </Flex>
                    <Box>
                      <Heading fontSize="24px" color="white" mb="4px">Create a Group</Heading>
                      <Text fontSize="16px" color={colors.onSurfaceVariant}>
                        Invite friends via email or a secure magic link. No sign-up required
                        for participants to view balances.
                      </Text>
                    </Box>
                  </Flex>

                  <Flex gap="24px" position="relative">
                    <Flex
                      zIndex={10}
                      w="40px"
                      h="40px"
                      borderRadius="full"
                      bg={colors.secondary}
                      align="center"
                      justify="center"
                      flexShrink={0}
                      boxShadow="lg"
                    >
                      <MaterialIcon name="add_shopping_cart" color="white" fontSize="14px" />
                    </Flex>
                    <Box>
                      <Heading fontSize="24px" color="white" mb="4px">Log Expenses</Heading>
                      <Text fontSize="16px" color={colors.onSurfaceVariant}>
                        Quick-add costs as they happen. Categorize with tags and attach
                        digital receipts for transparency.
                      </Text>
                    </Box>
                  </Flex>

                  <Flex gap="24px" position="relative">
                    <Flex
                      zIndex={10}
                      w="40px"
                      h="40px"
                      borderRadius="full"
                      bg={colors.tertiary}
                      align="center"
                      justify="center"
                      flexShrink={0}
                      boxShadow="lg"
                    >
                      <MaterialIcon name="payments" color="white" fontSize="14px" />
                    </Flex>
                    <Box>
                      <Heading fontSize="24px" color="white" mb="4px">Settle Instantly</Heading>
                      <Text fontSize="16px" color={colors.onSurfaceVariant}>
                        One-tap settlement via Venmo, Revolut, or PayPal. SplitLink handles
                        the math for "who owes whom".
                      </Text>
                    </Box>
                  </Flex>
                </VStack>
              </Box>
            </Box>

            {/* Preview card */}
            <Box position="relative">
              <Box
                bg="rgba(30, 41, 59, 0.7)"
                backdropFilter="blur(12px)"
                border="1px solid rgba(255, 255, 255, 0.08)"
                borderRadius="2xl"
                p="32px"
                transform="rotate(3deg)"
                transition="transform 0.5s"
                _hover={{ transform: "rotate(0deg)" }}
              >
                <Box
                  aspectRatio="1"
                  bgSize="cover"
                  bgPosition="center"
                  borderRadius="xl"
                  filter="grayscale(1)"
                  transition="all 0.7s"
                  _hover={{ filter: "grayscale(0)" }}
                  bgImage="url('https://lh3.googleusercontent.com/aida-public/AB6AXuBSwhcDGfW06BodgzZocsGs4oJPjh7-ehyrEUn6yaOaeiieXKd3JSWqIv60trrD8dEBm-ibo6GE2aMahsvqC1SWXR4FMZQBlydc83VpInzx66w49-BqCuMfHk0XxkMZEvrbVMUf5xzFk85J-3-KNYf-bYRl_XpgpPwi0PQt45Yaxd-k2AZltdgFAlgbN-qxVSyHv0FO0Te7ul6IM7A6DXjkgbB0WdrlpGft3u3RJfuj6jafXrjum9E')"
                />
                <Flex mt="24px" justify="space-between" align="center">
                  <Box>
                    <Text fontSize="14px" color={colors.onSurfaceVariant}>Monthly Dinner Group</Text>
                    <Heading fontSize="24px" color="white">All Settled</Heading>
                  </Box>
                  <Box
                    bg="rgba(74,222,128,0.2)"
                    color={colors.success}
                    px="16px"
                    py="4px"
                    borderRadius="full"
                    border="1px solid rgba(74,222,128,0.3)"
                    fontSize="12px"
                  >
                    <HStack spacing="4px">
                      <MaterialIcon name="check_circle" fontSize="14px" />
                      <Text>Verified</Text>
                    </HStack>
                  </Box>
                </Flex>
              </Box>

              {/* Floating notification */}
              <Box
                position="absolute"
                bottom="-32px"
                left="-32px"
                bg="rgba(30, 41, 59, 0.7)"
                backdropFilter="blur(12px)"
                border="1px solid rgba(255, 255, 255, 0.08)"
                p="16px"
                borderRadius="lg"
                display={{ base: "none", md: "block" }}
                boxShadow="xl"
              >
                <HStack spacing="16px">
                  <Flex w="32px" h="32px" borderRadius="full" bg="rgba(59,130,246,0.2)" align="center" justify="center">
                    <MaterialIcon name="notifications_active" color={colors.primary} fontSize="14px" />
                  </Flex>
                  <Text fontSize="14px" color="white">Alex paid you $45.20</Text>
                </HStack>
              </Box>
            </Box>
          </Grid>
        </Box>
      </Box>

      {/* ============ FOOTER ============ */}
      <Box as="footer" bg={colors.surface} borderTop="1px solid" borderColor={colors.outlineVariant}>
        <Grid
          templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(7, 1fr)" }}
          gap="16px"
          maxW="7xl"
          mx="auto"
          px="24px"
          py="64px"
        >
          <GridItem colSpan={{ base: 2, md: 1, lg: 2 }}>
            <Heading fontSize="24px" color="white" mb="16px">SplitLink</Heading>
            <Text fontSize="14px" color={colors.onSurfaceVariant} maxW="xs" mb="24px">
              The premium ledger for the modern era.
            </Text>
            <HStack spacing="16px">
              <Link color={colors.onSurfaceVariant} _hover={{ color: colors.primary }} href="#">
                <MaterialIcon name="public" />
              </Link>
              <Link color={colors.onSurfaceVariant} _hover={{ color: colors.primary }} href="#">
                <MaterialIcon name="terminal" />
              </Link>
            </HStack>
          </GridItem>

          <VStack align="stretch" spacing="8px">
            <Text fontSize="12px" color="white" textTransform="uppercase" letterSpacing="wider" mb="4px">Product</Text>
            <Link fontSize="14px" color={colors.onSurfaceVariant} _hover={{ color: colors.primary }} href="#">Features</Link>
            <Link fontSize="14px" color={colors.onSurfaceVariant} _hover={{ color: colors.primary }} href="#">Roadmap</Link>
            <Link fontSize="14px" color={colors.onSurfaceVariant} _hover={{ color: colors.primary }} href="#">GitHub</Link>
          </VStack>

          <VStack align="stretch" spacing="8px">
            <Text fontSize="12px" color="white" textTransform="uppercase" letterSpacing="wider" mb="4px">Resources</Text>
            <Link fontSize="14px" color={colors.onSurfaceVariant} _hover={{ color: colors.primary }} href="#">Documentation</Link>
            <Link fontSize="14px" color={colors.onSurfaceVariant} _hover={{ color: colors.primary }} href="#">API Status</Link>
            <Link fontSize="14px" color={colors.onSurfaceVariant} _hover={{ color: colors.primary }} href="#">Help Center</Link>
          </VStack>

          <VStack align="stretch" spacing="8px">
            <Text fontSize="12px" color="white" textTransform="uppercase" letterSpacing="wider" mb="4px">Legal</Text>
            <Link fontSize="14px" color={colors.onSurfaceVariant} _hover={{ color: colors.primary }} href="#">Privacy</Link>
            <Link fontSize="14px" color={colors.onSurfaceVariant} _hover={{ color: colors.primary }} href="#">Terms</Link>
            <Link fontSize="14px" color={colors.onSurfaceVariant} _hover={{ color: colors.primary }} href="#">Cookies</Link>
          </VStack>

          <GridItem colSpan={{ base: 2, md: 4, lg: 2 }}>
            <VStack align={{ base: "flex-start", lg: "flex-end" }} spacing="8px">
              <Text fontSize="12px" color="white" textTransform="uppercase" letterSpacing="wider" mb="4px">Subscribe</Text>
              <Flex w="full">
                <Input
                  bg="#211f24"
                  border="1px solid"
                  borderColor={colors.outlineVariant}
                  borderRadius="8px 0 0 8px"
                  placeholder="Email address"
                  type="email"
                  color={colors.onSurface}
                  _focus={{ borderColor: colors.primary, boxShadow: `0 0 0 1px ${colors.primary}` }}
                />
                <Button
                  bg={colors.primary}
                  color="white"
                  px="16px"
                  borderRadius="0 8px 8px 0"
                  fontSize="14px"
                  _hover={{ filter: "brightness(1.1)" }}
                >
                  Join
                </Button>
              </Flex>
              <Text fontSize="12px" color={colors.onSurfaceVariant} mt="16px">
                © 2024 SplitLink. All rights reserved.
              </Text>
            </VStack>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
}
