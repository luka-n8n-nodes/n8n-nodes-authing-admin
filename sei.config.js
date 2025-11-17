module.exports = {
    toolkitConfig: {
        group: 'fe-node',
        mergeConfig: {
            removeSourceBranch: false, // 合并请求是否删除源分支
            squash: false,
            urgentMessage: false, // 开启加急
            reviewerEmail: ['your-email@example.com']
        },
        flowConfig: {
            productionRelease: 'master',
            devBranch: 'dev-',
            releaseBranch: 'release-',
            reviewerAutoMerge: true,
            mergeSuccessRunPipeline: false,
            finishReleaseRemoveSourceBranch: false // 完成release后是否删除源分支，不建议保留
        }
    }
}

