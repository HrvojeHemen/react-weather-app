import React from 'react';
import {ChakraProvider} from '@chakra-ui/react'
import WeatherApp from "./WeatherApp";


function App() {

    return (
        <ChakraProvider>
            <WeatherApp/>
        </ChakraProvider>
    );
}

export default App;
