// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';
import { Formatter } from '@cmfx/components';

export default function Bytes(): JSX.Element {
	return <Formatter.Bytes value={12345678}>;
}
