// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Stages } from '../../stages';

import { default as Link } from './link';
import { default as link } from './link.tsx?raw';

import { default as Toggle } from './toggle';
import { default as toggle } from './toggle.tsx?raw';

import { default as Split } from './split';
import { default as split } from './split.tsx?raw';

import { default as Block } from './block';
import { default as block } from './block.tsx?raw';

import { default as Group } from './group';
import { default as group } from './group.tsx?raw';

import { default as Button } from './button';
import { default as button } from './button.tsx?raw';

import { default as api } from './api.json';

export default function(): JSX.Element {
    return <Stages dir='demo/button' api={api} stages={[
        { component: Button, source: button, title: 'button' },
        { component: Link, source: link, title: 'link button' },
        { component: Toggle, source: toggle, title: 'toggle button' },
        { component: Split, source: split, title: 'split button' },
        { component: Block, source: block, title: 'block' },
        { component: Group, source: group, title: 'group' },
    ]}>
    </Stages>;
}
