import {
  ActionIcon,
  Alert,
  Button,
  Center,
  DefaultMantineColor,
  Grid,
  Group,
  Modal,
  Stack,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { IconAdjustments, IconInfoCircle } from "@tabler/icons-react";
import { ClientData } from "../Clients";
import { useDisclosure } from "@mantine/hooks";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { useState } from "react";

interface FormError {
  color: DefaultMantineColor;
  title: String;
  content: String;
}

interface ClientDataNoID {
  first_name: String;
  last_name: String;
  phone_number: String;
  mail: String;
  address: String;
}

interface ClientProps extends ClientData {
  fetchAllData: () => void;
}

export default function Client(props: ClientProps) {
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const { id, fetchAllData, ...data } = props;
  const editForm = useForm({
    mode: "uncontrolled",
    initialValues: data,
    validate: {
      first_name: isNotEmpty("Enter client's first name"),
      last_name: isNotEmpty("Enter client's last name"),
      phone_number: (value) =>
        value.length < 7 || value.length > 15 || !value.match(/^[0-9]{7,15}$/)
          ? "Invalid number"
          : null,
      mail: isEmail("Invalid email address"),
      address: isNotEmpty("Enter client's address"),
    },
  });

  const [alert, setAlert] = useState<FormError | undefined>(undefined);

  function openForm() {
    editForm.setValues(data);
    setAlert(undefined);
    open();
  }

  async function sendForm(values: ClientDataNoID) {
    try {
      const response = await fetch(
        "http://localhost:3001/users/" + String(id),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        setAlert({
          color: "green",
          title: "Success",
          content: "Successfully updated the user.",
        });
        fetchAllData();
      } else {
        setAlert({
          color: "red",
          title: "Error",
          content: response.statusText + "\n" + response.body,
        });
      }
    } catch (error) {
      setAlert({
        color: "red",
        title: "Error",
        content: "Unable to send the request.",
      });
    }
  }

  return (
    <>
      <Grid
        bg={theme.colors.dark[4]}
        justify="space-between"
        align="center"
        columns={12}
        styles={{
          root: { borderRadius: theme.defaultRadius },
          inner: { minHeight: 80 },
        }}
        px={10}
      >
        <Grid.Col span={2}>{props.first_name + " " + props.last_name}</Grid.Col>
        <Grid.Col span={2}>{props.phone_number}</Grid.Col>
        <Grid.Col span={3}>{props.mail}</Grid.Col>
        <Grid.Col span={4}>{props.address}</Grid.Col>
        <Grid.Col span={1} component={Center}>
          <ActionIcon
            variant="filled"
            color="dark"
            aria-label="Settings"
            onClick={openForm}
          >
            <IconAdjustments
              style={{ width: "70%", height: "70%" }}
              stroke={1.5}
            />
          </ActionIcon>
        </Grid.Col>
      </Grid>
      <Modal opened={opened} onClose={close} title="Edit client">
        <form onSubmit={editForm.onSubmit(sendForm)}>
          <Stack gap={10}>
            {alert !== undefined ? (
              <Alert
                variant="light"
                color={alert.color}
                title={alert.title}
                icon={<IconInfoCircle />}
              >
                {alert.content}
              </Alert>
            ) : (
              ""
            )}
            <TextInput
              withAsterisk
              label="First name"
              placeholder="First name"
              key={editForm.key("first_name")}
              {...editForm.getInputProps("first_name")}
            />
            <TextInput
              withAsterisk
              label="Last name"
              placeholder="Last name"
              key={editForm.key("last_name")}
              {...editForm.getInputProps("last_name")}
            />
            <TextInput
              withAsterisk
              label="Phone number"
              placeholder="Phone number"
              key={editForm.key("phone_number")}
              {...editForm.getInputProps("phone_number")}
            />
            <TextInput
              withAsterisk
              label="Mail"
              placeholder="Mail"
              key={editForm.key("mail")}
              {...editForm.getInputProps("mail")}
            />
            <TextInput
              withAsterisk
              label="Address"
              placeholder="Address"
              key={editForm.key("address")}
              {...editForm.getInputProps("address")}
            />
            <Group justify="flex-end" mt="md">
              <Button type="submit" color="green" variant="light">
                Submit
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
