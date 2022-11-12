declare namespace Phaser.Loader {
    interface LoaderPlugin {
        rexAwait(arg: rexFunc): void;
    }
}

interface rexFunc {
    (successCallback: Function, failureCallback: Function): void;
}