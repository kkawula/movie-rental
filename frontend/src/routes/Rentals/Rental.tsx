import { ActionIcon, Grid, Group, useMantineTheme, Badge } from "@mantine/core";
import { IconArrowForwardUp, IconAdjustments } from "@tabler/icons-react";
import { RentalData } from "../Rentals";

function DaysBetweenDates(inDate1: string): number {
  let date1 = new Date();
  let date2 = new Date(inDate1);

  let Difference_In_Time = date2.getTime() - date1.getTime();

  let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));

  return Difference_In_Days;
}

interface RentalProps extends RentalData {
  fetchAllData: () => void;
}

export default function Rental(props: RentalProps) {
  const theme = useMantineTheme();
  const { id, fetchAllData, ...data } = props;

  function returnDvd() {
    const apiUrl = "http://localhost:3001/rentals/" + props.id;

    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        fetchAllData();
      } catch (error) {
        console.error((error as Error).message);
      }
    };

    fetchData();
  }

  return (
    <>
      <Grid
        bg={theme.colors.dark[4]}
        justify="space-between"
        align="center"
        columns={11}
        styles={{
          root: { borderRadius: theme.defaultRadius },
          inner: { minHeight: 80 },
        }}
        px={10}
      >
        <Grid.Col span={1}>{props.id.toString()}</Grid.Col>
        <Grid.Col span={1}>{props.user_id}</Grid.Col>
        <Grid.Col span={1}>{props.dvd_id}</Grid.Col>
        <Grid.Col span={2}>{props.rental_date}</Grid.Col>
        <Grid.Col span={2}>{props.return_deadline}</Grid.Col>
        <Grid.Col span={2}>
          {DaysBetweenDates(props.return_deadline) < 0 ? (
            <Badge color="red">
              {DaysBetweenDates(props.return_deadline)} days overdue
            </Badge>
          ) : (
            <Badge color="green">
              {DaysBetweenDates(props.return_deadline)} days left
            </Badge>
          )}
        </Grid.Col>

        <Grid.Col span={1}>
          <Group>
            <ActionIcon variant="filled" color="dark" aria-label="Settings">
              <IconAdjustments
                style={{ width: "70%", height: "70%" }}
                stroke={1.5}
              />
            </ActionIcon>
            <ActionIcon variant="filled" color="teal" aria-label="Return">
              <IconArrowForwardUp
                style={{ width: "70%", height: "70%" }}
                stroke={1.5}
                onClick={returnDvd}
              />
            </ActionIcon>
          </Group>
        </Grid.Col>
      </Grid>
    </>
  );
}
