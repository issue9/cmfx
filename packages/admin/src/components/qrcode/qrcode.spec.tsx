// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { render } from '@solidjs/testing-library';
import { expect, test } from 'vitest';

import { QRCode } from './qrcode';

test('qrcode', async () => {
    const { container, unmount } = render(() => <QRCode cornerDotType='square' errorCorrectionLevel='L' cornerSquareType='dots' value='123'></QRCode>);
    const c = container.children.item(0)!;
    expect(c).toHaveClass('c--qrcode');

    unmount();
});