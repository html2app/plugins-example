(() => {
  // node_modules/@yandeu/js-bridge/lib/base.js
  var __awaiter = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var callbacks = {};
  var listeners = {};
  var _isReady = false;
  var messageHandler = null;
  var isWebView = () => {
    return /WebView/i.test(navigator.userAgent);
  };
  var randomId = (length = 8) => {
    return Math.random().toString(36).substring(2, length + 2);
  };
  var init = () => {
    if (messageHandler)
      return;
    messageHandler = (ev) => {
      const data = ev.data;
      if (!data)
        return;
      const message = data;
      if (typeof (message === null || message === void 0 ? void 0 : message.action) !== "undefined") {
        const action = message.action;
        if (listeners[action]) {
          listeners[action].forEach((listener) => {
            listener();
          });
        }
        return;
      }
      if (!message || !message.callbackId || message.callbackId.length === 0)
        return;
      if (callbacks[message.callbackId]) {
        callbacks[message.callbackId](message);
        delete callbacks[message.callbackId];
        return;
      }
    };
    window.addEventListener("message", messageHandler);
    _isReady = true;
  };
  if (isWebView()) {
    init();
  }
  var communication = {
    /** Whether the bridge is initialized and ready */
    get isReady() {
      return _isReady;
    },
    /** Whether running inside Flutter WebView */
    get isWebView() {
      return isWebView();
    },
    /**
     * Initialize or reinitialize the communication bridge.
     * Automatically called on first import if running in Flutter WebView.
     * Call this manually after destroy() to reactivate the bridge.
     */
    init() {
      init();
    },
    /**
     * Send an async message to Flutter and wait for response.
     * @param message - The message to send
     * @returns Promise resolving to the response
     */
    sendAsync(message) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!isWebView()) {
          return Promise.resolve({ ok: false, errorMessage: "Not running inside Flutter WebView" });
        }
        return new Promise((resolve) => {
          const callbackId = randomId();
          const _message = Object.assign(Object.assign({}, message), { callbackId });
          callbacks[callbackId] = (MessageResponse) => {
            resolve(MessageResponse);
          };
          WebViewCommunication.postMessage(JSON.stringify(_message));
        });
      });
    },
    /**
     * Send a fire-and-forget message to Flutter.
     * @param message - The message to send
     */
    sendVoid(message) {
      if (!isWebView()) {
        return;
      }
      const _message = Object.assign(Object.assign({}, message), { callbackId: "" });
      WebViewCommunication.postMessage(JSON.stringify(_message));
    },
    /**
     * Add an event listener for a specific event/action from Flutter.
     * @param event - The event name to listen for
     * @param listener - The callback function
     */
    on(event, listener) {
      if (!listeners[event])
        listeners[event] = [];
      listeners[event].push(listener);
    },
    /**
     * Remove a specific event listener.
     * @param event - The event name
     * @param listener - The callback function to remove
     */
    off(event, listener) {
      if (!listeners[event])
        return;
      listeners[event] = listeners[event].filter((l) => l !== listener);
    },
    /**
     * Remove all event listeners for specific event(s).
     * @param events - Comma-separated list of event names
     */
    offMany(events) {
      const eventList = events.split(",").map((e) => e.trim()).filter((e) => e.length > 0);
      for (const event of eventList) {
        if (listeners[event]) {
          listeners[event] = [];
        }
      }
    },
    /**
     * Clean up all resources to prevent memory leaks.
     * Call this when the bridge is no longer needed.
     */
    destroy() {
      if (messageHandler) {
        window.removeEventListener("message", messageHandler);
        messageHandler = null;
      }
      Object.keys(callbacks).forEach((key) => delete callbacks[key]);
      Object.keys(listeners).forEach((key) => delete listeners[key]);
      _isReady = false;
    }
  };

  // node_modules/@yandeu/js-bridge/lib/core.js
  var __awaiter2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var WebView = {
    /** Whether the bridge is initialized and ready */
    get isReady() {
      return communication.isReady;
    },
    /** Whether running inside Flutter WebView */
    get isWebView() {
      return communication.isWebView;
    },
    /** Add an event listener for a specific event name. */
    on: communication.on,
    /** Remove a specific event listener for a specific event name. */
    off: communication.off,
    /** Remove all event listeners with a specific event name. */
    offMany: communication.offMany,
    /** Initialize or reinitialize the communication bridge. */
    init: communication.init,
    /** Clean up all resources to prevent memory leaks. */
    destroy: communication.destroy,
    /** Send a raw async message to Flutter and wait for response (useful for debugging). */
    sendAsync: communication.sendAsync,
    /** Send a raw fire-and-forget message to Flutter (useful for debugging). */
    sendVoid: communication.sendVoid,
    get fullscreen() {
      return {
        enter: () => {
          communication.sendVoid({ action: "core_fullscreen_enter" });
        },
        exit: () => {
          communication.sendVoid({ action: "core_fullscreen_exit" });
        }
      };
    },
    get persistentStorage() {
      return {
        setItem: (key, value) => __awaiter2(this, void 0, void 0, function* () {
          const res = yield communication.sendAsync({
            action: "core_persistent-storage_set-item",
            payload: { key, value }
          });
          if (!res.ok) {
            console.error("persistentStorage.setItem error:", res.errorMessage);
            return false;
          }
          return true;
        }),
        getItem: (key) => __awaiter2(this, void 0, void 0, function* () {
          const res = yield communication.sendAsync({
            action: "core_persistent-storage_get-item",
            payload: { key }
          });
          if (!res.ok) {
            console.error("persistentStorage.getItem error:", res.errorMessage);
            return null;
          }
          return res.payload.value;
        }),
        removeItem: (key) => __awaiter2(this, void 0, void 0, function* () {
          const res = yield communication.sendAsync({
            action: "core_persistent-storage_remove-item",
            payload: { key }
          });
          if (!res.ok) {
            console.error("persistentStorage.removeItem error:", res.errorMessage);
            return false;
          }
          return true;
        }),
        clear: () => __awaiter2(this, void 0, void 0, function* () {
          const res = yield communication.sendAsync({
            action: "core_persistent-storage_clear"
          });
          if (!res.ok) {
            console.error("persistentStorage.clear error:", res.errorMessage);
            return false;
          }
          return true;
        })
      };
    },
    get statusBar() {
      return {
        /** Color in the format #RRGGBB or #RRGGBBAA */
        setColor: (color) => __awaiter2(this, void 0, void 0, function* () {
          const res = yield communication.sendAsync({
            action: "core_status-bar_set-color",
            payload: { color }
          });
          return res;
        }),
        setIconsBrightness: (brightness) => __awaiter2(this, void 0, void 0, function* () {
          const res = yield communication.sendAsync({
            action: "core_status-bar_set-icon-brightness",
            payload: { brightness }
          });
          return res;
        })
      };
    },
    get navigationBar() {
      return {
        /** Color in the format #RRGGBB or #RRGGBBAA */
        setColor: (color) => __awaiter2(this, void 0, void 0, function* () {
          const res = yield communication.sendAsync({
            action: "core_navigation-bar_set-color",
            payload: { color }
          });
          return res;
        })
      };
    },
    /** Get the platform the app is running on */
    getPlatform() {
      return __awaiter2(this, void 0, void 0, function* () {
        const res = yield communication.sendAsync({
          action: "core_get-platform"
        });
        if (res.ok) {
          if (res.payload.platform === "android" || res.payload.platform === "ios" || res.payload.platform === "web") {
            return res.payload.platform;
          }
        }
        return "unknown";
      });
    },
    /** Get orientation controls */
    get orientation() {
      return {
        /** Set the orientation to landscape */
        setLandscape: () => {
          communication.sendVoid({ action: "core_set-landscape" });
        },
        /** Set the orientation to portrait */
        setPortrait: () => {
          communication.sendVoid({ action: "core_set-portrait" });
        },
        /** Set the orientation to auto-rotate */
        setAutoRotate: () => {
          communication.sendVoid({ action: "core_set-auto-rotate" });
        }
      };
    },
    /** Exit the app */
    exitApp() {
      communication.sendVoid({ action: "core_exit-app" });
    },
    /** Get device information */
    deviceInfo() {
      return __awaiter2(this, void 0, void 0, function* () {
        const res = yield communication.sendAsync({ action: "core_get-device-info" });
        return res;
      });
    },
    /** Get package information */
    packageInfo() {
      return __awaiter2(this, void 0, void 0, function* () {
        const res = yield communication.sendAsync({ action: "core_get-package-info" });
        return res;
      });
    }
  };

  // node_modules/@yandeu/js-bridge/lib/plugins/vibration.js
  var __awaiter3 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var Vibration = {
    /**
     * Vibrate the device for a specific duration and amplitude.
     * @param duration - Vibration duration in milliseconds (default: 500ms)
     * @param amplitude - Vibration strength 1-255, or -1 for device default
     * @returns Response indicating success or failure
     */
    vibrate(duration = 500, amplitude = -1) {
      if (amplitude !== -1 && (amplitude < 1 || amplitude > 255)) {
        console.warn("Amplitude must be between 1 and 255 or -1 for default amplitude");
        return {
          ok: false,
          errorMessage: "Amplitude must be between 1 and 255 or -1 for default amplitude"
        };
      }
      communication.sendVoid({ action: "vibration_vibrate", payload: { duration, amplitude } });
      return { ok: true, payload: {} };
    },
    /**
     * Vibrate the device with a custom pattern
     * @param pattern Pulse durations (ms) in `[wait, vibrate, wait, vibrate, ...]` format.
     * @param intensities Optional vibration strengths (0-255). If provided, must be the same length as the pattern array.
     * @returns A promise that resolves when the vibration command is sent.
     */
    vibrateWithPattern(pattern, intensities) {
      return __awaiter3(this, void 0, void 0, function* () {
        if (pattern.length % 2 !== 0) {
          console.warn("Vibration pattern must have a even length (wait and vibrate pairs)");
          return Promise.resolve({
            ok: false,
            errorMessage: "Pattern must have a even length"
          });
        }
        if (pattern.length < 2) {
          console.warn("Vibration pattern must have at least one wait and one vibrate duration");
          return Promise.resolve({
            ok: false,
            errorMessage: "Pattern must have at least one wait and one vibrate duration"
          });
        }
        if (intensities && intensities.length !== pattern.length) {
          console.warn("Vibration intensities length must match pattern length");
          return Promise.resolve({
            ok: false,
            errorMessage: "Intensities length must match pattern length"
          });
        }
        const res = yield communication.sendAsync({
          action: "vibration_vibrate-with-pattern",
          payload: { pattern, intensities }
        });
        return res;
      });
    },
    hasVibrator() {
      return __awaiter3(this, void 0, void 0, function* () {
        const res = yield communication.sendAsync({ action: "vibration_has-vibrator" });
        return res.ok ? res.payload.hasVibrator : false;
      });
    },
    hasAmplitudeControl() {
      return __awaiter3(this, void 0, void 0, function* () {
        const res = yield communication.sendAsync({
          action: "vibration_has-amplitude-control"
        });
        return res.ok ? res.payload.hasAmplitudeControl : false;
      });
    },
    hasCustomVibrationsSupport() {
      return __awaiter3(this, void 0, void 0, function* () {
        const res = yield communication.sendAsync({
          action: "vibration_has-custom-vibrations-support"
        });
        return res.ok ? res.payload.hasCustomVibrationsSupport : false;
      });
    }
  };

  // node_modules/@yandeu/js-bridge/lib/helpers.js
  var invalid = (errorMessage) => ({ ok: false, errorMessage });
  var isAbsoluteUri = (value) => {
    try {
      new URL(value);
      return true;
    } catch (_a) {
      return false;
    }
  };

  // node_modules/@yandeu/js-bridge/lib/plugins/share.js
  var __awaiter4 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var Share = {
    /**
     * Open the share sheet with a text message.
     * @param text - The text to share. Must not be empty or only whitespace.
     * @returns Response indicating whether the share sheet opened.
     */
    text(text) {
      return __awaiter4(this, void 0, void 0, function* () {
        if (typeof text !== "string" || text.trim().length === 0) {
          return invalid("Text must be a non-empty string");
        }
        return communication.sendAsync({ action: "share_text", payload: { text } });
      });
    },
    /**
     * Open the share sheet with a link.
     * @param uri - An absolute URI such as `https://flutter.dev`, or a `URL` object.
     * @returns Response indicating whether the share sheet opened.
     */
    uri(uri) {
      return __awaiter4(this, void 0, void 0, function* () {
        const value = uri instanceof URL ? uri.href : uri;
        if (typeof value !== "string" || !isAbsoluteUri(value)) {
          return invalid("URI must be an absolute URI, for example https://flutter.dev");
        }
        return communication.sendAsync({ action: "share_uri", payload: { uri: value } });
      });
    }
  };

  // www/index.ts
  WebView.orientation.setPortrait();
  var shareText = document.getElementById("share-text");
  var vibrate = document.getElementById("vibrate");
  shareText.addEventListener("click", async () => {
    console.log("Share Text");
    await Share.text("Hello!");
  });
  vibrate.addEventListener("click", () => {
    console.log("Vibrate");
    Vibration.vibrate();
  });
})();
