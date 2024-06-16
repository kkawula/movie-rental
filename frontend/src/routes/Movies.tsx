import {
  ActionIcon,
  Alert,
  Center,
  Drawer,
  Group,
  Loader,
  SegmentedControl,
  SimpleGrid,
  Stack,
  TextInput,
  Title,
  Text,
  Button,
  RangeSlider,
  PillsInput,
  Combobox,
  Pill,
  CheckIcon,
  useCombobox,
} from "@mantine/core";
import { Key, useState } from "react";
import { useEffect } from "react";
import { IconFilter, IconInfoCircle } from "@tabler/icons-react";
import Movie from "./Movies/Movie";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";

enum Availability {
  ALL,
  AVAILABLE,
  NOT_AVAILABLE,
}

export interface MovieData {
  id: Number;
  title: String;
  description: String;
  imdb_rate: String;
  director: String;
  poster_url: String;
}

interface MovieFilterData {
  availability: Availability;
  title: string;
  description: string;
  director: string;
  imdb_gte: string;
  imdb_lte: string;
  genre_ids: number[];
}

interface Genre {
  id: number;
  name: string;
}

export default function Movies() {
  const [data, setData] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [
    filtersOpened,
    { open: openFiltersDrawer, close: closeFiltersDrawer },
  ] = useDisclosure(false);

  const filters: MovieFilterData = {
    availability: Availability.ALL,
    title: "",
    description: "",
    director: "",
    imdb_gte: "",
    imdb_lte: "",
    genre_ids: [],
  };

  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [imdbRange, setImdbRange] = useState<[number, number]>([0.0, 10.0]);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const [genres, setGenres] = useState<Genre[]>([]);
  const [search, setSearch] = useState("");
  const [value, setValue] = useState<Genre[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/genres")
      .then((response) => response.json())
      .then((data) => setGenres(data))
      .catch((error) => setError((error as Error).message));
  }, []);

  const handleValueSelect = (val: string) => {
    const selectedGenre = genres.find((genre) => genre.id === Number(val));
    if (selectedGenre) {
      setValue((current) =>
        current.some((v) => v.id === selectedGenre.id)
          ? current.filter((v) => v.id !== selectedGenre.id)
          : [...current, selectedGenre]
      );
    }
  };

  const handleValueRemove = (val: string) => {
    let valId = Number(val);
    setValue((current) => current.filter((v) => v.id !== valId));
  };

  const values = value.map((item) => (
    <Pill
      key={item.id}
      withRemoveButton
      onRemove={() => handleValueRemove(String(item.id))}
    >
      {item.name}
    </Pill>
  ));

  const options = genres
    .filter((item) =>
      item.name.toLowerCase().includes(search.trim().toLowerCase())
    )
    .map((item) => (
      <Combobox.Option
        value={String(item.id)}
        key={item.id}
        active={value.some((v) => v.id === item.id)}
      >
        <Group gap="sm">
          {value.some((v) => v.id === item.id) ? <CheckIcon size={12} /> : null}
          <span>{item.name}</span>
        </Group>
      </Combobox.Option>
    ));

  function fetchAllData(filters: MovieFilterData) {
    const apiUrl = "http://localhost:3001/movies";

    const fetchData = async () => {
      try {
        let queryUrl = new URL(apiUrl);

        switch (availabilityFilter) {
          case "All":
            filters.availability = Availability.ALL;
            break;
          case "Available":
            filters.availability = Availability.AVAILABLE;
            break;
          case "Not available":
            filters.availability = Availability.NOT_AVAILABLE;
            break;
          default:
            Availability.ALL;
        }

        if (filters.availability !== Availability.ALL) {
          queryUrl.searchParams.append(
            "availability",
            filters.availability === Availability.AVAILABLE ? "true" : "false"
          );
        }

        if (filters.title) {
          queryUrl.searchParams.append("title", filters.title);
        }

        if (filters.description) {
          queryUrl.searchParams.append("description", filters.description);
        }

        if (filters.director) {
          queryUrl.searchParams.append("director", filters.director);
        }

        queryUrl.searchParams.append("imdb_gte", String(imdbRange[0]));
        queryUrl.searchParams.append("imdb_lte", String(imdbRange[1]));

        if (values.length > 0) {
          filters.genre_ids = values.map((v) => Number(v.key));
          queryUrl.searchParams.append("genre_ids", "[" + String(filters.genre_ids) + "]");
        }

        let response = await fetch(queryUrl);

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

  useEffect(() => fetchAllData(filters), []);

  const filtersForm = useForm({
    mode: "uncontrolled",
    initialValues: filters,
  });

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
          <Title order={1}>Movies</Title>
          <ActionIcon
            type="button"
            color="yellow"
            variant="light"
            onClick={openFiltersDrawer}
            aria-label="Filters"
            size="lg"
          >
            <IconFilter style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
        </Group>

        <SimpleGrid cols={3} px={30}>
          {data
            .sort((a, b) => (a.id as number) - (b.id as number))
            .map((movie) => (
              <Movie
                {...movie}
                key={movie.id as Key}
                fetchAllData={() => fetchAllData(filters)}
              />
            ))}
        </SimpleGrid>
      </Stack>
      <Drawer
        opened={filtersOpened}
        onClose={closeFiltersDrawer}
        title="Filters"
      >
        <form onSubmit={filtersForm.onSubmit(fetchAllData)}>
          <Stack gap={10}>
            <TextInput
              label="Title"
              placeholder="Title"
              key={filtersForm.key("title")}
              {...filtersForm.getInputProps("title")}
            />
            <TextInput
              label="Director"
              placeholder="Director"
              key={filtersForm.key("director")}
              {...filtersForm.getInputProps("director")}
            />
            <TextInput
              label="Description"
              placeholder="Description"
              key={filtersForm.key("description")}
              {...filtersForm.getInputProps("description")}
            />
            <Text size="sm" mb={-10}>
              Availability
            </Text>
            <SegmentedControl
              fullWidth
              data={["All", "Available", "Not available"]}
              value={availabilityFilter}
              onChange={setAvailabilityFilter}
            />
            <Text size="sm">IMDB Rating</Text>
            <RangeSlider
              minRange={0.1}
              min={0}
              max={10}
              step={0.1}
              value={imdbRange}
              onChange={setImdbRange}
            />
            <Combobox store={combobox} onOptionSubmit={handleValueSelect}>
              <Combobox.DropdownTarget>
                <PillsInput onClick={() => combobox.openDropdown()}>
                  <Pill.Group>
                    {values}

                    <Combobox.EventsTarget>
                      <PillsInput.Field
                        onFocus={() => combobox.openDropdown()}
                        onBlur={() => combobox.closeDropdown()}
                        value={search}
                        placeholder="Search genres"
                        onChange={(event) => {
                          combobox.updateSelectedOptionIndex();
                          setSearch(event.currentTarget.value);
                        }}
                        onKeyDown={(event) => {
                          if (
                            event.key === "Backspace" &&
                            search.length === 0
                          ) {
                            event.preventDefault();
                            handleValueRemove(String(value[value.length - 1]?.id));
                          }
                        }}
                      />
                    </Combobox.EventsTarget>
                  </Pill.Group>
                </PillsInput>
              </Combobox.DropdownTarget>

              <Combobox.Dropdown>
                <Combobox.Options>
                  {options.length > 0 ? (
                    options
                  ) : (
                    <Combobox.Empty>Nothing found...</Combobox.Empty>
                  )}
                </Combobox.Options>
              </Combobox.Dropdown>
            </Combobox>
            <Group justify="flex-end" mt="md">
              <Button type="submit" color="green" variant="light">
                Filter
              </Button>
            </Group>
          </Stack>
        </form>
      </Drawer>
    </>
  );
}
