// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();
