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

// ClipCC
import HTTPIOImage from './libraries/extensions/HTTPIO/HTTPIO.png';
import HTTPIOInsetImage from './libraries/extensions/HTTPIO/clipcc.httpio-small.svg';
import JSONImage from './libraries/extensions/JSON/JSON.png';
import JSONInsetImage from './libraries/extensions/JSON/ccjson-small.svg';

// Gitblock
import battleImage from './libraries/extensions/battle/battle.png';
import battleInsetImage from './libraries/extensions/battle/battle-small.svg';
import stringExtImage from './libraries/extensions/stringExt/string-ext.png';
import stringExtInsetImage from './libraries/extensions/stringExt/string-ext-small.svg';
import puzzleImage from './libraries/extensions/puzzle/puzzle.png';
import puzzleInsetImage from './libraries/extensions/puzzle/puzzle-small.svg';
import communityImage from './libraries/extensions/community/community.png';
import communityInsetImage from './libraries/extensions/community/community-small.svg';
import kinectImage from './libraries/extensions/kinect/kinect.png';
import kinectInsetImage from './libraries/extensions/kinect/kinect-small.svg';
import lazyAudioIconURL from './libraries/extensions/lazyAudio/lazy-audio.png';
import lazyAudioInsetIconURL from './libraries/extensions/lazyAudio/lazy-audio-small.svg';
import jsInsetIconURL from './libraries/extensions/js/js-small.svg';
import canvasIconURL from './libraries/extensions/canvas/canvas.png';
import canvasInsetIconURL from './libraries/extensions/canvas/canvas-small.svg';

// CCW
import CCWSugarIcon from './libraries/extensions/CCWSugar/CCWSugar.png';
import lazyMusicIcon from './libraries/extensions/lazyMusic/lazyMusic.png';
import Box2DIcon from './libraries/extensions/box2d/box2d.png';
import arkosExtensionsIcon from './libraries/extensions/arkosExtensions/arkosExtensions.png';
import ArkosArchiveCodeIcon from './libraries/extensions/ArkosArchiveCode/ArkosArchiveCode.png';
import GandiQuakeIcon from './libraries/extensions/GandiQuake/GandiQuake.jpg';
import CCWCanvasV2Icon from './libraries/extensions/CCWCanvasV2/CCWCanvasV2.png';
import GandiAchievementAndLeaderboardIcon from './libraries/extensions/GandiAchievementAndLeaderboard/GandiAchievementAndLeaderboard.jpg';
import RegExpVIIcon from './libraries/extensions/RegExpVI/RegExpVI.jpg';
import textIcon from './libraries/extensions/text/text.png';

// Xiaomawang
import XiaomaIcon  from './libraries/extensions/xiaoma/xiaoma.png';
import XiaomaInsetIcon  from './libraries/extensions/xiaoma/xiaomaInset.png';

import twIcon from './libraries/extensions/tw/tw.svg';
import customExtensionIcon from './libraries/extensions/custom/custom.svg';

const builtinExtensions = [
    {
        extensionId: 'music',
        iconURL: musicIconURL,
        insetIconURL: musicInsetIconURL,
        author: 'Scratch Team',
        name: 'gui.extension.music.name',
        description: 'gui.extension.music.description',
        tags: ['scratch']
    },
    {
        extensionId: 'pen',
        iconURL: penIconURL,
        insetIconURL: penInsetIconURL,
        author: 'Scratch Team',
        name: 'gui.extension.pen.name',
        description: 'gui.extension.pen.description',
        tags: ['scratch']
    },
    {
        extensionId: 'videoSensing',
        iconURL: videoSensingIconURL,
        insetIconURL: videoSensingInsetIconURL,
        author: 'Scratch Team',
        name: 'gui.extension.videosensing.name',
        description: 'gui.extension.videosensing.description',
        tags: ['scratch']
    },
    {
        extensionId: 'text2speech',
        iconURL: text2speechIconURL,
        insetIconURL: text2speechInsetIconURL,
        author: ['Scratch Team', 'Amazon Web Services'],
        name: 'gui.extension.text2speech.name',
        description: 'gui.extension.text2speech.description',
        requirement: ['internet'],
        tags: ['scratch']
    },
    {
        extensionId: 'translate',
        iconURL: translateIconURL,
        insetIconURL: translateInsetIconURL,
        author: ['Scratch Team', 'Google'],
        name: 'gui.extension.translate.name',
        description: 'gui.extension.translate.description',
        requirement: ['internet'],
        tags: ['scratch']
    },
    {
        extensionId: 'makeymakey',
        iconURL: makeymakeyIconURL,
        insetIconURL: makeymakeyInsetIconURL,
        author: ['Scratch Team', 'JoyLabz'],
        name: 'Makey Makey',
        description: 'gui.extension.makeymakey.description',
        tags: ['scratch']
    },
    {
        extensionId: 'micro:bit',
        iconURL: microbitIconURL,
        insetIconURL: microbitInsetIconURL,
        author: ['Scratch Team', 'micro:bit'],
        name: 'micro:bit',
        description: 'gui.extension.microbit.description',
        requirement: ['internet', 'bluetooth'],
        tags: ['scratch']
    },
    {
        extensionId: 'ev3',
        iconURL: ev3IconURL,
        insetIconURL: ev3InsetIconURL,
        author: ['Scratch Team', 'LEGO'],
        name: 'LEGO MINDSTORMS EV3',
        description: 'gui.extension.ev3.description',
        requirement: ['internet', 'bluetooth'],
        tags: ['scratch']
    },
    {
        extensionId: 'boost',
        iconURL: boostIconURL,
        insetIconURL: boostInsetIconURL,
        author: ['Scratch Team', 'LEGO'],
        name: 'LEGO BOOST',
        description: 'gui.extension.boost.description',
        requirement: ['internet', 'bluetooth'],
        tags: ['scratch']
    },
    {
        extensionId: 'wedo2',
        iconURL: wedo2IconURL,
        insetIconURL: wedo2InsetIconURL,
        author: ['Scratch Team', 'LEGO'],
        name: 'LEGO Education WeDo 2.0',
        description: 'gui.extension.wedo2.description',
        requirement: ['internet', 'bluetooth'],
        tags: ['scratch']
    },
    {
        extensionId: 'gdxfor',
        iconURL: gdxforIconURL,
        insetIconURL: gdxforInsetIconURL,
        author: ['Scratch Team', 'Vernier'],
        name: 'Go Direct Force & Acceleration',
        description: 'gui.extension.gdxfor.description',
        requirement: ['internet', 'bluetooth'],
        tags: ['scratch']
    },
    // ClipCC
    {
        extensionId: 'httpio',
        iconURL: HTTPIOImage,
        insetIconURL: HTTPIOInsetImage,
        author: ['Clipteam'],
        name: 'HTTPIO',
        description: 'Feel the charm of Internet!',
        incompatibleWithScratch: true,
        tags: ['clipcc']
    },
    {
        extensionId: 'ccjson',
        iconURL: JSONImage,
        insetIconURL: JSONInsetImage,
        author: ['Clipteam'],
        name: 'JSON',
        description: 'Useful JSON Extension.',
        incompatibleWithScratch: true,
        tags: ['clipcc']
    },
    // CCW
    {
        extensionId: 'GandiFermi',
        iconURL: customExtensionIcon,
        /*
        insetIconURL: ,
        */
        author: ['Shawn @ CCW'],
        name: 'Fermi',
        description: 'Unchain the limitation of Scratch.',
        incompatibleWithScratch: true,
        tags: ['ccw']
    },
    {
        extensionId: 'box2d',
        iconURL: Box2DIcon,
        /*
        insetIconURL: ,
        */
        author: ['Griffpatch @ Shawn'],
        name: 'Physics v1.1',
        description: 'Box2D Physics Extension.',
        incompatibleWithScratch: true,
        tags: ['ccw']
    },
    {
        extensionId: 'redBoard',
        iconURL: customExtensionIcon,
        /*
        insetIconURL: ,
        */
        author: ['Xigua Maker'],
        name: 'Xigua Red Board',
        description: '"Control" the world.',
        incompatibleWithScratch: true,
        tags: ['ccw']
    },
    {
        extensionId: 'faceSensing',
        iconURL: customExtensionIcon,
        /*
        insetIconURL: ,
        */
        author: ['ScratchLab'],
        name: 'Face Sensing',
        description: 'Sense faces with the camera.',
        incompatibleWithScratch: true,
        tags: ['ccw']
    },
    {
        extensionId: 'text',
        iconURL: textIcon,
        /*
        insetIconURL: ,
        */
        author: ['ScratchLab'],
        name: 'Animated Text',
        description: 'Bring words to life.',
        incompatibleWithScratch: true,
        tags: ['ccw']
    },
    {
        extensionId: 'lazyMusic',
        iconURL: lazyMusicIcon,
        /*
        insetIconURL: ,
        */
        author: ['CCW'],
        name: 'Lazy Music',
        description: 'Make project loads faster.',
        incompatibleWithScratch: true,
        tags: ['ccw']
    },
    {
        extensionId: 'CCWSugar',
        iconURL: CCWSugarIcon,
        /*
        insetIconURL: ,
        */
        author: ['CCW'],
        name: 'Syntactic Sugar',
        description: 'Less blocks, more creations.',
        incompatibleWithScratch: true,
        tags: ['ccw']
    },
    {
        extensionId: 'CCWCanvasV2',
        iconURL: CCWCanvasV2Icon,
        /*
        insetIconURL: ,
        */
        author: ['CCW'],
        name: 'CanvasV2',
        description: '"Control Canvas(Beta Test)',
        incompatibleWithScratch: true,
        tags: ['ccw']
    },
    {
        extensionId: 'GandiAStarExtension',
        iconURL: customExtensionIcon,
        /*
        insetIconURL: ,
        */
        author: ['-6, ob, Cappu & Shawn @ Gandi'],
        name: 'A Star Odyssey v1.2',
        description: 'A path-finding extension to help heroes find the way home',
        incompatibleWithScratch: true,
        tags: ['ccw']
    },
    {
        extensionId: 'GandiDolly',
        iconURL: customExtensionIcon,
        /*
        insetIconURL: ,
        */
        author: ['Shawn @ CCW'],
        name: 'Gandi Dolly v1.0.2',
        description: 'Beep Beep I\'m a sheep. All about clones.',
        incompatibleWithScratch: true,
        tags: ['ccw']
    },
    {
        extensionId: 'GandiMedia',
        iconURL: customExtensionIcon,
        /*
        insetIconURL: ,
        */
        author: ['Shawn @ CCW'],
        name: 'Gandi Media Util v1.0',
        description: 'Lazy load videos and audios, media playback with audio effects.',
        incompatibleWithScratch: true,
        tags: ['ccw']
    },
    {
        extensionId: 'CCWData',
        iconURL: customExtensionIcon,
        /*
        insetIconURL: ,
        */
        author: ['Nick & Shawn @ CCW'],
        name: 'Gandi Data Util v1.1',
        description: '☁️ Cloud data access is easy, with JSON utilities doubly so!',
        incompatibleWithScratch: true,
        tags: ['ccw']
    },
    {
        extensionId: 'GandiPureMath',
        iconURL: customExtensionIcon,
        /*
        insetIconURL: ,
        */
        author: ['Shawn @ CCW'],
        name: 'Gandi Pure Math v1.0',
        description: '"evaluates math expressions',
        incompatibleWithScratch: true,
        tags: ['ccw']
    },
    {
        extensionId: 'CCWMMO',
        iconURL: customExtensionIcon,
        /*
        insetIconURL: ,
        */
        author: ['Shawn @ CCW'],
        name: 'Gandi Simple MMO v1.0.3',
        description: 'With Gandi Simple MMO, you can design multi-player online game.',
        incompatibleWithScratch: true,
        tags: ['ccw']
    },
    {
        extensionId: 'VIDateTime',
        iconURL: customExtensionIcon,
        /*
        insetIconURL: ,
        */
        author: ['six-6 x CCW'],
        name: 'Date and Time Calculator v1.0',
        description: '"All about date time calculation',
        incompatibleWithScratch: true,
        tags: ['ccw']
    },
    {
        extensionId: 'RegExpVI',
        iconURL: RegExpVIIcon,
        /*
        insetIconURL: ,
        */
        author: ['six6 x CCW'],
        name: 'Regular expression VI',
        description: 'Create RegExp and find texts.',
        incompatibleWithScratch: true,
        tags: ['ccw']
    },
    {
        extensionId: 'arkosExtensions',
        iconURL: arkosExtensionsIcon,
        /*
        insetIconURL: ,
        */
        author: ['Arkos x CCW'],
        name: 'Arkos\' Extensions v1.2',
        description: 'Arkos presents, powerful(buggy) extensions with compliments.',
        incompatibleWithScratch: true,
        tags: ['ccw']
    },
    {
        extensionId: 'ArkosArchiveCode',
        iconURL: ArkosArchiveCodeIcon,
        /*
        insetIconURL: ,
        */
        author: ['Arkos x CCW'],
        name: 'Arkos Achieve Code v 1.0',
        description: 'Makes Save & Load system easier, and brings more useful features.',
        incompatibleWithScratch: true,
        tags: ['ccw']
    },
    {
        extensionId: 'GandiQuake',
        iconURL: GandiQuakeIcon,
        /*
        insetIconURL: ,
        */
        author: ['Shawn @ Gandi'],
        name: 'Gandi Quake v1.0',
        description: 'Quake, make a stunning fullscreen effects.',
        incompatibleWithScratch: true,
        tags: ['ccw']
    },
    {
        extensionId: 'GandiAchievementAndLeaderboard',
        iconURL: GandiAchievementAndLeaderboardIcon,
        /*
        insetIconURL: ,
        */
        author: ['Gandi'],
        name: 'Achievement & Lraderboard',
        description: 'Achievement & Lraderboard',
        incompatibleWithScratch: true,
        tags: ['ccw']
    },
    {
        extensionId: 'GandiTerminal',
        iconURL: customExtensionIcon,
        /*
        insetIconURL: ,
        */
        author: ['Shawn @ CCW'],
        name: 'Terminal v0.3.2',
        description: 'Terminal make debugging more easier.',
        incompatibleWithScratch: true,
        tags: ['ccw']
    },
    // Gitblock
    {
        extensionId: 'canvas',
        iconURL: canvasIconURL,
        insetIconURL: canvasInsetIconURL,
        author: ['Ye Jun'],
        name: 'Canvas',
        description: 'Advanced Canvas Extension.',
        incompatibleWithScratch: true,
        tags: ['gitblock']
    },
    {
        extensionId: 'lazyAudio',
        iconURL: lazyAudioIconURL,
        insetIconURL: lazyAudioInsetIconURL,
        author: ['Ye Jun'],
        name: 'Lazy Audio',
        description: 'Load audio lazily.',
        incompatibleWithScratch: true,
        tags: ['gitblock']
    },
    {
        extensionId: 'battle',
        iconURL: battleImage,
        insetIconURL: battleInsetImage,
        author: ['Ye Jun'],
        name: 'Battle',
        description: 'Strategy Battle Game Blocks.',
        incompatibleWithScratch: true,
        tags: ['gitblock']
    },
    {
        extensionId: 'stringExt',
        iconURL: stringExtImage,
        insetIconURL: stringExtInsetImage,
        author: ['Ye Jun'],
        name: 'String Extension',
        description: 'Process strings.',
        incompatibleWithScratch: true,
        tags: ['gitblock']
    },
    {
        extensionId: 'js',
        iconURL: stringExtImage,
        insetIconURL: jsInsetIconURL,
        author: ['Ye Jun'],
        name: 'JavaScript',
        description: 'Get, Decode, Encode, Post',
        incompatibleWithScratch: true,
        tags: ['gitblock']
    },
    {
        extensionId: 'community',
        iconURL: communityImage,
        insetIconURL: communityInsetImage,
        author: ['Ye Jun'],
        name: 'Community',
        description: 'Community blocks.',
        incompatibleWithScratch: true,
        tags: ['gitblock']
    },
    {
        extensionId: 'puzzle',
        iconURL: puzzleImage,
        insetIconURL: puzzleInsetImage,
        author: ['Ye Jun'],
        name: 'Puzzle',
        description: 'Puzzle blocks.',
        incompatibleWithScratch: true,
        tags: ['gitblock']
    },
    {
        extensionId: 'kinect',
        iconURL: kinectImage,
        insetIconURL: kinectInsetImage,
        author: ['Ye Jun'],
        name: 'Kinect',
        description: 'Kinect blocks.',
        incompatibleWithScratch: true,
        tags: ['gitblock']
    },
    {
        extensionId: 'xiaoma',
        iconURL: XiaomaIcon,
        insetIconURL: XiaomaInsetIcon,
        author: ['Xiaomawang'],
        name: 'XMW Blocks',
        description: 'XMW extend blocks.',
        incompatibleWithScratch: true,
        tags: ['other']
    },
    {
        extensionId: 'tw',
        iconURL: twIcon,
        author: ['Turbowarp'],
        name: 'tw.twExtension.name',
        description: 'tw.twExtension.description',
        incompatibleWithScratch: true,
        tags: ['other']
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
            version: '1.0.0'
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
        api: info.api,
        version: info.version,
        fileContent: file,
        incompatibleWithScratch: true,
        tags: ['clipcc']
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