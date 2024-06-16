import {
  Alert,
  Button,
  Center,
  DefaultMantineColor,
  Group,
  Loader,
  Modal,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { Key, useState } from "react";
import { useEffect } from "react";
import Client from "./Clients/Client";
import { IconInfoCircle } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";

export interface ClientData {
  id: Number;
  first_name: String;
  last_name: String;
  phone_number: String;
  mail: String;
  address: String;
}

export interface ClientDataNoID {
  first_name: String | null;
  last_name: String | null;
  phone_number: String | null;
  mail: String | null;
  address: String | null;
}

export interface FormError {
  color: DefaultMantineColor;
  title: String;
  content: String;
}

export default function Clients() {
  const [data, setData] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const [alert, setAlert] = useState<FormError | undefined>(undefined);


  function fetchAllData() {
    const apiUrl = "http://localhost:3001/users";

    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        setData(jsonData);
        setLoading(false);
      } catch (error) {
        setError((error as Error).message);
        setLoading(false);
      }
    };

    fetchData();
  }


  useEffect(fetchAllData, []);

  const initialValues: ClientDataNoID = {
    first_name: null,
    last_name: null,
    phone_number: null,
    mail: null,
    address: null
  };

  const newForm = useForm({
    mode: "uncontrolled",
    initialValues: initialValues,
    validate: {
      first_name: isNotEmpty("Enter client's first name"),
      last_name: isNotEmpty("Enter client's last name"),
      phone_number: (value: String | null) =>
        value === null || value.length < 7 || value.length > 15 || !value.match(/^[0-9]{7,15}$/)
          ? "Invalid number"
          : null,
      mail: isEmail("Invalid email address"),
      address: isNotEmpty("Enter client's address"),
    },
  });

  function openForm() {
    newForm.reset();
    setAlert(undefined);
    open();
  }

  async function sendForm(values: ClientDataNoID) {
    try {
      const response = await fetch(
        "http://localhost:3001/users/",
        {
          method: "POST",
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
          content: "Successfully added the user.",
        });
        newForm.reset();
        fetchAllData();
      } else {
        setAlert({
          color: "red",
          title: "Error",
          content: response.statusText + ": " + await response.text(),
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

  if (loading)
    return (
      <Center>
        <Loader color="rgba(168, 168, 168, 1)" type="dots" />
      </Center>
    );
  if (error)
    return (
      <Alert
        variant="light"
        color="red"
        title="Error"
        icon={<IconInfoCircle />}
      >
        {error}
      </Alert>
    );

  return (
    <>
      <Stack align="stretch" justify="flex-start" gap="md" px={30}>
        <Group justify="space-between">
          <Title order={1}>Clients</Title>
          <Button type="button" color="green" variant="light" onClick={openForm}>
            New client
          </Button>
        </Group>

        <Stack align="stretch" justify="flex-start" gap="md" px={30}>
          {data
            .sort((a, b) => (a.id as number) - (b.id as number))
            .map((client) => (
              <Client
                {...client}
                key={client.id as Key}
                fetchAllData={fetchAllData}
              />
            ))}
        </Stack>
      </Stack>

      <Modal opened={opened} onClose={close} title="New client">
        <form onSubmit={newForm.onSubmit(sendForm)}>
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
              key={newForm.key("first_name")}
              {...newForm.getInputProps("first_name")}
            />
            <TextInput
              withAsterisk
              label="Last name"
              placeholder="Last name"
              key={newForm.key("last_name")}
              {...newForm.getInputProps("last_name")}
            />
            <TextInput
              withAsterisk
              label="Phone number"
              placeholder="Phone number"
              key={newForm.key("phone_number")}
              {...newForm.getInputProps("phone_number")}
            />
            <TextInput
              withAsterisk
              label="Mail"
              placeholder="Mail"
              key={newForm.key("mail")}
              {...newForm.getInputProps("mail")}
            />
            <TextInput
              withAsterisk
              label="Address"
              placeholder="Address"
              key={newForm.key("address")}
              {...newForm.getInputProps("address")}
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
