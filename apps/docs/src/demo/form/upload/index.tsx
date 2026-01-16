// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import { JSX } from 'solid-js';

import { default as api } from './api.json' with { type: 'json' };

import { default as Upload } from './upload';
import { default as upload } from './upload.tsx?raw';

import { Stages } from '../../../stages';

export default function(): JSX.Element {
    return <Stages dir='demo/form/upload' api={api as Array<Type>} stages={[
        { component: Upload, source: upload, title: 'upload' },
    ]}>
    </Stages>;
}
