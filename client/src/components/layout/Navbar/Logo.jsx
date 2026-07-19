import { HStack, Box, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { RiMoneyDollarCircleFill } from "react-icons/ri";

const Logo = () => {
  return (
    <Link to="/">
      <HStack spacing={3}>
        <Box
          bg="brand.500"
          p={2}
          rounded="xl"
          boxShadow="glow"
        >
          <RiMoneyDollarCircleFill
            size={22}
            color="white"
          />
        </Box>

        <Text
          fontSize="xl"
          fontWeight="800"
          letterSpacing="-0.5px"
        >
          SplitLink
        </Text>
      </HStack>
    </Link>
  );
};

export default Logo;