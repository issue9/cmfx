// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { JSX } from 'solid-js';

import { Activator, type ActivatorProps, type ActivatorRef } from './activator';
import { Panel, type PanelProps, type PanelRef } from './panel';

export type Ref<P extends boolean = false> = P extends true ? ActivatorRef : PanelRef;

export type Props = ActivatorProps | PanelProps;

export function Root(props: Props): JSX.Element {
	if (props.activator) {
		return <Activator {...props} />;
	}
	return <Panel {...props} />;
}
