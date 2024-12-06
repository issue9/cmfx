// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { MenuItem, Route } from '@/app/options/route';
import { Pages } from '@/pages/pages';
import { default as Members } from './members';

export class members implements Pages {
    static Members = Members;
    
    readonly #prefix: string;

    private constructor(prefix: string) {
        this.#prefix = prefix;
    }

    static build(prefix: string) {
        return new members(prefix);
    }

    routes(): Array<Route> {
        return [
            { path: this.#prefix, component: ()=>Members({routePrefix: this.#prefix}) },
        ];
    }

    menus(): Array<MenuItem> {
        return [
            { type: 'item', icon: 'group', label: '_i.page.member.member', path: this.#prefix },
        ];
    }
}