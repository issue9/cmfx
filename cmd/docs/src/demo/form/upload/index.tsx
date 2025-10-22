// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { default as api } from './api.json';

import { default as Upload } from './upload';
import { default as upload } from './upload.tsx?raw';

import { Stages } from '../../../stages';

export default function(): JSX.Element {
    return <Stages api={api} stages={[
        { component: <Upload />, source: upload, title: 'upload' },
    ]}>
    </Stages>;
}
