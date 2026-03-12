// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Admin } from '@admin/app';
import type { Sex, State } from '@admin/schemas';

export type Member = {
	id: number;
	nickname: string;
	no: string;
	sex: Sex;
	state: State;

	avatar?: string;
	birthday?: string;
	created?: string;
	passports?: Admin['passports'];
};
