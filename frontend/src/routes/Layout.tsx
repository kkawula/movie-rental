import "@mantine/core/styles.css";
import { Container, MantineProvider } from "@mantine/core";
import { theme } from "../theme";
import { AppShell, Burger, Group, UnstyledButton, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Layout/Layout.module.css";
import { IconDisc } from "@tabler/icons-react";
import { Link, Outlet } from "react-router-dom";
import Menu from "./Layout/Menu";

export default function Layout() {
  const [opened, { toggle }] = useDisclosure();
  return (
    <MantineProvider theme={theme} forceColorScheme="dark">
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { desktop: true, mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Group justify="space-between" style={{ flex: 1 }}>
              <UnstyledButton component={Link} to={"/undefined"}>
                <Group>
                  <IconDisc size={36} stroke={1.5} />
                  <Text size="h3" className={classes.title}>
                    Movie Rental
                  </Text>
                </Group>
              </UnstyledButton>

              <Group ml="xl" gap="xs" visibleFrom="sm">
                <Menu />
              </Group>
            </Group>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar py="md" px={4}>
          <Menu onClick={toggle} />
        </AppShell.Navbar>

        <AppShell.Main>
          <Container size="lg">
            <Outlet />
          </Container>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
