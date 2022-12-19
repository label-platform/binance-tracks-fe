export const infinityQueryOption = {
    getNextPageParam(result) {
        const { content = { meta: {} } } = result;
        if (!content.meta.hasNextPage) return undefined;
        return result.content.meta.page + 1;
    },
    getPreviousPageParam(result) {
        const { content = { meta: {} } } = result;
        if (!content.meta.hasPreviousPage) return undefined;
        return content.meta.page - 1;
    },
};
