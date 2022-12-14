let _ScratchBlocks = null;

const isLoaded = () => !!_ScratchBlocks;

const get = () => {
    if (!isLoaded()) {
        throw new Error('scratch-blocks is not loaded yet');
    }
    return _ScratchBlocks;
};

const load = (callback) => {
    if (_ScratchBlocks) {
        callback(_ScratchBlocks);
        return Promise.resolve();
    }
    return import(/* webpackChunkName: "sb" */ 'scratch-blocks')
        .then(m => {
            _ScratchBlocks = m.default;
            callback(_ScratchBlocks);
            return _ScratchBlocks;
        });
};

export default {
    get,
    isLoaded,
    load
};
