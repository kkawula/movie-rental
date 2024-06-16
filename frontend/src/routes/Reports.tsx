import {
  Alert,
  Center,
  Flex,
  Loader,
  MantineColor,
  Stack,
  Table,
  Title,
  Text,
  SimpleGrid,
  Space,
} from "@mantine/core";
import { Key, useState } from "react";
import { useEffect } from "react";
import { IconInfoCircle } from "@tabler/icons-react";
import { DatePicker, DatesProvider } from "@mantine/dates";
import { DonutChart } from "@mantine/charts";

interface MoviesReportData {
  id: Number;
  title: string;
  description: string;
  imdb_rate: string;
  director: string;
  poster_url: string;
  rentals: Number;
}

interface GenresReportData {
  id: Number;
  name: string;
  rentals: Number;
}

export default function Reports() {
  const colors: MantineColor[] = [
    "pink.7",
    "lime.7",
    "green.7",
    "red.7",
    "violet.7",
    "blue.7",
    "cyan.7",
    "grape.7",
    "indigo.7",
    "teal.7",
    "yellow.7",
    "indigo.3",
    "yellow.3",
    "cyan.3",
    "green.3",
    "violet.3",
    "blue.3",
    "pink.3",
    "grape.3",
    "teal.3",
    "lime.3",
    "red.3",
  ];

  const [moviesData, setMoviesData] = useState<MoviesReportData[]>([]);
  const [genresData, setGenresData] = useState<GenresReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  function fromDateChange(value: Date | null) {
    setFromDate(value);
  }

  function toDateChange(value: Date | null) {
    setToDate(value);
  }

  function fetchAllData() {
    const moviesUrl = "http://localhost:3001/movies_report";
    const genresUrl = "http://localhost:3001/genres_report";

    const fetchData = async (url: string, setData: any) => {
      try {
        let queryUrl = new URL(url);

        if (fromDate) {
          queryUrl.searchParams.append(
            "rental_after",
            fromDate.toISOString().split("T")[0]
          );
        }

        if (toDate) {
          queryUrl.searchParams.append(
            "rental_before",
            toDate.toISOString().split("T")[0]
          );
        }

        const response = await fetch(queryUrl);
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

    fetchData(moviesUrl, setMoviesData);
    fetchData(genresUrl, setGenresData);
  }

  useEffect(fetchAllData, [fromDate, toDate]);

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
      <Title order={1}>Reports</Title>
      <Flex
        mih={50}
        gap="md"
        justify="space-around"
        align="center"
        direction="row"
        wrap="wrap"
      >
        <DatesProvider settings={{ timezone: "UTC" }}>
          <Stack>
            <Title order={3}>Rentals from:</Title>
            <DatePicker
              allowDeselect
              value={fromDate}
              onChange={fromDateChange}
            />
          </Stack>
          <Stack>
            <Title order={3}>Rentals to:</Title>
            <DatePicker allowDeselect value={toDate} onChange={toDateChange} />
          </Stack>
        </DatesProvider>
      </Flex>

      <SimpleGrid cols={2}>
        <Stack>
          {" "}
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Title</Table.Th>
                <Table.Th>Rentals</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {moviesData
                .sort((a, b) => (b.rentals as number) - (a.rentals as number))
                .map((movieData) => (
                  <Table.Tr key={movieData.id as Key}>
                    <Table.Td>{String(movieData.id)}</Table.Td>
                    <Table.Td>{movieData.title}</Table.Td>
                    <Table.Td>{String(movieData.rentals)}</Table.Td>
                  </Table.Tr>
                ))}
            </Table.Tbody>
          </Table>
        </Stack>

        <Stack>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Genre</Table.Th>
                <Table.Th>Rentals</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {genresData
                .sort((a, b) => (b.rentals as number) - (a.rentals as number))
                .map((genreData, index) => (
                  <Table.Tr key={genreData.id as Key}>
                    <Table.Td>
                      <Text c={colors[index]}>{String(genreData.id)}</Text>
                    </Table.Td>
                    <Table.Td>{genreData.name}</Table.Td>
                    <Table.Td>{String(genreData.rentals)}</Table.Td>
                  </Table.Tr>
                ))}
            </Table.Tbody>
          </Table>
          <Space h="md" />
          <Center>
      <DonutChart
            data={genresData
              .sort((a, b) => (b.rentals as number) - (a.rentals as number))
              .map((genreData, index) => ({
                name: genreData.name,
                value: genreData.rentals as number,
                color: colors[index],
              }))}
            withLabels
            withLabelsLine
            style={{width: "50%", aspectRatio: 1}}
            size={200}
            tooltipDataSource="segment"
          />
      </Center>
        </Stack>
      </SimpleGrid>

    </Stack>
  );
}
