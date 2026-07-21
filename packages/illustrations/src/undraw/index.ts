// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Gallery } from '@illustrations/common';
import { default as Error401 } from './401';
import { default as Error402 } from './402';
import { default as Error403 } from './403';
import { default as Error404 } from './404';
import { default as Error429 } from './429';
import { default as Error500 } from './500';
import { default as Error503 } from './503';
import { default as Error504 } from './504';
import { default as Bug } from './bug';
import { default as Building } from './building';
import { default as Empty } from './empty';
import { default as Login } from './login';
import { default as Offline } from './offline';

export const undraw: Gallery = {
	Error401,
	Error402,
	Error403,
	Error404,
	Error429,
	Error500,
	Error503,
	Error504,
	Bug,
	Building,
	Empty,
	Login,
	Offline,
};
