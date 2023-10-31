import React from 'react';
import {Text} from "@chakra-ui/react";

export function MenuItem(props: any) {

    const name: string = props.name;
    const isSelected: boolean = props.isSelected;
    const id: string = props.id;
    const setSelectedTab: (id: string) => void = props.setSelectedTab;

    return (
        <Text fontWeight={'semibold'}
              color={isSelected ? 'white' : '#767676'}
              fontSize={isSelected ? '24px' : '16px'}
              letterSpacing={isSelected ? '-1px' : '-.5px'}
              as={'div'}
              onClick={() => setSelectedTab(id)}>
            {name}
        </Text>
    );
}

export function MenuTile(props: any) {
    const name: string = props.name;

    return (
        <Text textTransform={'uppercase'} color={'#535353'} fontSize={'12px'}>{name}</Text>
    )
}
