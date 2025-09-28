export interface TemperatureRecord {
  year: number;
  maxTemp: number;
}

export interface LocationTemperatureData {
  location: string;
  temperatures: TemperatureRecord[];
}

const years = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

const groupA_temps = [34.51, 31.44, 32.25, 29.95, 30.87, 32.13, 30.86, 32.8, 32.1, 32.05, 33.55];
const groupB_temps = [34.21, 31.72, 32.3, 29.9, 30.56, 31.89, 30.51, 32.9, 32.07, 32.16, 33.49];
const mohammadpur_temps = [34.51, 31.72, 32.3, 29.95, 30.87, 32.13, 30.86, 32.9, 32.1, 32.16, 33.55];

const groupA_locations = ['Biman_Bandar', 'Cantonment', 'Gulshan', 'Kafrul', 'Khilkhet', 'Mirpur', 'Pallabi', 'Tejgaon_Ind_Area', 'Uttara_Paschim', 'Uttara_Purba'];
const groupB_locations = ['Dhanmondi', 'Kalabagan', 'Kotwali', 'Paltan'];

const createData = (location: string, temps: number[]): LocationTemperatureData => ({
    location,
    temperatures: years.map((year, index) => ({ year, maxTemp: temps[index] }))
});

export const maxTemperatureData: LocationTemperatureData[] = [
    ...groupA_locations.map(loc => createData(loc, groupA_temps)),
    ...groupB_locations.map(loc => createData(loc, groupB_temps)),
    createData('Mohammadpur', mohammadpur_temps)
];
