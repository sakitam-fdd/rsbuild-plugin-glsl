"use strict";
(self['webpackChunkplayground'] = self['webpackChunkplayground'] || []).push([["src_pages_Index_index_tsx"], {
"./src/pages/Index/index.module.less?55a5": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
});
// extracted by css-extract-rspack-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"wrap":"src-pages-Index-index-module__wrap-VqkzFA","left":"src-pages-Index-index-module__left-yoaSml","canvas":"src-pages-Index-index-module__canvas-tb_z9T"});
    if(true) {
      (function() {
        var localsJsonString = "{\"wrap\":\"src-pages-Index-index-module__wrap-VqkzFA\",\"left\":\"src-pages-Index-index-module__left-yoaSml\",\"canvas\":\"src-pages-Index-index-module__canvas-tb_z9T\"}";
        // 1722442831979
        var cssReload = (__webpack_require__("../node_modules/.pnpm/@rspack+core@1.0.0-beta.1_@swc+helpers@0.5.11/node_modules/@rspack/core/dist/builtin-plugin/css-extract/hmr/hotModuleReplacement.js")/* .cssReload */.cssReload)(module.id, {});
        // only invalidate when locals change
        if (
          module.hot.data &&
          module.hot.data.value &&
          module.hot.data.value !== localsJsonString
        ) {
          module.hot.invalidate();
        } else {
          module.hot.accept();
        }
        module.hot.dispose(function(data) {
          data.value = localsJsonString;
          cssReload();
        });
      })();
    }
  

}),
"./src/hooks/useSyncState.ts": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony import */var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/.pnpm/react@18.2.0/node_modules/react/index.js");
/* harmony import */var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* provided dependency */ var $ReactRefreshRuntime$ = __webpack_require__("../node_modules/.pnpm/@rspack+plugin-react-refresh@1.0.0-beta.1_react-refresh@0.14.2/node_modules/@rspack/plugin-react-refresh/client/reactRefresh.js");

const useSyncState = (defaultValue)=>{
    const refValue = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(defaultValue);
    const [value, setValue] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(defaultValue);
    const set = (v)=>{
        refValue.current = v;
        setValue(v);
    };
    return [
        value,
        set,
        refValue
    ];
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useSyncState);

function $RefreshSig$() {
  return $ReactRefreshRuntime$.createSignatureFunctionForTransform();
}
function $RefreshReg$(type, id) {
  $ReactRefreshRuntime$.register(type, module.id + "_" + id);
}
Promise.resolve().then(function() {
  $ReactRefreshRuntime$.refresh(module.id, module.hot);
});


}),
"./src/pages/Index/index.tsx": (function (module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony import */var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/.pnpm/react@18.2.0/node_modules/react/jsx-dev-runtime.js");
/* harmony import */var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../node_modules/.pnpm/react@18.2.0/node_modules/react/index.js");
/* harmony import */var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */var react_use__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("../node_modules/.pnpm/react-use@17.5.0_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/react-use/esm/useRafLoop.js");
/* harmony import */var _hooks_useSyncState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/hooks/useSyncState.ts");
/* harmony import */var _luma_gl_webgl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("../node_modules/.pnpm/@luma.gl+webgl@9.0.17_@luma.gl+core@9.0.17/node_modules/@luma.gl/webgl/dist/adapter/webgl-device.js");
/* harmony import */var _luma_gl_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../node_modules/.pnpm/@luma.gl+core@9.0.17/node_modules/@luma.gl/core/dist/lib/luma.js");
/* harmony import */var _luma_gl_engine__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("../node_modules/.pnpm/@luma.gl+engine@9.0.17_@luma.gl+core@9.0.17/node_modules/@luma.gl/engine/dist/model/model.js");
/* harmony import */var _fs_glsl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/pages/Index/fs.glsl");
/* harmony import */var _vs_glsl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/pages/Index/vs.glsl");
/* harmony import */var _index_module_less__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/pages/Index/index.module.less?55a5");
/* provided dependency */ var $ReactRefreshRuntime$ = __webpack_require__("../node_modules/.pnpm/@rspack+plugin-react-refresh@1.0.0-beta.1_react-refresh@0.14.2/node_modules/@rspack/plugin-react-refresh/client/reactRefresh.js");

var _s = $RefreshSig$();











_luma_gl_core__WEBPACK_IMPORTED_MODULE_6__.luma.registerDevices([
    _luma_gl_webgl__WEBPACK_IMPORTED_MODULE_7__.WebGLDevice
]);
const Main = ()=>{
    _s();
    const [config, setConfig, configRef] = (0,_hooks_useSyncState__WEBPACK_IMPORTED_MODULE_2__["default"])({});
    const canvasRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    const createRender = async ()=>{
        const device = await _luma_gl_core__WEBPACK_IMPORTED_MODULE_6__.luma.createDevice({
            type: 'webgl',
            canvas: canvasRef.current
        });
        configRef.current.device = device;
        configRef.current.positionBuffer = device.createBuffer(new Float32Array([
            -0.2,
            -0.2,
            0.2,
            -0.2,
            0.0,
            0.2
        ]));
        configRef.current.colorBuffer = device.createBuffer(new Float32Array([
            1.0,
            0.0,
            0.0,
            0.0,
            1.0,
            0.0,
            0.0,
            0.0,
            1.0,
            1.0,
            1.0,
            0.0
        ]));
        configRef.current.offsetBuffer = device.createBuffer(new Float32Array([
            0.5,
            0.5,
            -0.5,
            0.5,
            0.5,
            -0.5,
            -0.5,
            -0.5
        ]));
        configRef.current.model = new _luma_gl_engine__WEBPACK_IMPORTED_MODULE_8__.Model(device, {
            vs: _vs_glsl__WEBPACK_IMPORTED_MODULE_4__["default"],
            fs: _fs_glsl__WEBPACK_IMPORTED_MODULE_3__["default"],
            // modules: [colorShaderModule],
            bufferLayout: [
                {
                    name: 'position',
                    format: 'float32x2'
                },
                {
                    name: 'instanceColor',
                    format: 'float32x3',
                    stepMode: 'instance'
                },
                {
                    name: 'instanceOffset',
                    format: 'float32x2',
                    stepMode: 'instance'
                }
            ],
            attributes: {
                position: configRef.current.positionBuffer,
                instanceColor: configRef.current.colorBuffer,
                instanceOffset: configRef.current.offsetBuffer
            },
            vertexCount: 3,
            instanceCount: 4
        });
    };
    (0,react_use__WEBPACK_IMPORTED_MODULE_9__["default"])(()=>{
        const device = configRef.current.device;
        if (configRef.current.model && device) {
            device?.canvasContext?.resize({
                useDevicePixels: true
            });
            device.gl.viewport(0, 0, // @ts-ignore Expose canvasContext
            device.gl.drawingBufferWidth, // @ts-ignore Expose canvasContext
            device.gl.drawingBufferHeight);
            const renderPass = configRef.current.device.beginRenderPass({
                clearColor: [
                    0,
                    0,
                    0,
                    1
                ]
            });
            configRef.current.model.draw(renderPass);
            renderPass.end();
        }
    });
    const destroy = ()=>{
        configRef.current.model.destroy();
        configRef.current.positionBuffer.destroy();
        configRef.current.colorBuffer.destroy();
        configRef.current.offsetBuffer.destroy();
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        createRender();
        return ()=>destroy();
    });
    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
        className: _index_module_less__WEBPACK_IMPORTED_MODULE_5__["default"].wrap,
        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("canvas", {
            className: _index_module_less__WEBPACK_IMPORTED_MODULE_5__["default"].canvas,
            ref: canvasRef
        }, void 0, false, {
            fileName: "/home/runner/work/rsbuild-plugin-glsl/rsbuild-plugin-glsl/playground/src/pages/Index/index.tsx",
            lineNumber: 87,
            columnNumber: 7
        }, undefined)
    }, void 0, false, {
        fileName: "/home/runner/work/rsbuild-plugin-glsl/rsbuild-plugin-glsl/playground/src/pages/Index/index.tsx",
        lineNumber: 86,
        columnNumber: 5
    }, undefined);
};
_s(Main, "E6dEy8uAm/rtM8tWAhIrqjGl5as=", false, function() {
    return [
        _hooks_useSyncState__WEBPACK_IMPORTED_MODULE_2__["default"],
        react_use__WEBPACK_IMPORTED_MODULE_9__["default"]
    ];
});
_c = Main;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Main);
var _c;
$RefreshReg$(_c, "Main");

function $RefreshSig$() {
  return $ReactRefreshRuntime$.createSignatureFunctionForTransform();
}
function $RefreshReg$(type, id) {
  $ReactRefreshRuntime$.register(type, module.id + "_" + id);
}
Promise.resolve().then(function() {
  $ReactRefreshRuntime$.refresh(module.id, module.hot);
});


}),
"./src/pages/Index/fs.glsl": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("#version 300 es\nout vec4 fragColor;\n\nin vec3 color_vColor;\n\nvec3 color_getColor() {\n  return color_vColor;\n}\n\nvoid main() {\n  fragColor = vec4(color_getColor(), 1.0);\n}");

}),
"./src/pages/Index/vs.glsl": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("#version 300 es\nin vec2 position;\nin vec3 instanceColor;\nin vec2 instanceOffset;\n\nout vec3 color_vColor;\n\nvoid color_setColor(vec3 color) {\n  color_vColor = color;\n}\n\nvoid main() {\n  color_setColor(instanceColor);\n  gl_Position = vec4(position + instanceOffset, 0.0, 1.0);\n}");

}),

}]);
//# sourceMappingURL=src_pages_Index_index_tsx.js.map