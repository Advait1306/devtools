import { createRoot } from 'react-dom/client';
import "reflect-metadata";
import {container} from "tsyringe";


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import App from "./presentation/App";
import AccountEngine from "./application/account/account.engine";

import {ChakraProvider, extendTheme} from '@chakra-ui/react'


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD0P0wk-e7EgCRcr9eQa8GtrDiEPriZzMA",
    authDomain: "internet-comp-test.firebaseapp.com",
    projectId: "internet-comp-test",
    storageBucket: "internet-comp-test.appspot.com",
    messagingSenderId: "508745707513",
    appId: "1:508745707513:web:4c258a428d6523870f9728"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const resolveEager = () => {
    container.resolve(AccountEngine)
}
resolveEager();

const element = document.getElementById('react-root')
const root = createRoot(element);

const theme = extendTheme({
    colors: {
        brand: {
            background: "#272727",
        }
    },
})

root.render(
    <ChakraProvider theme={theme}>
        <App/>
    </ChakraProvider>
);

