import {
  createTheme,
  DEFAULT_THEME,
  MantineColorsTuple,
  mergeMantineTheme,
} from '@mantine/core';

const myColor: MantineColorsTuple = [
  '#ebefff',
  '#d5dafc',
  '#a9b1f1',
  '#7b87e9',
  '#5362e1',
  '#3a4bdd',
  '#2d3fdc',
  '#1f32c4',
  '#182cb0',
  '#0b259c'
];

const themeOverride = createTheme({
  colors: {
    myColor
  },
  defaultRadius: '0.5rem',
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);