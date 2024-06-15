import {
  Badge,
  Card,
  Flex,
  Grid,
  Group,
  Image,
  MantineColor,
  Modal,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { MovieData } from "../Movies";
import { useDisclosure } from "@mantine/hooks";
import { Key, useState } from "react";

interface MovieProps extends MovieData {
  fetchAllData: () => void;
}

interface Genre {
  id: Number;
  name: String;
}

export default function Movie(props: MovieProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [genres, setGenres] = useState<Genre[] | null>(null);

  function getColor(): MantineColor {
    const imdb_rate_double: number = Number(props.imdb_rate);
    if (imdb_rate_double < 5.0) {
      return "red";
    } else if (imdb_rate_double < 7.5) {
      return "yellow";
    } else {
      return "green";
    }
  }

  function openModal() {
    if (genres === null) {
      fetchGenres();
    }
    open();
  }

  function fetchGenres() {
    const apiUrl = "http://localhost:3001/movies/" + props.id + "/genres";

    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        setGenres(jsonData);
      } catch (error) {}
    };

    fetchData();
  }

  return (
    <>
      <Card
        padding="lg"
        radius="md"
        onClick={openModal}
        style={{ cursor: "pointer" }}
      >
        <Card.Section>
          <Image src={props.poster_url} />
        </Card.Section>
        <Space h="lg" />
        <Group justify="space-between">
          <Title order={3}>{props.title}</Title>
          <Badge variant="light" color={getColor()} size="lg">
            {props.imdb_rate}
          </Badge>
        </Group>
      </Card>

      <Modal opened={opened} onClose={close} title={props.title} size="auto">
        <Grid m="lg">
          <Grid.Col span={5}>
            <Image src={props.poster_url} />
          </Grid.Col>
          <Grid.Col span={7} p="lg">
            <Stack justify="flex-start">
              <Group justify="space-between">
                <Title order={2}>{props.title}</Title>
                <Badge variant="light" color={getColor()} size="xl">
                  {props.imdb_rate}
                </Badge>
              </Group>
              <Title order={6}>{props.director}</Title>
              <Text style={{ textAlign: "justify" }}>{props.description}</Text>
              <Flex gap="sm">
                {genres
                  ? genres.map((genre) => (
                      <Badge color="blue" variant="light" key={(String(genre.id) + String(props.id)) as Key}>
                        {genre.name}
                      </Badge>
                    ))
                  : ""}
              </Flex>
            </Stack>
          </Grid.Col>
        </Grid>
      </Modal>
    </>
  );
}
