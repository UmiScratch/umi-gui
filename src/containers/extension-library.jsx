import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import VM from 'scratch-vm';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import {
    initExtension,
    enableExtension,
    disableExtension
} from '../reducers/cc-extension';
import {
    addLocales
} from '../reducers/locales';

import {loadCcx} from '../lib/cc-extension-manager.js';

import extensionLibraryContent from '../lib/libraries/extensions/index.jsx';

import LibraryComponent from '../components/library/library.jsx';
import extensionIcon from '../components/action-menu/icon--sprite.svg';

const messages = defineMessages({
    extensionTitle: {
        defaultMessage: 'Choose an Extension',
        description: 'Heading for the extension library',
        id: 'gui.extensionLibrary.chooseAnExtension'
    },
    extensionUrl: {
        defaultMessage: 'Enter the URL of the extension',
        description: 'Prompt for unoffical extension url',
        id: 'gui.extensionLibrary.extensionUrl'
    },
    incompatible: {
        // eslint-disable-next-line max-len
        defaultMessage: 'This extension is incompatible with Scratch. Projects made with it cannot be uploaded to the Scratch website. Are you sure you want to enable it?',
        description: 'Confirm loading Scratch-incompatible extension',
        id: 'tw.confirmIncompatibleExtension'
    }
});

export const parseExtensionURL = url => {
    // Parse real extension URL from scratchx.org URL
    const match = url.match(/^https?:\/\/scratchx\.org\/\?url=(.*)$/);
    if (match) {
        return match[1];
    }
    return url;
};

class ExtensionLibrary extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleItemSelect',
            'handleUploadExtension',
            'loadExtensionFromFile'
        ]);
    }
    // cc - upload extension from computer
    handleUploadExtension () {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', '.js,.ccx');
        input.setAttribute('multiple', true);
        input.onchange = event => {
            const files = event.target.files;
            for (const file of files) {
                const fileName = file.name;
                const fileExt = fileName.substring(fileName.lastIndexOf('.') + 1);
                this.loadExtensionFromFile(file, fileExt);
            }
        };
        input.click();
    }
    async loadExtensionFromFile (file, ext) {
        console.log(file, ext)
        switch (ext) {
        case 'js': {
            const reader = new FileReader();
            reader.readAsDataURL(file, 'utf8');
            reader.onload = async () => {
                await this.props.vm.extensionManager.loadExtensionURL(reader.result);
                if (this.props.visible) this.props.onRequestClose();
            };
            break;
        }
        case 'ccx': {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file, 'utf8');
            reader.onload = async () => {
                await this.props.loadCcx(reader.result);
                if (this.props.visible) this.props.onRequestClose();
            };
            break;
        }
        default: {
            alert('🤯 Unknown extension format');
        }
        }
    }
    handleItemSelect (item) {
        // eslint-disable-next-line no-alert
        if (item.incompatibleWithScratch && !confirm(this.props.intl.formatMessage(messages.incompatible))) {
            return;
        }
        if (item.api > 0) {
            item.id = item.extensionId;
            ClipCCExtension.extensionManager.loadExtensionsWithMode(
                [item],
                extension => this.props.vm.extensionManager.loadExtensionURL(extension)
            );
            return;
        }
        const id = item.extensionId;
        let url = item.extensionURL ? item.extensionURL : id;
        const isCustomURL = !item.disabled && !id;
        if (isCustomURL) {
            // eslint-disable-next-line no-alert
            url = prompt(this.props.intl.formatMessage(messages.extensionUrl));
        }
        if (url && !item.disabled) {
            if (this.props.vm.extensionManager.isExtensionLoaded(url)) {
                this.props.onCategorySelected(id);
            } else {
                const parsedURL = isCustomURL ? parseExtensionURL(url) : url;
                this.props.vm.extensionManager.loadExtensionURL(parsedURL)
                    .then(() => {
                        this.props.onCategorySelected(id);
                        if (isCustomURL) {
                            let newUrl = location.pathname;
                            if (location.search) {
                                newUrl += location.search;
                                newUrl += '&';
                            } else {
                                newUrl += '?';
                            }
                            newUrl += `extension=${encodeURIComponent(url)}`;
                            history.replaceState('', '', newUrl);
                        }
                    })
                    .catch(err => {
                        // eslint-disable-next-line no-alert
                        alert(err);
                    });
            }
        }
    }
    render () {
        const extensionLibraryThumbnailData = Object.values(this.props.extension || {})
            .map(extension => ({
                ...extension,
                rawURL: extension.iconURL || extensionIcon,
                featured: true,
                name: this.props.intl.formatMessage({id: extension.name}),
                description: this.props.intl.formatMessage({id: extension.description})
            }))
            .sort((a, b) => {
                if (a.enabled === b.enabled) {
                    if (a.name === b.name) return 0;
                    return a.name < b.name ? -1 : 1;
                }
                return a.enabled ? -1 : 1;
            });
        return (
            <LibraryComponent
                data={extensionLibraryThumbnailData}
                filterable={true}
                onUpload={this.handleUploadExtension}
                onFromWeb={() => alert('🍙')}
                id="extensionLibrary"
                title={this.props.intl.formatMessage(messages.extensionTitle)}
                visible={this.props.visible}
                onItemSelected={this.handleItemSelect}
                onRequestClose={this.props.onRequestClose}
            />
        );
    }
}

const mapStateToProps = state => ({
    extension: state.scratchGui.extension.extension
});

const mapDispatchToProps = dispatch => ({
    initExtension: data => dispatch(initExtension(data)),
    setExtensionEnable: id => dispatch(enableExtension(id)),
    setExtensionDisable: id => dispatch(disableExtension(id)),
    addLocales: msgs => dispatch(addLocales(msgs)),
    loadCcx: (file) => loadCcx(dispatch, file)
});

ExtensionLibrary.propTypes = {
    extension: PropTypes.shape({
        extensionId: PropTypes.string,
        iconURL: PropTypes.string,
        insetIconURL: PropTypes.string,
        author: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string)
        ]),
        name: PropTypes.string,
        description: PropTypes.string,
        requirement: PropTypes.arrayOf(PropTypes.string)
    }),
    intl: intlShape.isRequired,
    onCategorySelected: PropTypes.func,
    onRequestClose: PropTypes.func,
    visible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired // eslint-disable-line react/no-unused-prop-types
};

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(ExtensionLibrary));
