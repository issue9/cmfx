// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { RouteDefinition } from '@solidjs/router';

import { Contribute } from './contribute';

export function buildRoute(path: string): RouteDefinition {
    return {
        path: path,
        component: () => <Contribute />,
    };
}
