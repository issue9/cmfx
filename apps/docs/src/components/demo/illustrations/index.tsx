// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import IconIllustration from '~icons/uil/illustration';

import type { Info } from '@docs/components/base';
import { default as E400 } from './400';
import { default as e400 } from './400.tsx?raw';
import { default as E401 } from './401';
import { default as e401 } from './401.tsx?raw';
import { default as E402 } from './402';
import { default as e402 } from './402.tsx?raw';
import { default as E403 } from './403';
import { default as e403 } from './403.tsx?raw';
import { default as E404 } from './404';
import { default as e404 } from './404.tsx?raw';
import { default as E429 } from './429';
import { default as e429 } from './429.tsx?raw';
import { default as E500 } from './500';
import { default as e500 } from './500.tsx?raw';
import { default as E503 } from './503';
import { default as e503 } from './503.tsx?raw';
import { default as E504 } from './504';
import { default as e504 } from './504.tsx?raw';
import { default as BUG } from './bug';
import { default as bug } from './bug.tsx?raw';
import { default as Building } from './building';
import { default as building } from './building.tsx?raw';
import { default as Login } from './login';
import { default as login } from './login.tsx?raw';

export default function (): Info {
	return {
		kind: 'general',
		title: '_d.demo.illustrations',
		icon: IconIllustration,
		path: 'illustrations',
		api: import.meta.glob('./api.*.json', { eager: true, import: 'default' }),
		stages: [
			{ component: E400, source: e400, title: '400' },
			{ component: E401, source: e401, title: '401' },
			{ component: E402, source: e402, title: '402' },
			{ component: E403, source: e403, title: '403' },
			{ component: E404, source: e404, title: '404' },
			{ component: E429, source: e429, title: '429' },
			{ component: E500, source: e500, title: '500' },
			{ component: E503, source: e503, title: '503' },
			{ component: E504, source: e504, title: '504' },
			{ component: BUG, source: bug, title: 'bug' },
			{ component: Building, source: building, title: 'Building' },
			{ component: Login, source: login, title: 'Login' },
		],
	};
}
