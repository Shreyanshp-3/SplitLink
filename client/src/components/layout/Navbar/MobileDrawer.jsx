import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  VStack,
  Link,
} from "@chakra-ui/react";

const items = [
  "Features",
  "How it Works",
  "Pricing",
];

const MobileDrawer = ({
  isOpen,
  onClose,
}) => {
  return (
    <Drawer
      placement="right"
      isOpen={isOpen}
      onClose={onClose}
    >
      <DrawerOverlay />

      <DrawerContent bg="bg.canvas">
        <DrawerBody pt={20}>
          <VStack spacing={8}>
            {items.map((item) => (
              <Link
                key={item}
                href="#"
                fontSize="lg"
                onClick={onClose}
              >
                {item}
              </Link>
            ))}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileDrawer;