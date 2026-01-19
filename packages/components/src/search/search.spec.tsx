// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, test } from 'vitest';

import { ComponentTester } from '@components/context/context.spec';
import { MenuItemItem } from '@components/menu';
import Search from './search';

describe('Search', async () => {
    const search =
        async (_: string): Promise<Array<MenuItemItem<string>>> => [{ type: 'item', value: 'v', label: 'label' }];
    const ct = await ComponentTester.build(
        'Search',
        props => <Search onSearch={search} {...props} />
    );

    test('props', () => ct.testProps());
});
