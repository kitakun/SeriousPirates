export const asyncJsonLoader = <T>(loaderPlugin: Phaser.Loader.LoaderPlugin) => new Promise<T>((resolve, reject) => {
    loaderPlugin
        .on('filecomplete', (_: any, __: any, json: T) => resolve(json))
        .on('loaderror', reject);
    loaderPlugin.start();
});