// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test, describe } from 'vitest';

import { QRCode, Ref } from './qrcode';
import styles from './style.module.css';
import { ComponentTester } from '@/context/context.spec';

describe('QRCode', async () => {
    let ref: Ref;
    const ct = await ComponentTester.build(
        'QRCode',
        props => <QRCode {...props} ref={el => ref = el} cornerDotType='square'
            errorCorrectionLevel='L' cornerSquareType='dots' value='123' />
    );

    test('qrcode', async () => {
        const c = ct.result.container.firstElementChild;
        expect(c).toHaveClass(styles.qrcode);
    });

    test('ref', async () => {
        expect(ref!.element()).not.toBeUndefined();
        expect(ref!.qrCodeStyling()).not.toBeUndefined();
    });

    test('props', () => ct.testProps());
});
