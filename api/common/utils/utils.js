const cleanRoute = (path) => {
    let pathSplit = path.split('?');
    pathSplit = pathSplit[0].split('/');
    const checkForHexRegExp = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
    pathSplit = pathSplit.map((element) => {
        if (checkForHexRegExp.test(element)) {
            return ':id';
        }
        if (!isNaN(parseInt(element))) {
            return ':id';
        }
        return element;
    })
    return pathSplit.join('/').replace(`/${process.env.VERSION}`, '');
}


module.exports = {
    cleanRoute
}