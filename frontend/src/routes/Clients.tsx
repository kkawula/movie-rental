import {
  Alert,
  Center,
  Loader,
  Stack,
  Title,
} from "@mantine/core";
import { Key, useState } from "react";
import { useEffect } from "react";
import Client from "./Clients/Client";
import { IconInfoCircle } from "@tabler/icons-react";

export interface ClientData {
  id: Number,
  first_name: String;
  last_name: String;
  phone_number: String;
  mail: String;
  address: String;
}

export default function Clients() {
  const [data, setData] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <Stack align="stretch" justify="flex-start" gap="md" px={30}>
      <Title order={1}>Clients</Title>
      <Stack align="stretch" justify="flex-start" gap="md" px={30}>
        {data.sort((a, b) => a.id as number - (b.id as number)).map((client) => (
          <Client {...client} key={client.id as Key} fetchAllData={fetchAllData} />
        ))}
      </Stack>
    </Stack>
  );
}
