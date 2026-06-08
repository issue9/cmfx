// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { AvailableEnumType } from '@components/base';
import type { CheckboxGroup } from '@components/checkbox';

export type Option<K extends AvailableEnumType = string> = CheckboxGroup.Option<K>;

export type Options<T extends AvailableEnumType = string> = CheckboxGroup.Options<T>;
