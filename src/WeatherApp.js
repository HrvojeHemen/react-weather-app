import React, {Component} from "react";
import axios from "axios";
import {
    Box,
    Button,
    Center,
    Container,
    FormControl,
    Heading,
    HStack, Image,
    Input,
    Text,
    VStack
} from "@chakra-ui/react";
import Chart from "react-apexcharts";


class WeatherApp extends Component {
    APIKEY = "48e2ca50bc10412faac90542221507"

    state = {
        forecastDays: [],
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const data = new FormData(event.target);
        let city = data.get("city")
        this.loadCity(city)
    }

    componentDidMount() {
        this.loadCity('Zagreb')
    }

    loadCity = (city) => {

        axios.get("https://api.weatherapi.com/v1/forecast.json?key=" + this.APIKEY + "&aqi=yes&days=5&q=" + city)
            .then(resp => resp.data)
            .then(data => {
                let days = data['forecast']['forecastday']

                for (let i = 0; i < days.length; i++) {

                    let hours = days[i]['hour']

                    let options = {
                        title: {
                            text: 'Weather report'
                        },
                        xaxis: {
                            categories: [],
                            title: {
                                text: "Time of day"
                            }
                        },
                        yaxis: [{
                            title: {
                                text: 'Temperature',
                            },

                        },
                            {
                                opposite: true,
                                title: {
                                    text: 'Humidity'
                                }
                            }],
                        colors: ['#e32b27', '#0b339a', '#17c7b8']

                    }
                    let series = [
                        {
                            type: 'line',
                            name: "Temperature (°C)",
                            data: [],
                        },
                        {
                            type: 'column',
                            name: "Humidity",
                            data: []
                        },
                        {
                            type: 'line',
                            name: "Feels like (°C)",
                            data: []
                        }
                    ]
                    for (let j = 0; j < hours.length; j++) {
                        let hrs = j
                        let temp = hours[j]['temp_c']
                        let feelsLike = hours[j]['feelslike_c']
                        let humidity = hours[j]['humidity']

                        series[0].data.push(temp)
                        series[1].data.push(humidity)
                        series[2].data.push(feelsLike)
                        options.xaxis.categories.push(hrs + ":00")

                    }


                    days[i]['options'] = options
                    days[i]['series'] = series
                }

                this.setState({forecastDays: days})
                console.log(days)
            })
            .catch(() => {
                alert("Unknown city")
                this.setState({forecastDays: []})
            })


        console.log(city)
    }


    render() {
        const {forecastDays} = this.state;
        console.log(forecastDays)
        return (
            <Center>
                <VStack width={"100%"}>
                    <Center width={"100%"}>
                        <Heading>Welcome to my Weather app</Heading>
                    </Center>

                    <form onSubmit={this.handleSubmit}>
                        <FormControl>

                            <HStack>
                                <Input type={"text"} name={"city"} id={"city"} width={"25"} placeholder="Zagreb"/>
                                <Button
                                    mt={4}
                                    colorScheme='teal'
                                    type='submit'
                                >
                                    Check weather
                                </Button>
                            </HStack>

                        </FormControl>
                    </form>
                    <Heading>3 day forecast</Heading>
                    <Center width={"100%"}>
                        <HStack width={"auto"}>

                            {forecastDays.map(({date, day, options, series}, index) => (
                                <Container key={index} bg={"#c3e0e5"} border={'1px'} width={"100%"}>
                                    <HStack>
                                        <Image src={day.condition.icon}></Image>

                                        <Box fontWeight={"bold"}>
                                            <Text> {date} - {new Date(date).toLocaleString("default", {weekday: "long"})}</Text>
                                            <HStack>
                                                <Text color="#247BA0"> {day['mintemp_c']} °C</Text>
                                                <Text> - </Text>
                                                <Text color="#F25F5C"> {day['maxtemp_c']} °C</Text>
                                            </HStack>
                                            <Text> {day.condition.text}</Text>


                                        </Box>


                                    </HStack>
                                    <Chart
                                        options={options}
                                        series={series}
                                        width="500"
                                        stroke={
                                            {
                                                width: [0, 2, 0],
                                                curve: 'smooth'
                                            }
                                        }
                                    />


                                </Container>
                            ))}

                        </HStack>
                    </Center>
                </VStack>


            </Center>


        )

    }
}

export default WeatherApp;