// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { default as api } from './api.json';

import { default as Panel } from './panel';
import { default as panel } from './panel.tsx?raw';

import { default as Picker } from './picker';
import { default as picker } from './picker.tsx?raw';

import { default as Preset } from './preset';
import { default as preset } from './preset.tsx?raw';

import { Stages } from '../../../stages';

export default function(): JSX.Element {
    return <Stages api={api} stages={[
        { component: <Panel />, source: panel, title: 'panel' },
        { component: <Picker />, source: picker, title: 'picker' },
        { component: <Preset />, source: preset, title: 'preset' },
    ]}>
    </Stages>;
}
