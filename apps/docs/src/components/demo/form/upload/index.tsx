// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Type } from '@cmfx/vite-plugin-api';
import IconUpload from '~icons/flowbite/upload-solid';

import type { Info } from '@docs/components/base';
import { Stages } from '@docs/components/stages';

import { default as api } from './api.json' with { type: 'json' };

import { default as Upload } from './upload';
import { default as upload } from './upload.tsx?raw';

export default function(): Info {
    return {
        kind: 'data-input', title: '_d.demo.upload', icon: IconUpload, path: 'form/upload',
        component: () => <Stages dir='form/upload' api={api as Array<Type>} stages={[
            { component: Upload, source: upload, title: 'upload' },
        ]}>
        </Stages>,
    };
}
