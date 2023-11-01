import React from 'react';
import {Box, Button, Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, Text} from "@chakra-ui/react";
import {MdPerson} from 'react-icons/md'
import {HamburgerIcon} from "@chakra-ui/icons";
import {IoLogOutOutline} from "react-icons/io5";
import AccountEngine from "../../../application/account/account.engine";
import {container} from "tsyringe";

function ProfileTab() {

    const accountStore = AccountEngine.useAccountStore();
    const accountEngine = container.resolve(AccountEngine);

    return (
        <Box display={'flex'}
             flexDirection={'row'}
             px={'16px'} py={'14px'}
             bg={'brand.background'}
             borderRadius={'12px'}
             alignItems={'center'}
             justifyContent={'space-between'}
        >
            <Box display={'flex'} flexDirection={'row'} gap={'12px'} alignItems={'center'}>
                <Box
                    h={'32px'}
                    w={'32px'}
                    bg={'white'}
                    borderRadius={'8px'}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}>
                    <Icon as={MdPerson}/>
                </Box>
                <Text color={'white'} fontWeight={'bold'}>{accountStore.user.name}</Text>
            </Box>

            <Menu>
                <MenuButton
                    as={IconButton}
                    aria-label='Options'
                    icon={<HamburgerIcon color={'white'}/>}
                    bg={'transparent'}
                    px={0}
                    py={0}
                    _hover={{bg: 'transparent'}}
                />
                <MenuList>
                    <MenuItem icon={<IoLogOutOutline />} onClick={accountEngine.logout}>
                        Logout
                    </MenuItem>
                </MenuList>
            </Menu>
        </Box>
    );
}

export default ProfileTab;
