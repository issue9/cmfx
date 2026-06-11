// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import * as QR from 'qr-code-styling';

import { QRCode as C } from './root';

export const QRCode = Object.assign(C, {
	QRCodeStyling: QR.default,
});

export namespace QRCode {
	export type Props = import('./root').QRCodeProps;
	export type Ref = import('./root').QRCodeRef;
	export type CornerDotType = QR.CornerDotType;
	export type CornerSquareType = QR.CornerSquareType;
	export type DotType = QR.DotType;
}
