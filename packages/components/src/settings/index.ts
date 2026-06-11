// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Settings as C, Item, Separator } from './root';

export const Settings = Object.assign(C, {
	Item,
	Separator,
});

export namespace Settings {
	export type ItemProps = import('./root').SettingsItemProps;
	export type Props = import('./root').SettingsProps;
	export type Ref = import('./root').SettingsRef;
}
