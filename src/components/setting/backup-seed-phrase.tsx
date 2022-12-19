import React, { useEffect, useState, useRef } from 'react';
import styled from '@emotion/styled';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Column, Row } from '@components/common/flex';
import { useDrawerDispatch } from 'src/recoil/drawer';
import { DRAWER_ID } from '@constants/common';
import { Drawer } from '@components/common/drawer';
import { Button } from '@mui/material';
import { TRLabel } from '@components/common/labels/label';
import { HeaderDrawer } from '@components/common/header-drawer';
import { ChevronLeft } from '@mui/icons-material';
import { TRButton } from '@components/common/buttons/button';
import { useTheme } from '@emotion/react';
import { generateMnemonic } from 'bip39';
import { DrawerLayout } from '@components/common/layouts/drawer-layout';

const Contents = styled(Column)`
    color: white;
    padding: 32px;
    word-break: break-all;
    width: 100%;
    border: 1px solid white;
    border: 1px solid ${(props) => props.theme.palette.primary.main};
    margin-bottom: 16px;
    border-radius: 6px;
`;
const NumberColor = styled.span`
    color: ${(props) => props.theme.palette.primary.light};
    margin-right: 5px;
`;

export function BackupSeedPhrase() {
    const theme = useTheme();
    const drawerDispatch = useDrawerDispatch();
    const [mnemonics, setMnemonics] = useState<Array<string>>([]);
    const [isShow, setIsshow] = useState(false);
    const emptyArr = Array(12).fill('______');

    useEffect(() => {
        const mnemonic = generateMnemonic();
        setMnemonics(mnemonic.split(' '));
    }, []);

    const showList = () => {
        setIsshow(true);
    };
    const blindList = () => {
        setIsshow(false);
    };
    const handleCloseButton = () => {
        drawerDispatch.close(DRAWER_ID.BACKUP_SEED_PHRASE);
    };

    return (
        <Drawer
            from="right"
            paperSx={{
                backgroundColor: '#121212',
            }}
            drawerID={DRAWER_ID.BACKUP_SEED_PHRASE}
            widthPercent={100}
            heightPercent={100}
            onClose={handleCloseButton}
        >
            <DrawerLayout isNoBottomBar>
                <Column>
                    <HeaderDrawer
                        asLeftIcon={<ChevronLeft onClick={handleCloseButton} sx={{ fill: 'white' }} />}
                        title="Seed Phrase"
                    />
                    <Row style={{ padding: '20px', textAlign: 'center', paddingTop: '0' }}>
                        <TRLabel sizing="sm">
                            Write down your Seed Phrase in the correct order on paper. Do not create a digital copy like
                            a screenshot, text file, or e-mail.
                        </TRLabel>
                    </Row>
                    <Contents>
                        <Column gap={1}>
                            {isShow
                                ? mnemonics.map((mnemonic, index) => {
                                      const number = index + 1;
                                      return (
                                          <Row key={`${index}mnemonics`}>
                                              <TRLabel weight="bold">
                                                  <NumberColor>{number}.</NumberColor> {mnemonic}
                                              </TRLabel>
                                          </Row>
                                      );
                                  })
                                : emptyArr.map((empty, index) => {
                                      const number = index + 1;
                                      return (
                                          <Row key={index}>
                                              <TRLabel weight="bold">
                                                  <NumberColor>{number}.</NumberColor> {empty}
                                              </TRLabel>
                                          </Row>
                                      );
                                  })}
                        </Column>
                    </Contents>
                    <TRButton
                        onMouseDown={showList}
                        onMouseUp={blindList}
                        onTouchStart={showList}
                        onTouchEnd={blindList}
                        style={{
                            width: '100%',
                            height: '56px',
                            padding: '16px',
                            marginBottom: '16px',
                            color: theme.palette.text.disabled,
                        }}
                        type="submit"
                    >
                        <TRLabel disabled={isShow}>Press and hold to reveal</TRLabel>
                    </TRButton>
                </Column>
            </DrawerLayout>
        </Drawer>
    );
}
