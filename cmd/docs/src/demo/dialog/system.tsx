// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { alert, Button, confirm, prompt } from '@cmfx/components';

export default function() {
    return <div>
        <Button onclick={async () => {
            await alert('msg');
            console.log('alert');
        }}>alert</Button>

        <Button onclick={async () => {
            console.log('confirm:', await confirm('这是一段非常非常长的文字内容！这是一段非常非常长的文字内容！这是一段非常非常长的文字内容！这是一段非常非常长的文字内容！'));
        }}>confirm</Button>

        <Button onclick={async () => {
            console.log('prompt:', await prompt('msg', 'def'));
        }}>prompt</Button>

        <Button onclick={() => {
            window.alert('msg');
            console.log('alert');
        }}>system.alert</Button>
        <Button onclick={() => {
            console.log('confirm:', window.confirm('这是一段非常非常长的文字内容！这是一段非常非常长的文字内容！这是一段非常非常长的文字内容！这是一段非常非常长的文字内容！'));
        }}>system.confirm</Button>
        <Button onclick={() => {
            console.log('prompt:', window.prompt('msg', 'def'));
        }}>system.prompt</Button>
    </div>;
}
