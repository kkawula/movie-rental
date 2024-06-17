import { ActionIcon, Grid, Group, useMantineTheme, Badge } from "@mantine/core";
import { IconArrowForwardUp, IconAdjustments } from "@tabler/icons-react";
import { HistoryRentalData } from "../Rentals";

function DaysBetweenDates(inDate1: string, inDate2: string): number {
  let date1 = new Date(inDate1);
  let date2 = new Date(inDate2);

  let Difference_In_Time = date2.getTime() - date1.getTime();

  let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));

  return Difference_In_Days;
}

export default function Rental(props: HistoryRentalData) {
  const theme = useMantineTheme();
  const { id, ...data } = props;

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
        <Grid.Col span={2}>{props.returned_date}</Grid.Col>
        <Grid.Col span={2}>
          {DaysBetweenDates(props.returned_date, props.return_deadline) < 0 ? (
            <Badge color="red">
              {DaysBetweenDates(props.returned_date, props.return_deadline)}{" "}
              days overdue
            </Badge>
          ) : (
            <Badge color="green">
              {DaysBetweenDates(props.returned_date, props.return_deadline)}{" "}
              days left
            </Badge>
          )}
        </Grid.Col>
      </Grid>
    </>
  );
}
