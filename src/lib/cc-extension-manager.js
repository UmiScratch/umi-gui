/* eslint-disable no-unused-vars */
import {
    initExtension,
    disableExtension,
    enableExtension
} from '../reducers/cc-extension';
import {
    addLocales,
    updateLocale
} from '../reducers/locales';
// Extension settings are temporarily unavailable for Umi
/*
import {addNewSetting} from '../reducers/settings';
import {newExtensionSettings} from '../reducers/extension-settings';
*/

import JSZip from 'jszip';
import mime from 'mime-types';
import vm from 'vm';

import ClipCCExtension from 'clipcc-extension';

import musicIconURL from './libraries/extensions/music/music.png';
import musicInsetIconURL from './libraries/extensions/music/music-small.svg';

import penIconURL from './libraries/extensions/pen/pen.png';
import penInsetIconURL from './libraries/extensions/pen/pen-small.svg';

import videoSensingIconURL from './libraries/extensions/videoSensing/video-sensing.png';
import videoSensingInsetIconURL from './libraries/extensions/videoSensing/video-sensing-small.svg';

import text2speechIconURL from './libraries/extensions/text2speech/text2speech.png';
import text2speechInsetIconURL from './libraries/extensions/text2speech/text2speech-small.svg';

import translateIconURL from './libraries/extensions/translate/translate.png';
import translateInsetIconURL from './libraries/extensions/translate/translate-small.png';
import makeymakeyIconURL from './libraries/extensions/makeymakey/makeymakey.png';
import makeymakeyInsetIconURL from './libraries/extensions/makeymakey/makeymakey-small.svg';

import microbitIconURL from './libraries/extensions/microbit/microbit.png';
import microbitInsetIconURL from './libraries/extensions/microbit/microbit-small.svg';

import ev3IconURL from './libraries/extensions/ev3/ev3.png';
import ev3InsetIconURL from './libraries/extensions/ev3/ev3-small.svg';

import wedo2IconURL from './libraries/extensions/wedo2/wedo.png';
import wedo2InsetIconURL from './libraries/extensions/wedo2/wedo-small.svg';

import boostIconURL from './libraries/extensions/boost/boost.png';
import boostInsetIconURL from './libraries/extensions/boost/boost-small.svg';
import gdxforIconURL from './libraries/extensions/gdxfor/gdxfor.png';
import gdxforInsetIconURL from './libraries/extensions/gdxfor/gdxfor-small.svg';

import twIcon from './libraries/extensions/tw/tw.svg';

const builtinExtensions = [
    {
        extensionId: 'music',
        iconURL: musicIconURL,
        insetIconURL: musicInsetIconURL,
        author: 'Scratch Team',
        name: 'gui.extension.music.name',
        description: 'gui.extension.music.description'
    },
    {
        extensionId: 'pen',
        iconURL: penIconURL,
        insetIconURL: penInsetIconURL,
        author: 'Scratch Team',
        name: 'gui.extension.pen.name',
        description: 'gui.extension.pen.description'
    },
    {
        extensionId: 'videoSensing',
        iconURL: videoSensingIconURL,
        insetIconURL: videoSensingInsetIconURL,
        author: 'Scratch Team',
        name: 'gui.extension.videosensing.name',
        description: 'gui.extension.videosensing.description'
    },
    {
        extensionId: 'text2speech',
        iconURL: text2speechIconURL,
        insetIconURL: text2speechInsetIconURL,
        author: ['Scratch Team', 'Amazon Web Services'],
        name: 'gui.extension.text2speech.name',
        description: 'gui.extension.text2speech.description',
        requirement: ['internet']
    },
    {
        extensionId: 'translate',
        iconURL: translateIconURL,
        insetIconURL: translateInsetIconURL,
        author: ['Scratch Team', 'Google'],
        name: 'gui.extension.translate.name',
        description: 'gui.extension.translate.description',
        requirement: ['internet']
    },
    {
        extensionId: 'makeymakey',
        iconURL: makeymakeyIconURL,
        insetIconURL: makeymakeyInsetIconURL,
        author: ['Scratch Team', 'JoyLabz'],
        name: 'Makey Makey',
        description: 'gui.extension.makeymakey.description'
    },
    {
        extensionId: 'micro:bit',
        iconURL: microbitIconURL,
        insetIconURL: microbitInsetIconURL,
        author: ['Scratch Team', 'micro:bit'],
        name: 'micro:bit',
        description: 'gui.extension.microbit.description',
        requirement: ['internet', 'bluetooth']
    },
    {
        extensionId: 'ev3',
        iconURL: ev3IconURL,
        insetIconURL: ev3InsetIconURL,
        author: ['Scratch Team', 'LEGO'],
        name: 'LEGO MINDSTORMS EV3',
        description: 'gui.extension.ev3.description',
        requirement: ['internet', 'bluetooth']
    },
    {
        extensionId: 'boost',
        iconURL: boostIconURL,
        insetIconURL: boostInsetIconURL,
        author: ['Scratch Team', 'LEGO'],
        name: 'LEGO BOOST',
        description: 'gui.extension.boost.description',
        requirement: ['internet', 'bluetooth']
    },
    {
        extensionId: 'wedo2',
        iconURL: wedo2IconURL,
        insetIconURL: wedo2InsetIconURL,
        author: ['Scratch Team', 'LEGO'],
        name: 'LEGO Education WeDo 2.0',
        description: 'gui.extension.wedo2.description',
        requirement: ['internet', 'bluetooth']
    },
    {
        extensionId: 'gdxfor',
        iconURL: gdxforIconURL,
        insetIconURL: gdxforInsetIconURL,
        author: ['Scratch Team', 'Vernier'],
        name: 'Go Direct Force & Acceleration',
        description: 'gui.extension.gdxfor.description',
        requirement: ['internet', 'bluetooth']
    },
    {
        extensionId: 'tw',
        iconURL: twIcon,
        author: ['Turbowarp'],
        name: 'tw.twExtension.name',
        description: 'tw.twExtension.description',
        incompatibleWithScratch: true
    }
    ];

const loadBuiltinExtension = dispatch => {
    for (const ext of builtinExtensions) {
        ClipCCExtension.extensionManager.addInstance(ext.extensionId, {
            id: ext.extensionId,
            icon: ext.iconURL,
            inset_icon: ext.insetIconURL,
            author: ext.author,
            requirement: ext.requirement,
            api: 0,
            version: '1.0.0',
            switchable: false
        }, new ClipCCExtension.Extension());
        dispatch(initExtension(ext));
    }
};

const initExtensionAPI = (gui, vm, blocks) => {
    global.ClipCCExtension = ClipCCExtension;
    const apiInstance = {
        gui: gui.extensionAPI,
        vm: vm.extensionAPI,
        blocks: blocks
    };
    ClipCCExtension.api.registExtensionAPI(apiInstance);
};

const loadCcx = async (dispatch, file) => {
    let info = {};
    let isReload = false;

    const zipData = await JSZip.loadAsync(file);
    let instance = null;

    // Load info
    if ('info.json' in zipData.files) {
        const content = await zipData.files['info.json'].async('text');
        info = JSON.parse(content);
        if (ClipCCExtension.extensionManager.exist(info.id)) {
            console.warn('reloading extension...');
            try {
                ClipCCExtension.extensionManager.removeInstance(info.id);
                ClipCCExtension.extensionManager.unloadExtensions(
                    [info.id],
                    extension => ClipCCExtension.api.getVmInstance().extensionManager.unloadExtensionURL(info.id)
                );
                dispatch(disableExtension(info.id));
                isReload = true;
                console.log('reload complete');
            } catch (e) {
                console.error('error occurred while reloading', e);
            }
        }
        if (info.icon) {
            const data = await zipData.files[info.icon].async('arraybuffer');
            info.icon = URL.createObjectURL(new Blob(
                [data], {
                    type: mime.lookup(info.icon)}
            ));
        }
        if (info.inset_icon) {
            const data = await zipData.files[info.inset_icon].async('blob');
            info.inset_icon = URL.createObjectURL(new Blob(
                [data], {
                    type: mime.lookup(info.inset_icon)}
            ));
        }
        info.api = 1;
    } else {
        throw new Error('Cannot find \'info.json\' in ccx extension.');
    }


    // Load extension class
    if ('main.js' in zipData.files) {
        const script = new vm.Script(await zipData.files['main.js'].async('text'));
        const ExtensionPrototype = script.runInThisContext();
        instance = new ExtensionPrototype();
    } else {
        throw new Error('Cannot find \'main.js\' in ccx extension');
    }

    // Load locale
    const locale = {};
    for (const fileName in zipData.files) {
        const result = fileName.match(/^locales\/([A-Za-z0-9_-]+).json$/);
        if (result) {
            locale[result[1]] = JSON.parse(await zipData.files[fileName].async('text'));
        }
    }
    if (info.default_language && locale.hasOwnProperty(info.default_language)) {
        // default language param
        locale.default = locale[info.default_language];
    } else {
        locale.default = locale.en;
    }

    const extensionInfo = {
        extensionId: info.id,
        name: `${info.id}.name`,
        description: `${info.id}.description`,
        iconURL: info.icon,
        insetIconURL: info.inset_icon,
        author: info.author,
        requirement: info.requirement,
        instance: instance,
        switchable: true,
        api: info.api,
        version: info.version,
        fileContent: file
    };

    ClipCCExtension.extensionManager.addInstance(info.id, info, instance);
    dispatch(addLocales(locale));
    dispatch(updateLocale());
    dispatch(initExtension(extensionInfo));
    if (isReload) dispatch(enableExtension(info.id));
    return info;
};

export {
    loadBuiltinExtension,
    initExtensionAPI,
    loadCcx
};