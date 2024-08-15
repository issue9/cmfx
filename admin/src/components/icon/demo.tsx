// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { boolSelector, Demo } from '@/components/base/demo';

export default function() {
    const [fillS, fill] = boolSelector('fill', false);

    return <Demo settings={
        <>
            {fillS}
        </>
    } stages={
        <>
            <span class="c--icon" classList={{ 'fill': fill() }}>face</span>
            <span class="c--icon" classList={{ 'fill': fill() }}>close</span>
            <span class="c--icon" classList={{ 'fill': fill() }}>person</span>
        </>
    } />;
}
