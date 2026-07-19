import { HStack, Link } from "@chakra-ui/react";

const links = [
  {
    title: "Features",
    href: "#features",
  },
  {
    title: "How it Works",
    href: "#workflow",
  },
  {
    title: "Pricing",
    href: "#pricing",
  },
];

const NavLinks = () => {
  return (
    <HStack spacing={8}>
      {links.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          fontWeight="500"
          color="text.secondary"
          transition=".2s"
          _hover={{
            color: "white",
            textDecoration: "none",
          }}
        >
          {item.title}
        </Link>
      ))}
    </HStack>
  );
};

export default NavLinks;