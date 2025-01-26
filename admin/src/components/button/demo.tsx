// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Accessor, For, JSX, Setter } from 'solid-js';

import { arraySelector, boolSelector, Demo, palettesWithUndefined, Stage } from '@/components/base/demo';
import { Icon } from '@/components/icon';
import { Button } from './button';
import { ConfirmButton } from './confirm';
import { ButtonGroup } from './group';
import { LinkButton } from './link';
import { SplitButton } from './split';
import { Kind, kinds } from './types';

export function kindSelector(v: Kind = 'fill'): [JSX.Element, Accessor<Kind>, Setter<Kind>] {
    return arraySelector('风格', kinds, v);
}

export default function() {
    const [styleS, style] = kindSelector('fill');
    const [disabledS, disabled] = boolSelector('disabled');
    const [roundedS, rounded] = boolSelector('rounded');

    const Links = () => <div class="flex flex-wrap items-center gap-2 my-4">
        <For each={palettesWithUndefined}>
            {(c) => (
                <LinkButton href="./" disabled={disabled()} rounded={rounded()} kind={style()} palette={c}>{c ? c : 'undefined'}</LinkButton>
            )}
        </For>
        <LinkButton href="./" disabled={disabled()} rounded={rounded()} kind={style()} palette="primary">
            <Icon class="!mr-1" icon="face" />with icon
        </LinkButton>

        <Button rounded kind='fill' palette='tertiary'>对比按钮</Button>
    </div>;

    const Buttons = () => <div class="flex flex-wrap items-center gap-2 my-4">
        <For each={palettesWithUndefined}>
            {(c) => (
                <Button disabled={disabled()} rounded={rounded()} kind={style()} palette={c}>{c ? c : 'undefined'}</Button>
            )}
        </For>
        <Button disabled={disabled()} rounded={rounded()} kind={style()} palette="primary">
            <span class="c--icon mr-1">face</span>with icon
        </Button>

        <ConfirmButton onClick={() => alert('confirm')} disabled={disabled()} rounded={rounded()} kind={style()} palette='tertiary'>confirm button</ConfirmButton>
    </div>;

    const IconButtons = () => <div class="flex flex-wrap items-center gap-2">
        <For each={palettesWithUndefined}>
            {(c) => (
                <Button icon title={c ? c : 'undefined'} disabled={disabled()} rounded={rounded()} kind={style()} palette={c}>sync</Button>
            )}
        </For>
        <Button rounded kind='fill' palette='tertiary'>对比按钮</Button>
        <ConfirmButton prompt={<p>这是一段比较长的文字内容</p>} onClick={() => alert('confirm')} disabled={disabled()} rounded={rounded()} kind={style()} palette='tertiary' icon ok={<><span class="c--icon mr-2">task_alt</span>OK</>} cancel='cancel'>recommend</ConfirmButton>
    </div>;

    const SplitButtons = () => <div class="flex flex-wrap items-center gap-2">
        <For each={palettesWithUndefined}>
            {(c) => (
                <SplitButton palette={c} kind={style()} rounded={rounded()} disabled={disabled()} menus={[
                    {type: 'item', label: 'button1', onClick: ()=>console.log('btn1')},
                    {type: 'item', label: 'button2', onClick: ()=>console.log('btn2')},
                    {type: 'divider'},
                    {type: 'item', label: 'confirm', onClick: ()=>confirm('confirm')},
                ]}>split-button</SplitButton>
            )}
        </For>
    </div>;

    const ButtonGroupsH = () => <div class="flex flex-wrap items-center gap-2">
        <For each={palettesWithUndefined}>
            {(c)=>(
                <>
                    <ButtonGroup rounded={rounded()} palette={c} kind={style()} disabled={disabled()}>
                        <Button checked>abc</Button>
                        <Button>def</Button>
                        <Button>hij</Button>
                    </ButtonGroup>
                    <br />
                </>
            )}
        </For>
    </div>;
    
    const ButtonGroupsV = () => <div class="flex flex-wrap items-center gap-2">
        <For each={palettesWithUndefined}>
            {(c) => (
                <>
                    <ButtonGroup class="flex-col" rounded={rounded()} palette={c} kind={style()} disabled={disabled()}>
                        <Button>abc</Button>
                        <Button>def</Button>
                        <Button>hij</Button>
                    </ButtonGroup>
                    <br />
                </>
            )}
        </For>
    </div>;

    const IconButtonGroups = () => <div class="flex flex-wrap items-center gap-2">
        <For each={palettesWithUndefined}>
            {(c)=>(
                <>
                    <ButtonGroup rounded={rounded()} palette={c} kind={style()} disabled={disabled()}>
                        <Button icon>face</Button>
                        <Button icon>close</Button>
                        <Button icon>sync</Button>
                    </ButtonGroup>
                    <br />
                </>
            )}
        </For>
    </div>;

    const LinkButtonGroups = () => <div class="flex flex-wrap items-center gap-2">
        <For each={palettesWithUndefined}>
            {(c) => (
                <>
                    <ButtonGroup rounded={rounded()} palette={c} kind={style()} disabled={disabled()}>
                        <LinkButton href='.'>abc</LinkButton>
                        <LinkButton href='.'>def</LinkButton>
                        <LinkButton href='.'>hij</LinkButton>
                    </ButtonGroup>
                    <br />
                </>
            )}
        </For>
    </div>;

    const LinkIconButtonGroups = () => <div class="flex flex-wrap items-center gap-2">
        <For each={palettesWithUndefined}>
            {(c) => (
                <>
                    <ButtonGroup rounded={rounded()} palette={c} kind={style()} disabled={disabled()}>
                        <LinkButton icon href="">face</LinkButton>
                        <LinkButton icon href="">close</LinkButton>
                        <LinkButton icon href="">sync</LinkButton>
                    </ButtonGroup>
                    <br />
                </>
            )}
        </For>
    </div>;

    const Block = () => <div class="flex flex-col gap-y-2">
        <Button disabled={disabled()} rounded={rounded()} kind={style()} palette='primary'>block</Button>

        <Button disabled={disabled()} rounded={rounded()} kind={style()} palette="primary">
            <span class="c--icon mr-1">face</span>with icon
        </Button>

        <ButtonGroup rounded={rounded()} palette='primary' kind={style()} disabled={disabled()}>
            <Button>abc</Button>
            <Button>def</Button>
            <Button>hij</Button>
            <Button>klm</Button>
        </ButtonGroup>
    </div>;

    return <Demo settings={
        <>
            {styleS}
            {disabledS}
            {roundedS}
        </>
    }>
        <Stage title="button">
            <Buttons />
        </Stage>

        <Stage title='link'>
            <Links />
        </Stage>

        <Stage title='icon-button'>
            <IconButtons />
        </Stage>

        <Stage title='split-button'>
            <SplitButtons />
        </Stage>

        <Stage title="button-group">
            <ButtonGroupsH />
        </Stage>

        <Stage title="button-group">
            <ButtonGroupsV />
        </Stage>

        <Stage title='icon-button-group'>
            <IconButtonGroups />
        </Stage>

        <Stage title="link-button-group">
            <LinkButtonGroups />
        </Stage>

        <Stage title='link-icon-button-group'>
            <LinkIconButtonGroups />
        </Stage>

        <Stage title="block" class="w-full">
            <Block />
        </Stage>
    </Demo>;
}
