import React from 'react';
import {Box, VStack} from "@chakra-ui/react";
import ProfileTab from "./ProfileTab";
import {MenuItem, MenuTile} from './MenuItem'

function NavBar(props: any) {

    const selectedTab: string = props.selectedTab;
    const setSelectedTab: (tab: string) => void = props.setSelectedTab;

    return (
        <Box h={'full'} w={'30%'} bg={'brand.primary'} px={'48px'} py={'60px'}>
            <ProfileTab/>
            <Box h={'36px'}/>
            <MenuItem name={'Computer'} isSelected={selectedTab === 'computer'} id={'computer'}
                      setSelectedTab={setSelectedTab}/>
            <Box h={'48px'}/>
            <VStack gap={'24px'} alignItems={'flex-start'}>
                <MenuTile name={'tools'}/>
                <VStack gap={'20px'} alignItems={'flex-start'}>
                    <MenuItem name={'Environments'}
                              isSelected={selectedTab === 'tools.environments'}
                              id={'tools.environments'}
                              setSelectedTab={setSelectedTab}
                    />

                    <MenuItem name={'Emulators'}
                              isSelected={selectedTab === 'tools.emulators'}
                              id={'tools.emulators'}
                              setSelectedTab={setSelectedTab}
                    />
                </VStack>
            </VStack>
            <Box h={'48px'}/>
            <MenuTile name={'feedback'}/>
        </Box>
    );
}

export default NavBar;
