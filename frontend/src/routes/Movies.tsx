import {
  Alert,
  Center,
  DefaultMantineColor,
  Loader,
  SimpleGrid,
  Stack,
  Title,
} from "@mantine/core";
import { Key, useState } from "react";
import { useEffect } from "react";
import { IconInfoCircle } from "@tabler/icons-react";
import Movie from "./Movies/Movie";

export interface MovieData {
  id: Number;
  title: String;
  description: String;
  imdb_rate: String;
  director: String;
  poster_url: String;
}

export interface FormError {
  color: DefaultMantineColor;
  title: String;
  content: String;
}

export default function Movies() {
  const [data, setData] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //   const [opened, { open, close }] = useDisclosure(false);
  //   const [alert, setAlert] = useState<FormError | undefined>(undefined);

  function fetchAllData() {
    const apiUrl = "http://localhost:3001/movies";

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

  // const newForm = useForm({
  //   mode: "uncontrolled",
  //   initialValues: initialValues,
  //   validate: {
  //     first_name: isNotEmpty("Enter client's first name"),
  //     last_name: isNotEmpty("Enter client's last name"),
  //     phone_number: (value: String | null) =>
  //       value === null || value.length < 7 || value.length > 15 || !value.match(/^[0-9]{7,15}$/)
  //         ? "Invalid number"
  //         : null,
  //     mail: isEmail("Invalid email address"),
  //     address: isNotEmpty("Enter client's address"),
  //   },
  // });

  // function openForm() {
  //   newForm.reset();
  //   setAlert(undefined);
  //   open();
  // }

  // async function sendForm(values: ClientDataNoID) {
  //   try {
  //     const response = await fetch(
  //       "http://localhost:3001/users/",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(values),
  //       }
  //     );

  //     if (response.ok) {
  //       setAlert({
  //         color: "green",
  //         title: "Success",
  //         content: "Successfully added the user.",
  //       });
  //       newForm.reset();
  //       fetchAllData();
  //     } else {
  //       setAlert({
  //         color: "red",
  //         title: "Error",
  //         content: response.statusText,
  //       });
  //     }
  //   } catch (error) {
  //     setAlert({
  //       color: "red",
  //       title: "Error",
  //       content: "Unable to send the request.",
  //     });
  //   }
  // }

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

  //   <Group justify="space-between">
  //     <Title order={1}>Movies</Title>
  //     <Button type="button" color="green" variant="light">
  //       {" "}
  //       {/*onClick={openForm}*/}
  //       New movie
  //     </Button>
  //   </Group>;

  return (
    <>
      <Stack align="stretch" justify="flex-start" gap="md" px={30}>
        <Title order={1}>Movies</Title>
        <SimpleGrid cols={3} px={30}>
          {data
            .sort((a, b) => (a.id as number) - (b.id as number))
            .map((movie) => (
              <Movie
                {...movie}
                key={movie.id as Key}
                fetchAllData={fetchAllData}
              />
            ))}
        </SimpleGrid>
      </Stack>
    </>
  );
}
