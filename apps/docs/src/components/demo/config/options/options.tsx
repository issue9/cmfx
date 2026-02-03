// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Code, useOptions } from '@cmfx/components';
import { JSX } from 'solid-js';

export default function (): JSX.Element {
	const [, options] = useOptions();

	return <Code lang="ts">{JSON.stringify(options, null, 4)}</Code>;
}
