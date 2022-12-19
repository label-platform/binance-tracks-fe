/* eslint-disable @typescript-eslint/no-var-requires */
const micromatch = require('micromatch');

function containsInPath(pattern, list) {
    return list.filter((item) => micromatch.contains(item, pattern));
}

function makePattern(extension) {
    return `**/*.${extension}`;
}

module.exports = (stagedFiles) => {
    const eslintExtensions = ['ts', 'tsx', 'js'].map(makePattern);
    const eslintFiles = micromatch(stagedFiles, eslintExtensions);

    const files = containsInPath('/src/', eslintFiles);

    const mapping = {};
    const commands = [];
    mapping['npm run precommit -- '] = files.join(' ');

    for (const command of Object.keys(mapping)) {
        const files = mapping[command];
        if (files.length) {
            commands.push(`${command} ${files}`);
        }
    }

    return commands;
};
