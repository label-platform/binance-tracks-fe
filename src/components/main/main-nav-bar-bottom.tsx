import { TRIconButton } from '@components/common/buttons/icon-button';
import { Row } from '@components/common/flex';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp';
import Link from 'next/link';

export function MainNavBarBottom() {
    return (
        <Row gap={3}>
            <Link href="inventory" passHref>
                <span>
                    <TRIconButton color="light" variant="none" sizing="lg" asIcon={<HeadphonesIcon />} />
                </span>
            </Link>
            <Link href="marketplace" passHref>
                <span>
                    <TRIconButton color="light" variant="none" sizing="lg" asIcon={<ShoppingCartSharpIcon />} />
                </span>
            </Link>
        </Row>
    );
}
