import {createRoot} from 'react-dom/client';
import "reflect-metadata";
import {container} from "tsyringe";

// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import App from "./presentation/App";
import AccountEngine from "./application/account/account.engine";

import {ChakraProvider, extendTheme, Text} from '@chakra-ui/react'
import Network from "./infrastructure/core/network";
import AnalyticsEngine from "./application/analytics/analytics.engine";
import React from "react";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD0P0wk-e7EgCRcr9eQa8GtrDiEPriZzMA",
    authDomain: "internet-comp-test.firebaseapp.com",
    projectId: "internet-comp-test",
    storageBucket: "internet-comp-test.appspot.com",
    messagingSenderId: "508745707513",
    appId: "1:508745707513:web:4c258a428d6523870f9728"
};


// @ts-ignore
window.electron.test()

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const resolveEager = () => {
    container.resolve(Network)
    container.resolve(AnalyticsEngine)
    container.resolve(AccountEngine)
}
resolveEager();

const element = document.getElementById('react-root')
const root = createRoot(element);

const theme = extendTheme({
    colors: {
        brand: {
            background: "#272727",
            primary: "#151515",
            gray: '#D9D9D9',
        }
    },
    fonts: {
        heading: 'Geist',
        body: 'Geist'
    }
})

// @ts-ignore
window.electron.print((event: any, args: any) => {
    console.log(args)
})

root.render(
    <ChakraProvider theme={theme}>
        <App/>
    </ChakraProvider>
);

