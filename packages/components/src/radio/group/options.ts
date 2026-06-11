// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { AvailableEnumType } from '@components/base';
import type { CheckboxGroup } from '@components/checkbox';

export type RadioGroupOption<T extends AvailableEnumType = string> = CheckboxGroup.Option<T>;

export type RadioGroupOptions<T extends AvailableEnumType = string> = CheckboxGroup.Options<T>;
