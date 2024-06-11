// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

export { create } from '@/app';

// utils
export { Fetcher } from '@/utils/fetch';
export type { Method, Page, Problem, Return, Token } from '@/utils/fetch';
export { sleep } from '@/utils/time';

// plugins
export { useAdmin } from '@/plugins';
export type { API, MenuItem, Options } from '@/plugins';

