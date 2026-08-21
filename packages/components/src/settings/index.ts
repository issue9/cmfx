// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Settings as C, Item, Separator, type SettingsItemProps, type SettingsProps, type SettingsRef } from './root';

export const Settings = Object.assign(C, {
	Item,
	Separator,
});

export namespace Settings {
	export type ItemProps = SettingsItemProps;
	export type Props = SettingsProps;
	export type Ref = SettingsRef;
}
