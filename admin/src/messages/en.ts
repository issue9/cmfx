// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

const messages = {
    _i: {
        fullscreen: 'full screen',
        settings: 'settings',
        ok: 'OK',
        database: 'database',
        search: 'search',
        cancel: 'cancel',
        reset: 'reset',
        refresh: 'refresh',
        areYouSure: 'are you sure?',
        page: { // 页面的翻译内容
            editItem: 'edit item',
            deleteItem: 'delete item',
            newItem: 'new item',
            created: 'create time',
            id: 'ID',
            no: 'NO',
            state: 'state',
            states: {
                normal: 'normal',
                locked: 'locked',
                deleted: 'deleted'
            },
            actions: 'actions',
            sex: 'sex',
            sexes: {
                male: 'male',
                female: 'female',
                unknown: 'unknown'
            },
            system: {
                apis: 'API',
                apiViewer: 'API Viewer',
                router: 'router',
                method: 'method',
                pattern: 'pattern',
                count: 'count',
                last: 'last',
                userErrors: 'errors(4xx)',
                serverErrors: 'errors(5xx)',
                max: 'max',
                min: 'min',
                spend: 'spend',

                services: 'services',
                jobs: 'jobs',
                serviceViewer: 'service viewer',
                serviceState: 'state',
                serviceStates: {
                    running: 'running',
                    stopped: 'stopped',
                    failed: 'failed'
                },
                title: 'title',
                error: 'error message',
                next: 'next',
                prev: 'prev',

                info: 'info',
                states: 'states',
                system: 'system',
                backupDB: 'backup database',
                backupDBHelp: 'Manually a backup operation. The scheduled tasks will also perform backup operations with {{cron}}.',
                clearCache: 'clear cache',
                clearCacheHelp: 'Clear all cache of browser and logout current login user',
                name: 'name',
                arch: 'arch',
                cpus: 'cups',
                go: 'Go',
                uptime: 'uptime',
                platform: 'platform',
                family: 'family',
                version: 'version',
                connections: 'connections',
                unlimited: 'unlimited',
                connectionsHelp: 'allow max open connections: {{maxOpenConnections}}\nopen connections: {{openConnections}}\nin use: {{inUse}}\nidle: {{idle}}',
                waitCount: 'wait count',
                waitDuration: 'wait duration',
            },
            admin: {
                admin: 'administrator',
                adminsManager: 'admin manager',
                name: 'name',
                nickname: 'nick name'
            },
            securitylog: {
                securitylog: 'security logs',
                content: 'content',
                ip: 'IP',
                ua: 'user agent',
            },
            roles: {
                roles: 'roles',
                rolesManager: 'roles manager',
                permission: 'permission',
                name: 'name',
                editPermission: 'edit permission',
                description: 'description'
            }
        },
        table: {
            nodata: 'no data',
            exportTo: 'export to {{type}}'
        },
        pagination: {
            prev: 'prev',
            next: 'next',
            firstPage: 'first page',
            lastPage: 'last page',
            items: '{{ start }}-{{ end }} of {{ count }}'
        },
        date: {
            monday: 'Mon',
            tuesday: 'Tue',
            wednesday: 'Wed',
            thursday: 'Thu',
            friday: 'Fri',
            saturday: 'Sat',
            sunday: 'Sun',
            january: 'Jan',
            february: 'Feb',
            march: 'Mar',
            april: 'Apr',
            may: 'May',
            june: 'Jun',
            july: 'Jul',
            august: 'Aug',
            september: 'Sep',
            october: 'Oct',
            november: 'Nov',
            december: 'Dec',
            today: 'today',
            now: 'now',
            prevMonth: 'prev month',
            prevYear: 'prev year',
            nextMonth: 'next month',
            nextYear: 'next year',
        },
        error: {
            backHome: 'back home',
            backPrev: 'back prev page',
            unknownError: 'unknown error',
            pageNotFound: 'page not found',
            forbidden: 'forbidden',
            internalServerError: 'server error',
        },
        login: {
            title: 'login',
            logout: 'logout',
            username: 'username',
            password: 'password'
        },
        theme: {
            mode: 'theme mode',
            modeDesc: 'customize the theme mode of the page',
            dark: 'dark',
            light: 'light',
            system: 'system',
            color: 'primary color',
            colorDesc: 'customize the theme primary color of the page',
            contrast: 'contrast',
            contrastDesc: 'customize the theme contrast of the page',
            nopreference: 'no preference',
            less: 'less',
            more: 'more'
        },
        contrast: {
            contrast: 'contrast',
            standard: 'standard',
            medium: 'medium',
            high: 'high'
        },
        locale: {
            locale: 'locale',
            localeDesc: 'set the ui language of the page',
            uiLanguage: 'ui language',
        }
    }
};

export default messages;

export type Messages = typeof messages;
