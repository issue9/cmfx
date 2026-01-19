// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Code, useOptions } from '@cmfx/components';

export default function() {
    const [, options] = useOptions();

    return <Code lang="ts">
        {JSON.stringify(options, null, 4)}
    </Code>;
}
