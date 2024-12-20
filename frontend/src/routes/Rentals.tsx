import {
  Alert,
  Button,
  Center,
  Combobox,
  DefaultMantineColor,
  Group,
  Loader,
  Modal,
  NumberInput,
  Stack,
  TextInput,
  Title,
  isNumberLike,
  useCombobox,
  Tabs,
  Pagination,
} from "@mantine/core";
import { useState } from "react";
import { Key, useEffect } from "react";
import { IconInfoCircle } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { isNotEmpty, useForm } from "@mantine/form";

import Rental from "./Rentals/Rental";
import HistoryRental from "./Rentals/HistoryRental";
import { DateInput } from "@mantine/dates";

export interface RentalData {
  id: Number;
  user_id: String;
  dvd_id: String;
  rental_date: string;
  return_deadline: string;
}

export interface HistoryRentalData {
  id: Number;
  user_id: String;
  dvd_id: String;
  rental_date: string;
  return_deadline: string;
  returned_date: string;
}

export interface RentalDataNoID {
  user_id: Number | null;
  dvd_id: Number | null;
  return_deadline: String | null;
}

export interface FormError {
  color: DefaultMantineColor;
  title: String;
  content: String;
}

interface DVD {
  id: number;
  movie_id: number;
  rentable: Boolean;
}

export interface MovieData {
  id: number;
  title: string;
  description: string;
  imdb_rate: String;
  director: String;
  poster_url: String;
}

export default function Rentals() {
  const movieCombobox = useCombobox();
  const dvdCombobox = useCombobox();
  const [movieComboValue, setmovieComboValue] = useState("");
  const [dvdComboValue, setdvdComboValue] = useState("");
  const [data, setData] = useState<RentalData[]>([]);
  const [historyData, setHistoryData] = useState<HistoryRentalData[]>([]);
  const [movieData, setMovieData] = useState<MovieData[]>([]);
  const [availableDvds, setAvailableDvds] = useState<DVD[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const [alert, setAlert] = useState<FormError | undefined>(undefined);

  function fetchAllData() {
    const apiUrl = "http://localhost:3001/rentals";

    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }

  useEffect(fetchAllData, []);

  function fetchAllHistoryData() {
    const apiUrl = "http://localhost:3001/rentals_history";

    const fetchHistoryData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData: HistoryRentalData[] = await response.json();
        const sortedJsonData = jsonData.sort(
          (a, b) => (b.id as number) - (a.id as number)
        );
        setHistoryData(sortedJsonData);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }

  useEffect(fetchAllHistoryData, []);

  function fetchMovieData() {
    const apiUrl = "http://localhost:3001/movies";

    const fetchMovies = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        setMovieData(jsonData);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }

  useEffect(fetchMovieData, []);

  function fetchAvailableDvds(movieId: Number) {
    const apiUrl = "http://localhost:3001/movies/" + movieId + "/available/";

    const fetchDvds = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        setAvailableDvds(jsonData);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDvds();
  }

  const initialValues: RentalDataNoID = {
    user_id: null,
    dvd_id: null,
    return_deadline: null,
  };

  const newForm = useForm({
    mode: "uncontrolled",
    initialValues: initialValues,
    validate: {
      user_id: isNumberLike("Invalid client ID"),
      dvd_id: isNumberLike("Invalid DVD ID"),
      return_deadline: isNotEmpty("Enter rental date"),
    },
  });

  function openForm() {
    newForm.reset();
    setAlert(undefined);
    open();
  }

  async function sendForm(values: RentalDataNoID) {
    try {
      const response = await fetch("http://localhost:3001/rentals/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setAlert({
          color: "green",
          title: "Success",
          content: "Successfully rented dvd.",
        });
        newForm.reset();
        setdvdComboValue("");
        setmovieComboValue("");
        fetchAllData();
      } else {
        setAlert({
          color: "red",
          title: "Error",
          content: response.statusText + ": " + (await response.text()),
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

  const movieOptions = movieData.map((movie) => (
    <Combobox.Option value={movie.id.toString()} key={movie.id}>
      {movie.title}
    </Combobox.Option>
  ));

  const dvdOptions = availableDvds.map((dvd) => (
    <Combobox.Option value={dvd.id.toString()} key={dvd.id}>
      {dvd.id}
    </Combobox.Option>
  ));

  // Pagination
  const [activeTab, setActiveTab] = useState<string | null>("active");
  const [activePage, setPage] = useState<number>(1);
  const itemsPerPage: number = 10;
  const start: number = (activePage - 1) * itemsPerPage;
  const end: number = start + itemsPerPage;

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
          <Title order={1}>Rentals</Title>
          <Button
            type="button"
            color="green"
            variant="light"
            onClick={openForm}
          >
            New rental
          </Button>
        </Group>
        <Tabs
          value={activeTab}
          defaultValue="active"
          onChange={(newTab) => (
            setActiveTab(newTab), setPage(1), console.log(activeTab)
          )}
        >
          <Tabs.List>
            <Tabs.Tab value="active" color="green">
              Active
            </Tabs.Tab>
            <Tabs.Tab value="history" color="yellow">
              History
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="active" pt={10}>
            <Stack align="stretch" justify="flex-start" gap="md" px={30}>
              {data.slice(start, end).map((rental) => (
                <Rental
                  {...rental}
                  key={rental.id as Key}
                  fetchAllData={fetchAllData}
                  fetchAllHistoryData={fetchAllHistoryData}
                />
              ))}
            </Stack>
          </Tabs.Panel>
          <Tabs.Panel value="history" pt={10}>
            <Stack align="stretch" justify="flex-start" gap="md" px={30}>
              {historyData.slice(start, end).map((rental) => (
                <HistoryRental {...rental} key={rental.id as Key} />
              ))}
            </Stack>
          </Tabs.Panel>
        </Tabs>
        <Center>
          <Pagination
            total={
              (activeTab === "active" ? data.length : historyData.length) /
                itemsPerPage +
              1
            }
            value={activePage}
            onChange={setPage}
            mt="sm"
            color="teal"
          />
        </Center>

        <Modal opened={opened} onClose={close} title="New rent">
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
              <NumberInput
                withAsterisk
                label="Client ID"
                placeholder="Client ID"
                key={newForm.key("client_id")}
                {...newForm.getInputProps("user_id")}
              />
              <Combobox
                onOptionSubmit={(_optionValue, optionProps) => {
                  setmovieComboValue(optionProps.children as string);
                  movieCombobox.closeDropdown();
                  fetchAvailableDvds(Number(optionProps.value));
                }}
                store={movieCombobox}
              >
                <Combobox.Target>
                  <TextInput
                    label="Movie"
                    placeholder="Pick movie or type anything"
                    value={movieComboValue}
                    onChange={() => {
                      movieCombobox.openDropdown();
                      movieCombobox.updateSelectedOptionIndex();
                    }}
                    onClick={() => movieCombobox.openDropdown()}
                    onFocus={() => movieCombobox.openDropdown()}
                    onBlur={() => movieCombobox.closeDropdown()}
                  />
                </Combobox.Target>

                <Combobox.Dropdown>
                  <Combobox.Options>
                    {movieOptions.length === 0 ? (
                      <Combobox.Empty>Nothing found</Combobox.Empty>
                    ) : (
                      movieOptions
                    )}
                  </Combobox.Options>
                </Combobox.Dropdown>
              </Combobox>

              <Combobox
                onOptionSubmit={(_optionValue, optionProps) => {
                  setdvdComboValue(optionProps.children as string);
                  newForm.setFieldValue("dvd_id", Number(optionProps.value));
                  dvdCombobox.closeDropdown();
                }}
                store={dvdCombobox}
              >
                <Combobox.Target>
                  <TextInput
                    withAsterisk
                    label="DVD"
                    placeholder="Pick DVD or type anything"
                    value={dvdComboValue}
                    onChange={() => {
                      dvdCombobox.openDropdown();
                      dvdCombobox.updateSelectedOptionIndex();
                    }}
                    onClick={() => dvdCombobox.openDropdown()}
                    onFocus={() => dvdCombobox.openDropdown()}
                    onBlur={() => dvdCombobox.closeDropdown()}
                  />
                </Combobox.Target>

                <Combobox.Dropdown>
                  <Combobox.Options>
                    {dvdOptions.length === 0 ? (
                      <Combobox.Empty>Nothing found</Combobox.Empty>
                    ) : (
                      dvdOptions
                    )}
                  </Combobox.Options>
                </Combobox.Dropdown>
              </Combobox>

              <DateInput
                withAsterisk
                label="Return deadline"
                placeholder="Return deadline"
                key={newForm.key("return_deadline")}
                {...newForm.getInputProps("return_deadline")}
              />

              <Group justify="flex-end" mt="md">
                <Button type="submit" color="green" variant="light">
                  Submit
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </Stack>
    </>
  );
}
