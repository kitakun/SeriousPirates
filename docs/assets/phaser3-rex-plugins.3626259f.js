const o=Phaser.Loader.FILE_POPULATED,h=Phaser.Utils.String.UUID;class l extends Phaser.Loader.File{constructor(t,s){s.hasOwnProperty("type")||(s.type="await"),s.hasOwnProperty("url")||(s.url=""),s.hasOwnProperty("key")||(s.key=h()),super(t,s)}load(){if(this.state===o)this.loader.nextFile(this,!0);else{var t=this.config,s=t.callback,r=t.scope,a=this.onLoad.bind(this),i=this.onError.bind(this);s?r?s.call(r,a,i):s(a,i):this.onLoad()}}onLoad(){this.loader.nextFile(this,!0)}onError(){this.loader.nextFile(this,!1)}}var d=function(e){return e&&typeof e=="function"};const P=Phaser.Utils.Objects.IsPlainObject,n=function(e,t){if(d(e)){var s=e,r=t;t={config:{callback:s,scope:r}}}else P(e)?(t=e,t.hasOwnProperty("config")||(t={config:t})):t={key:e,config:t};return this.addFile(new l(this,t)),this};class u extends Phaser.Plugins.BasePlugin{constructor(t){super(t),t.registerFileType("rexAwait",n)}addToScene(t){t.sys.load.rexAwait=n}}export{u as A};
