// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import Search from './search';
import { MenuItemItem } from '@/menu';

describe('Search', async () => {
    const search =
        async (_: string): Promise<Array<MenuItemItem<string>>> => [{ type: 'item', value: 'v', label: 'label' }];
    const ct = await ComponentTester.build(
        'Search',
        props => <Search onSearch={search} {...props} />
    );

    test('props', () => ct.testProps());
});
