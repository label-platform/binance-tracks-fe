/* eslint-disable react/display-name */
import React from 'react';
import SVGPlayer from 'public/images/icons/play.svg';
import SVGAttributeComfort from 'public/images/icons/attribute-comfort.svg';
import SVGAttributeLuck from 'public/images/icons/attribute-luck.svg';
import SVGAttributeResilience from 'public/images/icons/attribute-resilience.svg';
import SVGAttributeEfficiency from 'public/images/icons/attribute-efficiency.svg';
import SVGLogo from 'public/images/icons/logo.svg';
import SVGEnergy from 'public/images/icons/energy.svg';
import SVGDockLegendary from 'public/images/icons/dock-legendary.svg';
import SVGDockEpic from 'public/images/icons/dock-epic.svg';
import SVGDockRare from 'public/images/icons/dock-rare.svg';
import SVGDockUncommon from 'public/images/icons/dock-uncommon.svg';
import SVGDockCommon from 'public/images/icons/dock-common.svg';
import SVGStickerChecked from 'public/images/icons/sticker-checked.svg';
import SVGSellMenu from 'public/images/icons/sell-menu.svg';
import SVGTransferMenu from 'public/images/icons/transfer-menu.svg';
import SVGLeaseMenu from 'public/images/icons/lease-menu.svg';
import SVGMintMenu from 'public/images/icons/mint-menu.svg';
import SVGLevelUpMenu from 'public/images/icons/levelup-menu.svg';
import SVGChargeMenu from 'public/images/icons/charge-menu.svg';
import SVGBLB from 'public/images/icons/blb-icon.svg';
import SVGGoogleAuthenticator from 'public/images/icons/google-authenticator.svg';
import { QUALITY, QUALITY_GUARD } from '@models/common.interface';

export const PlayerIcon = React.memo(() => <SVGPlayer />);
export const AttributeComfortIcon = React.memo(() => <SVGAttributeComfort />);
export const AttributeLuckIcon = React.memo(() => <SVGAttributeLuck />);
export const AttributeResilienceIcon = React.memo(() => <SVGAttributeResilience />);
export const AttributeEfficiencyIcon = React.memo(() => <SVGAttributeEfficiency />);
export const LogoIcon = React.memo(() => <SVGLogo />);
export const EnergyIcon = React.memo(() => <SVGEnergy />);
export const StickerCheckedIcon = React.memo(() => <SVGStickerChecked />);
export const SellMenuIcon = React.memo(() => <SVGSellMenu />);
export const TransferMenuIcon = React.memo(() => <SVGTransferMenu />);
export const LeaseMenuIcon = React.memo(() => <SVGLeaseMenu />);
export const MintMenuIcon = React.memo(() => <SVGMintMenu />);
export const LevelUpMenuIcon = React.memo(() => <SVGLevelUpMenu />);
export const ChargeMenuIcon = React.memo(() => <SVGChargeMenu />);
export const BLBIcon = React.memo(() => <SVGBLB />);
export const GoogleAuthenticatorIcon = React.memo(() => <SVGGoogleAuthenticator />);

const DockLegendaryIcon = React.memo(() => <SVGDockLegendary />);
const DockEpicIcon = React.memo(() => <SVGDockEpic />);
const DockRareIcon = React.memo(() => <SVGDockRare />);
const DockUncommonIcon = React.memo(() => <SVGDockUncommon />);
const DockCommonIcon = React.memo(() => <SVGDockCommon />);
export const DockBarIcon = React.memo(({ quality }: { quality: QUALITY_GUARD }) => {
    switch (quality) {
        case QUALITY.COMMON:
            return <DockCommonIcon />;
        case QUALITY.UNCOMMON:
            return <DockUncommonIcon />;
        case QUALITY.RARE:
            return <DockRareIcon />;
        case QUALITY.EPIC:
            return <DockEpicIcon />;
        case QUALITY.LEGENDARY:
            return <DockLegendaryIcon />;
        default:
            return null;
    }
});
