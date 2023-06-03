import { init } from '../serverless.js';

export const handler = init({
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.54adb8d6.js","app":"_app/immutable/entry/app.30e77acf.js","imports":["_app/immutable/entry/start.54adb8d6.js","_app/immutable/chunks/index.ee544960.js","_app/immutable/chunks/singletons.9580b7cf.js","_app/immutable/entry/app.30e77acf.js","_app/immutable/chunks/index.ee544960.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('../server/nodes/0.js'),
			() => import('../server/nodes/1.js'),
			() => import('../server/nodes/2.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
});
