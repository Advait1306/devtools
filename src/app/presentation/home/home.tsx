import React, {useState} from 'react';
import {Box} from "@chakra-ui/react";
import {container} from "tsyringe";
import AccountEngine from "../../application/account/account.engine";
import NavBar from "./components/NavBar";
import Computer from "./components/Computer";
import Environment from "./components/Environments";
import Emulators from "./components/Emulators";

export enum Tabs {
    COMPUTER = 'computer',
    ENVIRONMENTS = 'tools.environments',
    EMULATORS = 'tools.emulators'
}

function Home() {
    const [selectedTab, setSelectedTab] = useState('computer')
    const accountEngine = container.resolve(AccountEngine);

    return (
        <Box h={"full"} display={'flex'} flexDirection={'row'}>
            <NavBar selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
            <Box h={'full'} flex={1}>
                <Page selectedTab={selectedTab}/>
            </Box>
        </Box>
    );
}

const Page = (props: any) => {
    const selectedTab: string = props.selectedTab;
    switch (selectedTab) {
        case 'computer': {
            return <Computer/>
        }
        case 'tools.environments': {
            return <Environment/>
        }
        case 'tools.emulators': {
            return <Emulators/>
        }
    }
}

export default Home;
