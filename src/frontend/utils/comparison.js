export function openComparisonView(contentId, version, prevVersion) {
    const compareUrl = `/wiki/pages/diffpagesbyversion.action?pageId=${contentId}&selectedPageVersions=${prevVersion}&selectedPageVersions=${version}`;
    window.open(compareUrl, '_blank');
}