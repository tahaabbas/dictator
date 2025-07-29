"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // node_modules/@aidenlx/esbuild-plugin-inline-worker/dist/utils.js
  var toObjectURL, fromScriptText;
  var init_utils = __esm({
    "node_modules/@aidenlx/esbuild-plugin-inline-worker/dist/utils.js"() {
      toObjectURL = (script) => {
        const blob = new Blob([script], { type: "text/javascript" });
        const url = URL.createObjectURL(blob);
        return url;
      };
      fromScriptText = (script, options) => {
        const url = toObjectURL(script);
        const worker2 = new Worker(url, options);
        URL.revokeObjectURL(url);
        return worker2;
      };
    }
  });

  // inline-worker:C:\Users\tahaa\AppData\Local\Temp\epiw-tGV51r\worker_adztq.ts
  var worker_adztq_default;
  var init_worker_adztq = __esm({
    "inline-worker:C:\\Users\\tahaa\\AppData\\Local\\Temp\\epiw-tGV51r\\worker_adztq.ts"() {
      worker_adztq_default = 'var j=Object.defineProperty,X=Object.defineProperties;var K=Object.getOwnPropertyDescriptors;var G=Object.getOwnPropertySymbols;var B=Object.prototype.hasOwnProperty,J=Object.prototype.propertyIsEnumerable;var I=(o,n,e)=>n in o?j(o,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[n]=e,L=(o,n)=>{for(var e in n||(n={}))B.call(n,e)&&I(o,e,n[e]);if(G)for(var e of G(n))J.call(n,e)&&I(o,e,n[e]);return o},F=(o,n)=>X(o,K(n));var Q=()=>({modelId:"base",modelPath:"onnx-community/whisper-base"}),$={MAX_CHUNK_SAMPLES:48e4,OVERLAP_SAMPLES:8e4,MAX_TOTAL_DURATION_MINUTES:10,ENFORCE_DURATION_LIMIT:!0};console.log("[Voice Worker] Code execution started.");var h=!1,b=Q(),_=b.modelPath,y=null,W=null,u=null,g=null,m=!1,M=!1,E=b.modelId,v,x,H,O,P,T;async function Y(){console.log("[Voice Worker][Init] Initializing Transformers library...");try{let o=await import("https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.0");console.log("[Voice Worker][Init] Transformers library imported successfully."),{AutoTokenizer:v,AutoProcessor:x,WhisperForConditionalGeneration:H,TextStreamer:O,full:P,env:T}=o,T.allowLocalModels=!1,T.backends.onnx.logLevel="info"}catch(o){throw console.error("[Voice Worker][Init] Failed to import Transformers library:",o),o}}function Z(o,n){console.log(`[Voice Worker][Config] Updating model from ${E} to ${o}`),E=o,_=n,y=null,W=null,u=null,m=!1,M=!1,g=null,console.log(`[Voice Worker][Config] Model configuration updated to: ${n}`)}function N(o){let n=[],{MAX_CHUNK_SAMPLES:e,OVERLAP_SAMPLES:r}=$;if(o.length<=e)return[o];let s=e-r,c=0;for(;c<o.length;){let a=Math.min(c+e,o.length),l=o.slice(c,a);if(l.length<e&&c>0){let i=new Float32Array(e);i.set(l),n.push(i)}else n.push(l);if(c+=s,a>=o.length)break}return console.log(`[Voice Worker][Chunking] Split ${o.length} samples into ${n.length} chunks`),n}function ee(o,n,e=5){if(!o.trim())return n;let r=o.trim().split(/\\s+/),s=n.trim().split(/\\s+/),c=Math.floor(e*2.5),a=0,l=Math.min(c,r.length,s.length);for(let i=1;i<=l;i++){let p=r.slice(-i),t=s.slice(0,i);p.length===t.length&&p.every((w,k)=>w.toLowerCase()===t[k].toLowerCase())&&(a=i)}if(a>0){let p=s.slice(a).join(" ");return console.log(`[Voice Worker][Overlap] Removed ${a} overlapping words: "${s.slice(0,a).join(" ")}"`),p}return n}function R(o){if(o.length===0)return"";if(o.length===1)return o[0];let n=o[0];for(let e=1;e<o.length;e++){let r=ee(n,o[e]);if(n.trim()&&r.trim()){let s=!/[.!?]\\s*$/.test(n.trim());n+=" "+r}else r.trim()&&(n+=r)}return n.trim()}async function S(o,n){let e=n||_;console.log(`[Voice Worker][Load] Loading model components for: ${e}`),v||await Y(),m=!1,M=!1;try{(e.includes("medium")||e.includes("large"))&&(console.log(`[Voice Worker][Load] Loading large model: ${e}. This may take several minutes...`),self.postMessage({status:"loading",data:`Loading ${e} - This is a large model and may take several minutes to download and initialize...`}));let r=[v.from_pretrained(e,{progress_callback:o}),x.from_pretrained(e,{progress_callback:o}),H.from_pretrained(e,{dtype:{encoder_model:"fp32",decoder_model_merged:"q4"},device:"webgpu",progress_callback:o})];console.log(`[Voice Worker][Load] Starting parallel loading of model components for: ${e}`);let s=await Promise.all(r);if(console.log(`[Voice Worker][Load] All model components loaded for: ${e}`),y=s[0],W=s[1],u=s[2],!y||!W||!u)throw new Error(`[Voice Worker][Load] Model components not assigned correctly after load for: ${e}`);_=e,console.log(`[Voice Worker][Load] Starting model warmup for: ${e}`),await oe(),m=!0,console.log(`[Voice Worker][Load] Model ${e} is fully loaded and warmed up.`)}catch(r){console.error(`[Voice Worker][Load] Model loading or warmup failed for ${e}:`,r);let s=`Model loading failed for ${e}`;throw r instanceof Error&&(r.message.includes("fetch")?s+=": Network error - please check your internet connection":r.message.includes("memory")||r.message.includes("Memory")?s+=": Insufficient memory - try a smaller model":r.message.includes("WebGPU")?s+=": WebGPU error - your device may not support this model":s+=`: ${r.message}`),y=null,W=null,u=null,m=!1,M=!1,g=null,new Error(s)}}async function oe(){if(!u||!P){console.warn("[Voice Worker][Warmup] Cannot warmup model: Not loaded yet.");return}if(M){console.log("[Voice Worker][Warmup] Model already warmed up.");return}console.log("[Voice Worker][Warmup] Warming up model...");try{let e={input_features:P([1,80,3e3],0),max_new_tokens:1,generation_config:{}};await u.generate(e),M=!0,console.log("[Voice Worker][Warmup] Model warmup successful.")}catch(o){console.warn("[Voice Worker][Warmup] Model warmup failed:",o),M=!1}}var C=!1;async function re({audio:o,language:n}){if(C){console.warn("[Voice Worker][Generate] Already processing audio."),self.postMessage({status:"error",data:"Already processing audio."});return}if(!o||o.length===0){console.warn("[Voice Worker][Generate] No audio data received."),self.postMessage({status:"error",data:"No audio data received."});return}if(!m||!y||!W||!u){console.error("[Voice Worker][Generate] Model not ready for transcription."),self.postMessage({status:"error",data:"Model not ready."});return}C=!0,h=!1;let e=o.length/16e3;console.log("[Voice Worker][Generate] Starting transcription process..."),console.log(`[Voice Worker][Generate] Audio length: ${o.length} samples (${e.toFixed(1)}s)`),console.log(`[Voice Worker][Generate] Language: ${n}`);let r=$.MAX_TOTAL_DURATION_MINUTES*60;if($.ENFORCE_DURATION_LIMIT&&e>r){console.error(`[Voice Worker][Generate] Audio too long: ${e.toFixed(1)}s exceeds maximum ${r}s`),self.postMessage({status:"error",data:`Audio too long (${e.toFixed(1)}s). Maximum supported duration is ${r}s.`});return}!$.ENFORCE_DURATION_LIMIT&&e>300&&console.warn(`[Voice Worker][Generate] Processing very long audio: ${e.toFixed(1)}s. This may take significant time and memory.`),self.postMessage({status:"transcribing_start"});try{let s=N(o),c=s.length>1;c&&console.log(`[Voice Worker][Generate] Processing ${s.length} audio chunks`);let a=[],l=null,i=0;for(let t=0;t<s.length;t++){if(h){console.log("[Voice Worker][Generate] Transcription cancelled during chunk processing.");return}let A=s[t];c&&self.postMessage({status:"chunk_progress",data:`Processing chunk ${t+1} of ${s.length}`,chunkIndex:t,totalChunks:s.length}),console.log(`[Voice Worker][Generate] Processing chunk ${t+1}/${s.length}`);let w=await W(A);console.log(`[Voice Worker][Generate] Chunk ${t+1} audio processed.`);let k=null,U=0,d="",z=f=>{if(h){console.log("[Voice Worker][Generate] Streamer callback cancelled.");return}k!=null||(k=performance.now()),l!=null||(l=k);let q=d.length;f.length>q&&f.startsWith(d)?(d=f,console.log(`[Voice Worker][Generate] Chunk ${t+1} streamer update (full): "${f}"`)):f!==d&&(d+=f,console.log(`[Voice Worker][Generate] Chunk ${t+1} streamer update (incremental): +"${f}" -> "${d}"`)),i++,U++;let V=0;i>0&&l&&(V=i/(performance.now()-l)*1e3),c?self.postMessage({status:"chunk_progress",output:d,chunkOutput:d,chunkIndex:t,totalChunks:s.length,tps:V?parseFloat(V.toFixed(1)):0,numTokens:i}):self.postMessage({status:"update",output:d,tps:V?parseFloat(V.toFixed(1)):0,numTokens:i})};console.log(`[Voice Worker][Generate] Creating text streamer for chunk ${t+1}...`);let D=new O(y,{skip_prompt:!0,skip_special_tokens:!0,callback_function:z});if(console.log(`[Voice Worker][Generate] Starting model generation for chunk ${t+1}...`),await u.generate(F(L({},w),{language:n,streamer:D})),h){console.log("[Voice Worker][Generate] Transcription cancelled after chunk generation.");return}a.push(d),console.log(`[Voice Worker][Generate] Chunk ${t+1} completed: "${d}"`),console.log(`[Voice Worker][Generate] Chunk ${t+1} final length: ${d.length} chars`)}if(h){console.log("[Voice Worker][Generate] Transcription cancelled post-generation. Discarding result.");return}let p=R(a);console.log("[Voice Worker][Generate] Transcription complete. Sending final message."),console.log(`[Voice Worker][Generate] Final concatenated output: "${p}"`),self.postMessage({status:"complete",output:p,totalChunks:c?s.length:void 0})}catch(s){console.error("[Voice Worker][Generate] Transcription failed:",s),self.postMessage({status:"error",data:`Transcription failed: ${s instanceof Error?s.message:String(s)}`})}finally{console.log("[Voice Worker][Generate] Cleaning up transcription process."),C=!1}}console.log("[Voice Worker] Setting up message listener.");self.addEventListener("message",async o=>{if(console.log("[Voice Worker][Handler] Received message:",o.data),!o.data||typeof o.data!="object"||!("type"in o.data)){console.warn("[Voice Worker][Handler] Received invalid message format:",o.data);return}let{type:n,data:e}=o.data;switch(n){case"load":if(console.log("[Voice Worker][Handler] Handling \'load\' message."),g){console.log("[Voice Worker][Handler] Model loading already in progress or completed.");try{await g,m&&self.postMessage({status:"ready"})}catch(r){console.error("[Voice Worker][Handler] Previous load attempt failed."),m||self.postMessage({status:"error",data:`Model initialization failed: ${r instanceof Error?r.message:String(r)}`})}return}g=S(r=>{r.status==="progress"&&self.postMessage({status:"loading",data:`Loading: ${r.file} (${r.progress.toFixed(0)}%)`})});try{await g,self.postMessage({status:"ready"})}catch(r){console.error("[Voice Worker][Handler] loadModel promise rejected:",r),g=null,m||self.postMessage({status:"error",data:`Model initialization failed: ${r instanceof Error?r.message:String(r)}`})}break;case"generate":e?(console.log("[Voice Worker][Handler] Handling \'generate\' message."),re(e)):(console.warn("[Voice Worker][Handler] \'generate\' message received without data."),self.postMessage({status:"error",data:"Generate request missing audio data."}));break;case"change_model":if(e&&"modelId"in e&&"modelPath"in e){console.log("[Voice Worker][Handler] Handling \'change_model\' message.");let r=e;Z(r.modelId,r.modelPath),self.postMessage({status:"loading",data:`Switching to ${r.modelId} model...`}),(async()=>{try{g=S(s=>{s.status==="progress"&&self.postMessage({status:"loading",data:`Loading ${r.modelId}: ${s.file} (${s.progress.toFixed(0)}%)`})},r.modelPath),await g,console.log(`[Voice Worker][Handler] Model ${r.modelId} loaded successfully`),self.postMessage({status:"ready",data:`Model switched to ${r.modelId}`})}catch(s){console.error(`[Voice Worker][Handler] Model change to ${r.modelId} failed:`,s),g=null,self.postMessage({status:"error",data:`Failed to switch to ${r.modelId}: ${s instanceof Error?s.message:String(s)}`})}})()}else console.warn("[Voice Worker][Handler] \'change_model\' message received without proper data."),self.postMessage({status:"error",data:"Model change request missing model information."});break;case"stop":console.log("[Voice Worker][Handler] Handling \'stop\' message."),h=!0,console.log("[Voice Worker][Handler] Cancellation requested flag set.");break;default:console.warn("[Voice Worker][Handler] Received unknown message type:",n);break}});console.log("[Voice Worker] Message listener set up. Initial script execution complete.");self.testAudioChunking=function(){console.log("[Voice Worker][Test] Testing audio chunking logic..."),[{name:"Short audio (15s)",samples:15*16e3},{name:"Medium audio (35s)",samples:35*16e3},{name:"Long audio (65s)",samples:65*16e3},{name:"Very long audio (120s)",samples:120*16e3}].forEach(n=>{console.log(`\n[Voice Worker][Test] Testing ${n.name} (${n.samples} samples)`);let e=new Float32Array(n.samples),r=N(e);console.log(`[Voice Worker][Test] Result: ${r.length} chunks`),r.forEach((a,l)=>{console.log(`[Voice Worker][Test] Chunk ${l+1}: ${a.length} samples (${(a.length/16e3).toFixed(1)}s)`)});let s=r.map((a,l)=>`Chunk ${l+1} transcription result.`),c=R(s);console.log(`[Voice Worker][Test] Concatenated result: "${c}"`)}),console.log(`\n[Voice Worker][Test] Chunking tests completed!`)};\n//# sourceMappingURL=worker_adztq.ts.map\n';
    }
  });

  // src/config.ts
  var HUGGING_FACE_TRANSFORMERS_VERSION, TARGET_SAMPLE_RATE, HOTKEYS, AUDIO_CHUNKING, WHISPER_MODEL_REGISTRY, DEFAULT_MODEL_ID, getModelsForDisplay;
  var init_config = __esm({
    "src/config.ts"() {
      "use strict";
      HUGGING_FACE_TRANSFORMERS_VERSION = "3.5.0";
      TARGET_SAMPLE_RATE = 16e3;
      HOTKEYS = {
        TOGGLE_RECORDING: "cmd+shift+y"
      };
      AUDIO_CHUNKING = {
        // âš ï¸ WARNING: Don't increase MAX_CHUNK_DURATION_SECONDS beyond 30!
        // Whisper models are architecturally limited to ~30s segments.
        // Increasing this will cause:
        // - Memory issues (exponential growth)
        // - Quality degradation (model not trained for longer segments)
        // - WebGPU crashes in browsers
        MAX_CHUNK_DURATION_SECONDS: 30,
        // âœ… CONFIGURABLE: Overlap between chunks (can be adjusted 1-10s)
        // More overlap = better continuity, but more processing time
        CHUNK_OVERLAP_SECONDS: 5,
        // Calculated values (don't modify directly)
        MAX_CHUNK_SAMPLES: 30 * 16e3,
        OVERLAP_SAMPLES: 5 * 16e3,
        // âœ… CONFIGURABLE: Total duration limit (can be increased/removed)
        // Set to higher values or modify worker validation to remove limit
        MAX_TOTAL_DURATION_MINUTES: 10
      };
      WHISPER_MODEL_REGISTRY = {
        "base": {
          id: "base",
          name: "Base",
          description: "Balanced speed and quality (Default)",
          modelPath: "onnx-community/whisper-base",
          size: "142 MB",
          sizeBytes: 142 * 1024 * 1024,
          quality: "Good",
          speed: "Medium",
          memoryUsage: "Medium",
          languages: "multilingual",
          recommended: true,
          deviceRequirements: {
            minRAM: "4 GB",
            webGPU: true
          }
        },
        "small": {
          id: "small",
          name: "Small",
          description: "Better quality, slower processing",
          modelPath: "onnx-community/whisper-small",
          size: "466 MB",
          sizeBytes: 466 * 1024 * 1024,
          quality: "High",
          speed: "Slow",
          memoryUsage: "High",
          languages: "multilingual",
          recommended: false,
          deviceRequirements: {
            minRAM: "8 GB",
            webGPU: true
          }
        },
        "medium": {
          id: "medium",
          name: "Medium",
          description: "High quality, requires more resources",
          modelPath: "onnx-community/whisper-medium-ONNX",
          size: "1.5 GB",
          sizeBytes: 1.5 * 1024 * 1024 * 1024,
          quality: "High",
          speed: "Slow",
          memoryUsage: "High",
          languages: "multilingual",
          recommended: false,
          deviceRequirements: {
            minRAM: "16 GB",
            webGPU: true
          }
        },
        "large": {
          id: "large",
          name: "Large",
          description: "Best quality, very slow and resource-intensive",
          modelPath: "onnx-community/whisper-large-v3",
          size: "2.9 GB",
          sizeBytes: 2.9 * 1024 * 1024 * 1024,
          quality: "Excellent",
          speed: "Slow",
          memoryUsage: "High",
          languages: "multilingual",
          recommended: false,
          deviceRequirements: {
            minRAM: "32 GB",
            webGPU: true
          }
        }
      };
      DEFAULT_MODEL_ID = "base";
      getModelsForDisplay = () => {
        return Object.values(WHISPER_MODEL_REGISTRY).sort((a, b) => {
          if (a.recommended && !b.recommended) return -1;
          if (!a.recommended && b.recommended) return 1;
          return a.sizeBytes - b.sizeBytes;
        });
      };
    }
  });

  // src/ui/context-menu.ts
  function getSelectedLanguage() {
    try {
      const storedLanguage = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedLanguage && SUPPORTED_LANGUAGES.some((lang) => lang.code === storedLanguage)) {
        return storedLanguage;
      }
    } catch (error) {
      console.error("Error reading language from localStorage:", error);
    }
    return "en";
  }
  function setSelectedLanguage(languageCode) {
    try {
      if (SUPPORTED_LANGUAGES.some((lang) => lang.code === languageCode)) {
        localStorage.setItem(LOCAL_STORAGE_KEY, languageCode);
        console.log(`ASR language set to: ${languageCode}`);
      } else {
        console.warn(`Attempted to set unsupported language: ${languageCode}`);
      }
    } catch (error) {
      console.error("Error writing language to localStorage:", error);
    }
  }
  function getSelectedModel() {
    try {
      const storedModel = localStorage.getItem(MODEL_STORAGE_KEY);
      if (storedModel && WHISPER_MODEL_REGISTRY[storedModel]) {
        return storedModel;
      }
    } catch (error) {
      console.error("Error reading model from localStorage:", error);
    }
    return DEFAULT_MODEL_ID;
  }
  function setSelectedModel(modelId) {
    try {
      if (WHISPER_MODEL_REGISTRY[modelId]) {
        localStorage.setItem(MODEL_STORAGE_KEY, modelId);
        console.log(`ASR model set to: ${modelId}`);
      } else {
        console.warn(`Attempted to set unsupported model: ${modelId}`);
      }
    } catch (error) {
      console.error("Error writing model to localStorage:", error);
    }
  }
  function getSelectedModelConfig() {
    const modelId = getSelectedModel();
    return WHISPER_MODEL_REGISTRY[modelId];
  }
  function removeExistingContextMenu() {
    const existingMenu = document.getElementById(CONTEXT_MENU_ID);
    existingMenu?.remove();
    document.removeEventListener("click", handleOutsideClick, true);
  }
  function handleOutsideClick(event) {
    const menu = document.getElementById(CONTEXT_MENU_ID);
    if (menu && !menu.contains(event.target)) {
      removeExistingContextMenu();
    }
  }
  function createASRContextMenu(targetElement, onLanguageSelect, onModelSelect) {
    removeExistingContextMenu();
    const currentLanguage = getSelectedLanguage();
    const currentModel = getSelectedModel();
    const menu = document.createElement("div");
    menu.id = CONTEXT_MENU_ID;
    menu.className = "asr-context-menu";
    menu.style.position = "absolute";
    menu.style.visibility = "hidden";
    menu.style.top = "-10000px";
    menu.style.left = "-10000px";
    menu.style.zIndex = "10000";
    const modelTitle = document.createElement("div");
    modelTitle.className = "asr-context-menu-title";
    modelTitle.textContent = "\u{1F916} Select Model";
    menu.appendChild(modelTitle);
    const models = getModelsForDisplay();
    models.forEach((model) => {
      const item = document.createElement("div");
      item.className = "asr-context-menu-item asr-model-item";
      const modelHeader = document.createElement("div");
      modelHeader.className = "asr-model-header";
      const modelName = document.createElement("span");
      modelName.className = "asr-model-name";
      modelName.textContent = `${model.name}${model.recommended ? " \u2B50" : ""}`;
      const modelSize = document.createElement("span");
      modelSize.className = "asr-model-size";
      modelSize.textContent = model.size;
      modelHeader.appendChild(modelName);
      modelHeader.appendChild(modelSize);
      const modelDesc = document.createElement("div");
      modelDesc.className = "asr-model-description";
      modelDesc.textContent = model.description;
      item.appendChild(modelHeader);
      item.appendChild(modelDesc);
      const badges = document.createElement("div");
      badges.className = "asr-model-badges";
      const qualityBadge = document.createElement("span");
      qualityBadge.className = `asr-badge asr-badge-quality-${model.quality.toLowerCase()}`;
      qualityBadge.textContent = `Quality: ${model.quality}`;
      const speedBadge = document.createElement("span");
      speedBadge.className = `asr-badge asr-badge-speed-${model.speed.toLowerCase().replace(" ", "-")}`;
      speedBadge.textContent = `Speed: ${model.speed}`;
      badges.appendChild(qualityBadge);
      badges.appendChild(speedBadge);
      item.appendChild(badges);
      if (model.deviceRequirements.warning) {
        const warning = document.createElement("div");
        warning.className = "asr-model-warning";
        warning.textContent = `\u26A0\uFE0F ${model.deviceRequirements.warning}`;
        item.appendChild(warning);
      }
      item.dataset.modelId = model.id;
      if (model.id === currentModel) {
        item.classList.add("selected");
      }
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const modelItem = e.target.closest(".asr-model-item");
        const selectedModelId = modelItem?.dataset.modelId;
        if (selectedModelId) {
          onModelSelect(selectedModelId);
        }
        removeExistingContextMenu();
      });
      menu.appendChild(item);
    });
    const separator = document.createElement("div");
    separator.className = "asr-context-menu-separator";
    menu.appendChild(separator);
    const languageTitle = document.createElement("div");
    languageTitle.className = "asr-context-menu-title";
    languageTitle.textContent = "\u{1F310} Select Language";
    menu.appendChild(languageTitle);
    SUPPORTED_LANGUAGES.forEach((lang) => {
      const item = document.createElement("div");
      item.className = "asr-context-menu-item asr-language-item";
      item.textContent = lang.name;
      item.dataset.langCode = lang.code;
      if (lang.code === currentLanguage) {
        item.classList.add("selected");
      }
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const selectedCode = e.target.dataset.langCode;
        if (selectedCode) {
          onLanguageSelect(selectedCode);
        }
        removeExistingContextMenu();
      });
      menu.appendChild(item);
    });
    document.body.appendChild(menu);
    const menuWidth = menu.offsetWidth;
    const menuHeight = menu.offsetHeight;
    const targetRect = targetElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const verticalOffset = 5;
    const horizontalOffset = 5;
    const potentialTop = targetRect.top - menuHeight - verticalOffset;
    const potentialBottom = targetRect.bottom + verticalOffset;
    let finalTop;
    if (potentialTop >= 0) {
      finalTop = potentialTop;
    } else if (potentialBottom + menuHeight <= viewportHeight) {
      finalTop = potentialBottom;
    } else {
      finalTop = Math.max(0, Math.min(potentialBottom, viewportHeight - menuHeight - 10));
    }
    let finalLeft = targetRect.left + targetRect.width / 2 - menuWidth / 2;
    if (finalLeft + menuWidth > viewportWidth) {
      finalLeft = viewportWidth - menuWidth - horizontalOffset;
    }
    if (finalLeft < horizontalOffset) {
      finalLeft = horizontalOffset;
    }
    menu.style.top = `${finalTop + scrollY}px`;
    menu.style.left = `${finalLeft + scrollX}px`;
    menu.style.visibility = "visible";
    setTimeout(() => {
      document.addEventListener("click", handleOutsideClick, true);
    }, 0);
  }
  var LOCAL_STORAGE_KEY, MODEL_STORAGE_KEY, CONTEXT_MENU_ID, SUPPORTED_LANGUAGES;
  var init_context_menu = __esm({
    "src/ui/context-menu.ts"() {
      "use strict";
      init_config();
      LOCAL_STORAGE_KEY = "asr_selected_language";
      MODEL_STORAGE_KEY = "asr_selected_model";
      CONTEXT_MENU_ID = "asr-language-context-menu";
      SUPPORTED_LANGUAGES = [
        { code: "en", name: "English" },
        { code: "zh", name: "Chinese" },
        { code: "de", name: "German" },
        { code: "es", name: "Spanish" },
        { code: "ru", name: "Russian" },
        { code: "ko", name: "Korean" },
        { code: "fr", name: "French" },
        { code: "ja", name: "Japanese" },
        { code: "pt", name: "Portuguese" },
        { code: "tr", name: "Turkish" },
        { code: "pl", name: "Polish" },
        { code: "ca", name: "Catalan" },
        { code: "nl", name: "Dutch" },
        { code: "ar", name: "Arabic" },
        { code: "sv", name: "Swedish" },
        { code: "it", name: "Italian" },
        { code: "id", name: "Indonesian" },
        { code: "hi", name: "Hindi" },
        { code: "fi", name: "Finnish" },
        { code: "vi", name: "Vietnamese" },
        { code: "he", name: "Hebrew" },
        { code: "uk", name: "Ukrainian" },
        { code: "el", name: "Greek" },
        { code: "ms", name: "Malay" },
        { code: "cs", name: "Czech" },
        { code: "ro", name: "Romanian" },
        { code: "da", name: "Danish" },
        { code: "hu", name: "Hungarian" },
        { code: "ta", name: "Tamil" },
        { code: "no", name: "Norwegian" },
        { code: "th", name: "Thai" },
        { code: "ur", name: "Urdu" },
        { code: "hr", name: "Croatian" },
        { code: "bg", name: "Bulgarian" },
        { code: "lt", name: "Lithuanian" },
        { code: "la", name: "Latin" },
        { code: "mi", name: "Maori" },
        { code: "ml", name: "Malayalam" },
        { code: "cy", name: "Welsh" },
        { code: "sk", name: "Slovak" },
        { code: "te", name: "Telugu" },
        { code: "fa", name: "Persian" },
        { code: "lv", name: "Latvian" },
        { code: "bn", name: "Bengali" },
        { code: "sr", name: "Serbian" },
        { code: "az", name: "Azerbaijani" },
        { code: "sl", name: "Slovenian" },
        { code: "kn", name: "Kannada" },
        { code: "et", name: "Estonian" },
        { code: "mk", name: "Macedonian" },
        { code: "br", name: "Breton" },
        { code: "eu", name: "Basque" },
        { code: "is", name: "Icelandic" },
        { code: "hy", name: "Armenian" },
        { code: "ne", name: "Nepali" },
        { code: "mn", name: "Mongolian" },
        { code: "bs", name: "Bosnian" },
        { code: "kk", name: "Kazakh" },
        { code: "sq", name: "Albanian" },
        { code: "sw", name: "Swahili" },
        { code: "gl", name: "Galician" },
        { code: "mr", name: "Marathi" },
        { code: "pa", name: "Punjabi" },
        { code: "si", name: "Sinhala" },
        { code: "km", name: "Khmer" },
        { code: "sn", name: "Shona" },
        { code: "yo", name: "Yoruba" },
        { code: "so", name: "Somali" },
        { code: "af", name: "Afrikaans" },
        { code: "oc", name: "Occitan" },
        { code: "ka", name: "Georgian" },
        { code: "be", name: "Belarusian" },
        { code: "tg", name: "Tajik" },
        { code: "sd", name: "Sindhi" },
        { code: "gu", name: "Gujarati" },
        { code: "am", name: "Amharic" },
        { code: "yi", name: "Yiddish" },
        { code: "lo", name: "Lao" },
        { code: "uz", name: "Uzbek" },
        { code: "fo", name: "Faroese" },
        { code: "ht", name: "Haitian Creole" },
        { code: "ps", name: "Pashto" },
        { code: "tk", name: "Turkmen" },
        { code: "nn", name: "Nynorsk" },
        { code: "mt", name: "Maltese" },
        { code: "sa", name: "Sanskrit" },
        { code: "lb", name: "Luxembourgish" },
        { code: "my", name: "Myanmar" },
        { code: "bo", name: "Tibetan" },
        { code: "tl", name: "Tagalog" },
        { code: "mg", name: "Malagasy" },
        { code: "as", name: "Assamese" },
        { code: "tt", name: "Tatar" },
        { code: "haw", name: "Hawaiian" },
        { code: "ln", name: "Lingala" },
        { code: "ha", name: "Hausa" },
        { code: "ba", name: "Bashkir" },
        { code: "jw", name: "Javanese" },
        { code: "su", name: "Sundanese" }
      ].toSorted((a, b) => a.name.localeCompare(b.name));
    }
  });

  // src/asr/manager.ts
  var manager_exports = {};
  __export(manager_exports, {
    changeASRModel: () => changeASRModel,
    getManagerMessage: () => getManagerMessage,
    getManagerState: () => getManagerState,
    initializeASRSystem: () => initializeASRSystem,
    isWorkerReady: () => isWorkerReady,
    requestTranscription: () => requestTranscription,
    stopWorkerTranscription: () => stopWorkerTranscription,
    triggerASRInitialization: () => triggerASRInitialization
  });
  function setManagerState(state, message) {
    if (state === managerState && message === managerMessage) {
      return;
    }
    console.log(
      `[ASR Manager] State changing: ${managerState} -> ${state}`,
      message ? `(${message})` : ""
    );
    managerState = state;
    switch (state) {
      case "uninitialized":
        managerMessage = message || "Click mic to initialize";
        break;
      case "initializing":
        managerMessage = message || "Initializing ASR...";
        break;
      case "loading_model":
        managerMessage = message || "Loading ASR model...";
        break;
      case "warming_up":
        managerMessage = message || "Preparing model...";
        break;
      case "ready":
        managerMessage = message || "ASR Ready";
        break;
      case "error":
        managerMessage = message || "ASR Error: Unknown";
        break;
      default:
        console.warn(
          "[ASR Manager] setManagerState called with unknown state:",
          state
        );
        managerMessage = "ASR Status Unknown";
    }
    console.log(
      `[ASR Manager] Dispatching asrStatusUpdate: { state: ${state}, message: ${managerMessage} }`
    );
    const detail = {
      state,
      // Use the AsrManagerState directly
      message: managerMessage
    };
    document.dispatchEvent(
      new CustomEvent("asrStatusUpdate", { detail })
    );
  }
  function cleanupWorker(errorMessage) {
    console.warn(
      `[ASR Manager] Cleaning up worker. Error: ${errorMessage || "None"}`
    );
    if (worker) {
      worker.terminate();
      worker = null;
    }
    if (currentWorkerUrl) {
      URL.revokeObjectURL(currentWorkerUrl);
      currentWorkerUrl = null;
    }
    setManagerState(errorMessage ? "error" : "uninitialized", errorMessage);
  }
  function createWorker(args) {
    const { onReady } = args || {};
    console.log("[ASR Manager] createWorker called.");
    if (worker) {
      console.warn(
        "[ASR Manager] createWorker called when worker already exists."
      );
      return true;
    }
    if (managerState !== "uninitialized" && managerState !== "error") {
      console.warn(
        `[ASR Manager] createWorker called in unexpected state: ${managerState}`
      );
      return false;
    }
    if (!navigator.gpu) {
      console.error("[ASR Manager] createWorker: WebGPU not supported.");
      setManagerState("error", "WebGPU not supported");
      return false;
    }
    const selectedModelId = getSelectedModel();
    const modelConfig = getSelectedModelConfig();
    console.log(`[ASR Manager] Initializing worker with model: ${selectedModelId} (${modelConfig.modelPath})`);
    setManagerState("initializing", `Creating ASR Worker with ${modelConfig.name}...`);
    try {
      if (currentWorkerUrl) {
        URL.revokeObjectURL(currentWorkerUrl);
        currentWorkerUrl = null;
      }
      worker = fromScriptText(worker_adztq_default, {});
      currentWorkerUrl = worker.objectURL;
      worker.onmessage = (e) => {
        const { status, data, ...rest } = e.data;
        console.log("[ASR Manager] Received message from worker:", e.data);
        switch (status) {
          case "loading":
            setManagerState("loading_model", data || `Loading ${modelConfig.name}...`);
            break;
          case "ready":
            setManagerState("ready");
            onReady?.();
            break;
          case "error":
            console.error(
              "[ASR Manager] Received error status from Worker:",
              data
            );
            cleanupWorker(data || "Unknown worker error");
            break;
          case "transcribing_start":
          case "update":
          case "complete":
          case "chunk_progress":
            document.dispatchEvent(
              new CustomEvent("asrResult", {
                detail: { status, ...rest, data }
              })
            );
            break;
          default:
            console.warn(
              "[ASR Manager] Received unknown status from worker:",
              status
            );
            break;
        }
      };
      worker.onerror = (err) => {
        console.error(
          "[ASR Manager] Unhandled Worker Error event:",
          err.message,
          err
        );
        cleanupWorker(err.message || "Unhandled worker error");
      };
      console.log(
        `[ASR Manager] Worker instance created, sending initial load message with model: ${modelConfig.modelPath}`
      );
      const initialMessage = {
        type: "change_model",
        data: { modelId: selectedModelId, modelPath: modelConfig.modelPath }
      };
      worker.postMessage(initialMessage);
      return true;
    } catch (error) {
      console.error("[ASR Manager] Failed to instantiate worker:", error);
      cleanupWorker(`Failed to create worker: ${error.message || error}`);
      return false;
    }
  }
  function initializeASRSystem() {
    console.log(
      "[ASR Manager] initializeASRSystem called (passive initialization)."
    );
    if (managerState !== "uninitialized") {
      console.log("[ASR Manager] Already initialized or initializing.");
      return;
    }
    if (!navigator.gpu) {
      console.warn("[ASR Manager] WebGPU not supported. ASR will be disabled.");
      setManagerState("error", "WebGPU not supported");
    } else {
      console.log(
        "[ASR Manager] WebGPU supported. ASR state remains 'uninitialized'."
      );
    }
  }
  function triggerASRInitialization(args) {
    console.log(
      "[ASR Manager] triggerASRInitialization called. Current state:",
      managerState
    );
    if (managerState === "uninitialized" || managerState === "error") {
      console.log("[ASR Manager] Triggering worker creation...");
      createWorker(args);
    } else {
      console.log(
        "[ASR Manager] Initialization trigger ignored, state is:",
        managerState
      );
    }
  }
  function requestTranscription(audioData, language) {
    console.log(
      "[ASR Manager] requestTranscription called. Current state:",
      managerState
    );
    if (managerState === "ready" && worker) {
      console.log("[ASR Manager] Worker is ready, posting generate message.");
      const message = {
        type: "generate",
        data: {
          audio: audioData,
          language
        }
      };
      worker.postMessage(message);
    } else {
      console.warn(
        `[ASR Manager] Transcription requested but manager state is '${managerState}'. Ignoring.`
      );
      if (!worker) {
        console.error(
          "[ASR Manager] Worker instance is null, cannot transcribe."
        );
      }
    }
  }
  function isWorkerReady() {
    return managerState === "ready";
  }
  function getManagerState() {
    return managerState;
  }
  function getManagerMessage() {
    return managerMessage;
  }
  function stopWorkerTranscription() {
    console.log(
      "[ASR Manager] stopWorkerTranscription called. Current state:",
      managerState
    );
    if (worker) {
      console.log("[ASR Manager] Sending stop message to worker.");
      const stopMessage = { type: "stop" };
      worker.postMessage(stopMessage);
    } else {
      console.warn(
        "[ASR Manager] Cannot send stop message: Worker does not exist."
      );
    }
  }
  function changeASRModel(modelId, modelPath) {
    console.log(
      `[ASR Manager] changeASRModel called: ${modelId} (${modelPath}). Current state:`,
      managerState
    );
    if (!worker) {
      console.log(
        "[ASR Manager] Worker not initialized yet, triggering initialization with new model..."
      );
      triggerASRInitialization();
      setTimeout(() => {
        if (worker) {
          setManagerState("loading_model", `Switching to ${modelId}...`);
          const changeModelMessage2 = {
            type: "change_model",
            data: { modelId, modelPath }
          };
          worker.postMessage(changeModelMessage2);
        }
      }, 100);
      return;
    }
    setManagerState("loading_model", `Switching to ${modelId}...`);
    console.log(`[ASR Manager] Sending change_model message to worker: ${modelId}`);
    const changeModelMessage = {
      type: "change_model",
      data: { modelId, modelPath }
    };
    worker.postMessage(changeModelMessage);
  }
  var managerState, managerMessage, worker, currentWorkerUrl;
  var init_manager = __esm({
    "src/asr/manager.ts"() {
      "use strict";
      init_utils();
      init_worker_adztq();
      init_context_menu();
      managerState = "uninitialized";
      managerMessage = "Click mic to initialize";
      worker = null;
      currentWorkerUrl = null;
    }
  });

  // src/asr/instance.ts
  function setCurrentAsrInstance(instance) {
    window._currentAsrInstance = instance;
  }
  function getCurrentAsrInstance() {
    return window._currentAsrInstance ?? null;
  }

  // src/main.ts
  init_manager();
  init_config();

  // src/ui/dom-selectors.ts
  var DOM_SELECTORS = {
    micButton: ".mic-btn[data-asr-init]",
    chatInputContentEditable: ".aislash-editor-input[contenteditable='true']",
    fullInputBox: ".full-input-box",
    buttonContainer: ".button-container.composer-button-area"
  };

  // _cnenq00dz:E:\GitHub\yap-for-cursor\src\styles\styles.css
  var styles_default = `.sv-wrap {
  width: 0;
  height: 24px;
  opacity: 0;
  overflow: hidden;
  transition: width 0.3s ease, opacity 0.3s ease;
  margin-right: 2px;
  border-radius: 4px;
  vertical-align: middle;
  display: inline-block;
  position: relative;
  mask-image: linear-gradient(
    to right,
    transparent 0,
    black 10px,
    black calc(100% - 10px),
    transparent 100%
  );
}
.mic-btn {
  cursor: pointer;
  padding: 4px;
  border-radius: 10px;
  transition: background 0.2s, color 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  position: relative;
  color: #35ff00;
  background: #39ff5c24;
}
.mic-btn:hover {
  background: #00691324;
  color: #35ff00;
  }
.mic-btn.active {
  background: #f78f8f1f;
  color: ##ff0000;
}
.mic-btn.transcribing {
  background: #f78f8f1f;
  color: #ff0000;
}
.mic-btn.disabled {
  cursor: not-allowed;
  color: #bbb;
  background: transparent !important;
}
@keyframes sv-spin {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
.mic-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-top-color: #0cf;
  border-radius: 10px;
  animation: sv-spin 1s linear infinite;
}
.mic-btn.disabled .mic-spinner {
  border-top-color: #ccc;
}
.mic-btn.transcribing .mic-spinner {
  border-top-color: #0cf;
}
.mic-btn .status-tooltip {
  visibility: hidden;
  width: 120px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 3px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}
.mic-btn .status-tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}
.mic-btn:hover .status-tooltip,
.mic-btn.disabled .status-tooltip {
  visibility: visible;
  opacity: 1;
}
/* Styles for the cancel button - mimicking mic-btn but red */
.sv-cancel-btn {
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: background 0.2s, color 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  color: #e66;
  margin-right: 2px;
}
.sv-cancel-btn:hover {
  background: rgba(255, 100, 100, 0.1);
  color: #c33; /* Darker red on hover */
}
/* Styles for transcribing state controls */
.transcribe-controls {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.stop-btn-style {
  color: #e66;
  cursor: pointer;
  font-size: 10px;
}

/* --- Context Menu Styles --- */
.asr-context-menu {
  position: absolute;
  z-index: 10000;
  background-color: var(--vscode-menu-background, #252526);
  border: 1px solid var(--vscode-menu-border, #3c3c3c);
  color: var(--vscode-menu-foreground, #cccccc);
  min-width: 260px;
  max-width: 260px; /* Fixed width to prevent cutoff */
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  padding: 4px 0;
  border-radius: 4px;
  font-family: var(--vscode-font-family, 'Segoe UI', Arial, sans-serif);
  font-size: var(--vscode-font-size, 13px);
}

.asr-context-menu-title {
  padding: 8px 12px 6px 12px;
  font-weight: 600;
  font-size: 12px;
  color: var(--vscode-descriptionForeground, #cccccc99);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--vscode-menu-separatorBackground, #454545);
  margin-bottom: 4px;
  pointer-events: none;
}

.asr-context-menu-item {
  padding: 8px 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s ease;
  position: relative;
}

.asr-context-menu-item:hover {
  background-color: var(--vscode-menu-selectionBackground, #04395e);
  color: var(--vscode-menu-selectionForeground, #ffffff);
}

.asr-context-menu-item.selected {
  background-color: var(--vscode-list-activeSelectionBackground, #094771);
  color: var(--vscode-list-activeSelectionForeground, #ffffff);
  font-weight: 500;
}

.asr-context-menu-item.selected::before {
  content: "\u2713 ";
  margin-right: 6px;
  color: var(--vscode-charts-green, #89d185);
  font-weight: bold;
}

/* --- Context Menu Separator --- */
.asr-context-menu-separator {
  height: 1px;
  background-color: var(--vscode-menu-separatorBackground, #454545);
  margin: 8px 0;
}

/* --- Language Item Styling --- */
.asr-language-item {
  padding: 8px 12px !important;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* --- Model Selection Styles --- */
.asr-model-item {
  white-space: normal !important;
  padding: 10px 12px !important;
  border-left: 3px solid transparent;
  transition: all 0.15s ease;
  cursor: pointer;
}

/* Remove tick mark for model items specifically */
.asr-model-item.selected::before {
  content: none;
}

.asr-model-item:hover {
  border-left-color: var(--vscode-focusBorder, #007acc);
  background-color: var(--vscode-menu-selectionBackground, #04395e);
}

.asr-model-item.selected {
  border-left-color: var(--vscode-charts-green, #89d185);
  background-color: var(--vscode-list-activeSelectionBackground, #094771);
}

.asr-model-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.asr-model-name {
  font-weight: 500;
  font-size: 14px;
  color: var(--vscode-editor-foreground, #d4d4d4);
}

.asr-model-size {
  font-size: 11px;
  color: #ffffff;
  background-color: #004b6b;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 500;
}

.asr-model-description {
  font-size: 12px;
  color: var(--vscode-descriptionForeground, #cccccc99);
  margin-bottom: 6px;
  line-height: 1.3;
}

.asr-model-badges {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-bottom: 2px;
}

.asr-badge {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* Simplified badge colors */
.asr-badge-quality-basic { 
  background-color: #666;
  color: #ffffff;
}
.asr-badge-quality-good { 
  background-color: var(--vscode-button-background, #0e639c);
  color: #ffffff;
}
.asr-badge-quality-high { 
  background-color: var(--vscode-charts-green, #89d185);
  color: #000000;
}
.asr-badge-quality-excellent { 
  background-color: var(--vscode-charts-purple, #b180d7);
  color: #ffffff;
}

/* Speed badges */
.asr-badge-speed-fast { 
  background-color: var(--vscode-charts-green, #89d185);
  color: #000000;
}
.asr-badge-speed-medium { 
  background-color: var(--vscode-charts-orange, #d18616);
  color: #ffffff;
}
.asr-badge-speed-slow { 
  background-color: var(--vscode-charts-red, #f85149);
  color: #ffffff;
}
.asr-badge-speed-very-slow { 
  background-color: #8b0000;
  color: #ffffff;
}

.asr-model-warning {
  font-size: 11px;
  color: var(--vscode-inputValidation-warningForeground, #ff8c00);
  margin-top: 4px;
  line-height: 1.2;
  padding: 4px 6px;
  background-color: rgba(255, 140, 0, 0.1);
  border-radius: 3px;
  border-left: 2px solid var(--vscode-inputValidation-warningForeground, #ff8c00);
}

/* --- Custom Scrollbar for Context Menu --- */
.asr-context-menu::-webkit-scrollbar {
  width: 6px; /* Thinner scrollbar */
}

.asr-context-menu::-webkit-scrollbar-track {
  background: var(
    --vscode-menu-background,
    #252526
  ); /* Match menu background */
  border-radius: 3px;
}

.asr-context-menu::-webkit-scrollbar-thumb {
  background-color: var(
    --vscode-scrollbarSlider-background,
    #4d4d4d
  ); /* Subtle thumb color */
  border-radius: 3px;
  border: 1px solid var(--vscode-menu-background, #252526); /* Creates a small border effect */
}

.asr-context-menu::-webkit-scrollbar-thumb:hover {
  background-color: var(
    --vscode-scrollbarSlider-hoverBackground,
    #6b6b6b
  ); /* Darker on hover */
}

/* Firefox scrollbar styling */
.asr-context-menu {
  scrollbar-width: thin; /* Use thin scrollbar */
  scrollbar-color: var(--vscode-scrollbarSlider-background, #4d4d4d)
    var(--vscode-menu-background, #252526); /* thumb track */
}
`;

  // src/ui/mic-button.ts
  init_manager();

  // src/audio/processing.ts
  init_config();
  async function processAudioBlob(blob, targetSr = TARGET_SAMPLE_RATE) {
    if (!blob || blob.size === 0) return null;
    const AudioContext = window.AudioContext;
    if (!AudioContext) {
      console.error("Browser does not support AudioContext.");
      return null;
    }
    const audioContext = new AudioContext();
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      if (audioBuffer.sampleRate === targetSr) {
        await audioContext.close();
        return audioBuffer.getChannelData(0);
      }
      console.log(`Resampling from ${audioBuffer.sampleRate}Hz to ${targetSr}Hz`);
      const duration = audioBuffer.duration;
      const offlineContext = new OfflineAudioContext(
        1,
        // Mono
        Math.ceil(duration * targetSr),
        // Calculate output buffer size correctly
        targetSr
      );
      const bufferSource = offlineContext.createBufferSource();
      bufferSource.buffer = audioBuffer;
      bufferSource.connect(offlineContext.destination);
      bufferSource.start();
      const resampledBuffer = await offlineContext.startRendering();
      await audioContext.close();
      return resampledBuffer.getChannelData(0);
    } catch (error) {
      console.error("Audio processing failed:", error);
      if (audioContext && audioContext.state !== "closed") {
        await audioContext.close();
      }
      return null;
    }
  }

  // src/ui/mic-button.ts
  init_context_menu();

  // src/utils/hotkey.ts
  var registeredHotkeys = /* @__PURE__ */ new Map();
  function getHotkeyId(key, target) {
    return `${key}:${target === document ? "document" : "element"}`;
  }
  function registerHotkey(key, callback, options = {}) {
    const {
      target = document,
      preventDefault = true,
      stopPropagation = true,
      allowInInputs = true
    } = options;
    const keys = key.split("+").map((k) => k.trim().toLowerCase());
    const mainKey = keys[keys.length - 1];
    const modifiers = {
      ctrl: keys.includes("ctrl") || keys.includes("control"),
      alt: keys.includes("alt"),
      shift: keys.includes("shift"),
      meta: keys.includes("meta") || keys.includes("command") || keys.includes("cmd")
    };
    const hotkeyId = getHotkeyId(key, target);
    if (registeredHotkeys.has(hotkeyId)) {
      const existingRegistration = registeredHotkeys.get(hotkeyId);
      existingRegistration.unregister();
    }
    const handler = (event) => {
      if (!allowInInputs && isInputElement(event.target)) {
        return;
      }
      const keyMatch = event.key.toLowerCase() === mainKey.toLowerCase();
      const ctrlMatch = event.ctrlKey === modifiers.ctrl;
      const altMatch = event.altKey === modifiers.alt;
      const shiftMatch = event.shiftKey === modifiers.shift;
      const metaMatch = event.metaKey === modifiers.meta;
      if (keyMatch && ctrlMatch && altMatch && shiftMatch && metaMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        if (stopPropagation) {
          event.stopPropagation();
        }
        callback(event);
      }
    };
    const unregister = () => {
      target.removeEventListener("keydown", handler, {
        capture: true
      });
      registeredHotkeys.delete(hotkeyId);
    };
    target.addEventListener("keydown", handler, {
      capture: true
    });
    registeredHotkeys.set(hotkeyId, {
      target,
      handler,
      unregister
    });
    return unregister;
  }
  function isInputElement(element) {
    if (!element) return false;
    const tagName = element.tagName.toLowerCase();
    const isContentEditable = element.getAttribute("contenteditable") === "true";
    return tagName === "input" || tagName === "textarea" || tagName === "select" || isContentEditable;
  }

  // src/ui/mic-button.ts
  init_config();
  init_config();
  var styleId = "fadein-width-bar-wave-styles";
  function injectGlobalStyles() {
    if (!document.getElementById(styleId)) {
      const s = document.createElement("style");
      s.id = styleId;
      s.textContent = styles_default;
      document.head.appendChild(s);
    }
  }
  function updateMicButtonState(button, newState, message = "") {
    if (!button) return;
    const actualAsrState = getManagerState();
    const actualAsrMessage = getManagerMessage();
    let effectiveState = newState;
    let displayMessage = message;
    switch (actualAsrState) {
      case "uninitialized":
        effectiveState = "uninitialized";
        displayMessage = actualAsrMessage || "Click to initialize";
        break;
      case "initializing":
      case "loading_model":
      case "warming_up":
        effectiveState = "loading";
        displayMessage = actualAsrMessage;
        break;
      case "error":
        effectiveState = "disabled";
        displayMessage = `Error: ${actualAsrMessage}`;
        break;
      case "ready":
        if (newState === "recording") {
          effectiveState = "recording";
          displayMessage = message || "Recording...";
        } else if (newState === "transcribing") {
          effectiveState = "transcribing";
          displayMessage = message || "Transcribing...";
        } else if (newState === "disabled") {
          effectiveState = "disabled";
          displayMessage = message || "Disabled";
        } else {
          effectiveState = "idle";
          displayMessage = message;
        }
        break;
      // If managerState is not one of the above, something is wrong, default to disabled?
      // Or let the initial newState pass through? Let's default to disabled for safety.
      default:
        console.warn(
          `[MicButton] Unexpected manager state: ${actualAsrState}, defaulting UI to disabled.`
        );
        effectiveState = "disabled";
        displayMessage = actualAsrMessage || "ASR not ready";
    }
    if ((effectiveState === "recording" || effectiveState === "transcribing") && actualAsrState !== "ready") {
      console.warn(
        `[MicButton] State mismatch: Requested ${effectiveState} but manager state is ${actualAsrState}. Forcing disabled.`
      );
      effectiveState = "disabled";
      displayMessage = actualAsrMessage || "ASR not ready";
    }
    button.asrState = effectiveState === "uninitialized" || effectiveState === "loading" ? "idle" : effectiveState;
    const alreadyHasSpinner = !!button.querySelector(".mic-spinner");
    const isStayingLoading = effectiveState === "loading" && alreadyHasSpinner;
    if (!isStayingLoading) {
      button.classList.remove("active", "transcribing", "disabled");
      button.innerHTML = "";
      const tooltip2 = document.createElement("span");
      tooltip2.className = "status-tooltip";
      button.appendChild(tooltip2);
    } else {
      let tooltip2 = button.querySelector(".status-tooltip");
      if (!tooltip2) {
        tooltip2 = document.createElement("span");
        tooltip2.className = "status-tooltip";
        button.appendChild(tooltip2);
      }
    }
    const tooltip = button.querySelector(".status-tooltip");
    let iconClass = "";
    let defaultTitle = displayMessage || "";
    if (tooltip) {
      tooltip.style.display = defaultTitle ? "block" : "none";
    }
    if (!isStayingLoading) {
      switch (effectiveState) {
        case "recording":
          button.classList.add("active");
          iconClass = "codicon-primitive-square";
          break;
        case "transcribing":
          button.classList.add("transcribing");
          const transcribeControlContainer = document.createElement("div");
          transcribeControlContainer.className = "transcribe-controls";
          const spinnerT = document.createElement("div");
          spinnerT.className = "mic-spinner";
          transcribeControlContainer.appendChild(spinnerT);
          const stopBtn = document.createElement("span");
          stopBtn.className = "codicon codicon-x stop-transcription-btn stop-btn-style";
          stopBtn.setAttribute("title", "Stop Transcription");
          transcribeControlContainer.appendChild(stopBtn);
          button.appendChild(transcribeControlContainer);
          iconClass = "";
          break;
        case "loading":
          button.classList.add("disabled");
          if (!button.querySelector(".mic-spinner")) {
            const spinnerL = document.createElement("div");
            spinnerL.className = "mic-spinner";
            button.appendChild(spinnerL);
          }
          iconClass = "";
          break;
        case "disabled":
          button.classList.add("disabled");
          if (actualAsrState === "error") {
            iconClass = "codicon-error";
          } else {
            iconClass = "codicon-mic-off";
          }
          break;
        case "uninitialized":
          iconClass = "codicon-mic";
          break;
        case "idle":
        default:
          iconClass = "codicon-mic";
          break;
      }
      if (iconClass) {
        const icon = document.createElement("span");
        icon.className = `codicon ${iconClass} !text-[12px]`;
        if (tooltip && tooltip.parentNode === button) {
          button.insertBefore(icon, tooltip);
        } else {
          button.appendChild(icon);
          if (tooltip && !button.contains(tooltip)) {
            button.appendChild(tooltip);
          }
        }
      }
    } else {
      button.classList.add("disabled");
    }
    if (tooltip) {
      tooltip.textContent = defaultTitle;
    }
  }
  function initWave(box) {
    if (box.dataset.waveInit) return;
    box.dataset.waveInit = "1";
    const area = box.querySelector(DOM_SELECTORS.buttonContainer);
    const chatInputContentEditable = box.querySelector(
      DOM_SELECTORS.chatInputContentEditable
    );
    if (!area || !chatInputContentEditable) {
      console.warn(
        "Could not find button area or chatInputContentEditable for",
        box
      );
      return;
    }
    const wrap = document.createElement("div");
    wrap.className = "sv-wrap";
    wrap.style.opacity = "0";
    const canvas = document.createElement("canvas");
    canvas.width = 120;
    canvas.height = 24;
    wrap.appendChild(canvas);
    const cancelBtn = document.createElement("div");
    cancelBtn.className = "sv-cancel-btn";
    cancelBtn.setAttribute("title", "Cancel and discard recording");
    cancelBtn.style.display = "none";
    const cancelIcon = document.createElement("span");
    cancelIcon.className = "codicon codicon-trash !text-[12px]";
    cancelBtn.appendChild(cancelIcon);
    const mic = document.createElement("div");
    mic.className = "mic-btn";
    mic.dataset.asrInit = "1";
    const statusTooltip = document.createElement("span");
    statusTooltip.className = "status-tooltip";
    mic.appendChild(statusTooltip);
    area.prepend(mic);
    area.prepend(wrap);
    area.prepend(cancelBtn);
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const BAR_WIDTH = 2, BAR_GAP = 1, STEP = BAR_WIDTH + BAR_GAP;
    const SLOTS = Math.floor(W / STEP);
    const MIN_H = 1, MAX_H = H - 2, SENS = 3.5, SCROLL = 0.5;
    let amps = new Array(SLOTS).fill(MIN_H);
    let alphas = new Array(SLOTS).fill(1);
    let offset = 0;
    let audioCtx = null;
    let analyser = null;
    let dataArr = null;
    let stream = null;
    let sourceNode = null;
    let raf = null;
    let mediaRecorder = null;
    let audioChunks = [];
    let isCancelled = false;
    updateMicButtonState(mic, "idle");
    const handleAsrStatusUpdate = (event) => {
      const customEvent = event;
      console.log("[MicButton] ASR Status Update Received:", customEvent.detail);
      updateMicButtonState(mic, mic.asrState || "idle");
    };
    document.addEventListener(
      "asrStatusUpdate",
      handleAsrStatusUpdate
    );
    const handleAsrResultUpdate = (event) => {
      const customEvent = event;
      const { status, chunkIndex, totalChunks } = customEvent.detail;
      const currentInstance = getCurrentAsrInstance();
      if (currentInstance && currentInstance.mic === mic) {
        if (status === "chunk_progress" && chunkIndex !== void 0 && totalChunks !== void 0) {
          const progressMessage = `Processing chunk ${chunkIndex + 1} of ${totalChunks}`;
          updateMicButtonState(mic, "transcribing", progressMessage);
        }
      }
    };
    document.addEventListener("asrResult", handleAsrResultUpdate);
    function draw() {
      if (!analyser || !dataArr || !ctx) return;
      analyser.getByteTimeDomainData(dataArr);
      let peak = 0;
      for (const v of dataArr) peak = Math.max(peak, Math.abs(v - 128) / 128);
      peak = Math.min(1, peak * SENS);
      const h = MIN_H + peak * (MAX_H - MIN_H);
      offset += SCROLL;
      if (offset >= STEP) {
        offset -= STEP;
        amps.shift();
        alphas.shift();
        amps.push(h);
        alphas.push(0);
      }
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = BAR_WIDTH;
      ctx.lineCap = "round";
      for (let i = 0; i < SLOTS; i++) {
        const barH = amps[i];
        if (alphas[i] < 1) alphas[i] = Math.min(1, alphas[i] + 0.1);
        const x = i * STEP - offset + BAR_WIDTH / 2;
        const y1 = (H - barH) / 2, y2 = y1 + barH;
        ctx.strokeStyle = "#0cf";
        ctx.globalAlpha = alphas[i];
        ctx.beginPath();
        ctx.moveTo(x, y1);
        ctx.lineTo(x, y2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }
    function stopVisualization() {
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
      wrap.style.opacity = "0";
      wrap.style.width = "0";
      setTimeout(() => {
        const currentMicState = mic.asrState;
        if (currentMicState !== "recording" && ctx) {
          ctx.clearRect(0, 0, W, H);
        }
      }, 300);
      amps.fill(MIN_H);
      alphas.fill(1);
      offset = 0;
      sourceNode?.disconnect();
      analyser = null;
      sourceNode = null;
    }
    function stopRecording(forceStop = false) {
      const currentMicState = mic.asrState;
      if (!forceStop && currentMicState !== "recording") return;
      console.log("Stopping recording...");
      stopVisualization();
      if (mediaRecorder && mediaRecorder.state === "recording") {
        try {
          mediaRecorder.stop();
        } catch (e) {
          console.warn("Error stopping MediaRecorder:", e);
        }
      }
      mediaRecorder = null;
      stream?.getTracks().forEach((track) => track.stop());
      stream = null;
      audioCtx?.close().catch((e) => console.warn("Error closing AudioContext:", e));
      audioCtx = null;
      cancelBtn.style.display = "none";
      if (forceStop && !isCancelled) {
        updateMicButtonState(mic, "idle", "Recording stopped");
      }
    }
    function startRecording() {
      if (mic.asrState === "recording") {
        console.warn("Mic is already recording, ignoring startRecording call.");
        return;
      }
      console.log(
        "Attempting to start recording (ASR should be ready)...",
        getManagerState()
      );
      updateMicButtonState(mic, "recording");
      audioChunks = [];
      isCancelled = false;
      navigator.mediaDevices.getUserMedia({ audio: true }).then((ms) => {
        if (mic.asrState !== "recording") {
          console.warn(
            "Mic state changed away from recording during getUserMedia, aborting."
          );
          ms.getTracks().forEach((track) => track.stop());
          updateMicButtonState(mic, "idle");
          return;
        }
        stream = ms;
        const AudioContext = window.AudioContext;
        if (!AudioContext) throw new Error("AudioContext not supported");
        audioCtx = new AudioContext();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.6;
        dataArr = new Uint8Array(analyser.frequencyBinCount);
        sourceNode = audioCtx.createMediaStreamSource(stream);
        sourceNode.connect(analyser);
        wrap.style.width = `${SLOTS * STEP}px`;
        wrap.style.opacity = "1";
        raf = requestAnimationFrame(draw);
        cancelBtn.style.display = "inline-flex";
        try {
          const mimeTypes = [
            "audio/webm;codecs=opus",
            "audio/ogg;codecs=opus",
            "audio/wav",
            "audio/mp4",
            "audio/webm"
          ];
          let selectedMimeType = void 0;
          for (const mimeType of mimeTypes) {
            if (MediaRecorder.isTypeSupported(mimeType)) {
              selectedMimeType = mimeType;
              break;
            }
          }
          if (!selectedMimeType)
            console.warn("Using browser default MIME type.");
          mediaRecorder = new MediaRecorder(stream, {
            mimeType: selectedMimeType
          });
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) audioChunks.push(event.data);
          };
          mediaRecorder.onstop = async () => {
            console.log("MediaRecorder stopped. isCancelled:", isCancelled);
            cancelBtn.style.display = "none";
            if (isCancelled) {
              console.log("Recording was cancelled. Discarding audio chunks.");
              audioChunks = [];
              updateMicButtonState(mic, "idle");
              isCancelled = false;
              return;
            }
            if (audioChunks.length === 0) {
              console.log("No audio chunks recorded.");
              updateMicButtonState(mic, "idle", "No audio recorded");
              return;
            }
            console.log("Processing recorded audio chunks...");
            updateMicButtonState(mic, "transcribing");
            const audioBlob = new Blob(audioChunks, {
              type: mediaRecorder?.mimeType || "audio/webm"
            });
            audioChunks = [];
            try {
              const float32Array = await processAudioBlob(audioBlob);
              const currentLanguage = getSelectedLanguage();
              console.log(`Requesting transcription in: ${currentLanguage}`);
              if (float32Array && isWorkerReady()) {
                updateMicButtonState(mic, "transcribing");
                requestTranscription(float32Array, currentLanguage);
              } else if (!float32Array) {
                console.error("Audio processing failed.");
                updateMicButtonState(mic, "idle", "Audio processing failed");
              } else {
                console.error("ASR worker not ready for transcription.");
                updateMicButtonState(mic, "idle", "ASR worker not ready");
              }
            } catch (procError) {
              console.error("Error processing audio blob:", procError);
              updateMicButtonState(mic, "idle", "Error processing audio");
            }
          };
          mediaRecorder.onerror = (event) => {
            console.error("MediaRecorder Error:", event.error);
            updateMicButtonState(mic, "idle", "Recording error");
            stopRecording(true);
          };
          mediaRecorder.start();
          console.log("MediaRecorder started.");
        } catch (e) {
          console.error("Failed to create MediaRecorder:", e);
          updateMicButtonState(mic, "idle", "Recorder init failed");
          stopRecording(true);
        }
      }).catch((err) => {
        console.error("getUserMedia failed:", err);
        let message = "Mic access denied or failed";
        if (err.name === "NotAllowedError")
          message = "Microphone access denied";
        else if (err.name === "NotFoundError") message = "No microphone found";
        updateMicButtonState(mic, "idle", message);
        stopRecording(true);
      });
    }
    registerHotkey(HOTKEYS.TOGGLE_RECORDING, () => {
      const managerState2 = getManagerState();
      if (managerState2 === "uninitialized") {
        triggerASRInitialization({
          onReady: startRecording
        });
        return;
      }
      if (mic.asrState === "recording") {
        console.warn("[Hotkey] Stopping recording...");
        stopRecording();
      } else if (mic.asrState === "idle" || mic.asrState === "disabled") {
        console.warn("[Hotkey] Starting recording...");
        startRecording();
      } else {
        console.warn("[Hotkey] Ignoring hotkey in current state:", mic.asrState);
      }
    });
    mic.addEventListener("click", (e) => {
      if (e.button !== 0) return;
      if (chatInputContentEditable) {
        setCurrentAsrInstance({ mic, chatInputContentEditable });
      }
      if (mic.asrState === "recording") {
        stopRecording();
        return;
      }
      const managerState2 = getManagerState();
      console.log("Mousedown detected. ASR State:", managerState2);
      switch (managerState2) {
        case "uninitialized":
          console.log("ASR uninitialized, triggering initialization...");
          triggerASRInitialization({
            onReady: startRecording
          });
          updateMicButtonState(mic, "idle", "Initializing...");
          break;
        case "ready":
          console.log("ASR ready, starting recording...");
          startRecording();
          break;
        case "initializing":
        case "loading_model":
        case "warming_up":
          console.log("ASR is currently loading/initializing. Please wait.");
          updateMicButtonState(mic, "idle");
          break;
        case "error":
          console.warn("Cannot start recording, ASR is in error state.");
          updateMicButtonState(mic, "idle");
          break;
        default:
          console.log("Mousedown ignored in current state:", managerState2);
          break;
      }
    });
    cancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (mic.asrState === "recording") {
        console.log("Cancel button clicked.");
        isCancelled = true;
        stopRecording(true);
      }
    });
    mic.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      console.log("Right-click detected on mic button.");
      if (chatInputContentEditable && !getCurrentAsrInstance()) {
        setCurrentAsrInstance({ mic, chatInputContentEditable });
      }
      createASRContextMenu(
        mic,
        // Language selection callback
        (selectedLang) => {
          setSelectedLanguage(selectedLang);
          console.log(`[ASR] Language changed to: ${selectedLang}`);
          updateMicButtonState(mic, mic.asrState || "idle", `Language: ${selectedLang}`);
        },
        // Model selection callback
        (selectedModelId) => {
          const modelConfig = WHISPER_MODEL_REGISTRY[selectedModelId];
          if (!modelConfig) {
            console.error(`[ASR] Invalid model selected: ${selectedModelId}`);
            return;
          }
          console.log(`[ASR] Model change requested: ${selectedModelId} (${modelConfig.modelPath})`);
          updateMicButtonState(mic, "disabled", `Switching to ${modelConfig.name}...`);
          setSelectedModel(selectedModelId);
          Promise.resolve().then(() => (init_manager(), manager_exports)).then(({ changeASRModel: changeASRModel2 }) => {
            changeASRModel2(selectedModelId, modelConfig.modelPath);
          });
        }
      );
    });
  }
  function setupMicButtonObserver() {
    const handleInitialStatus = (event) => {
      const customEvent = event;
      const state = customEvent.detail.state;
      console.log("Observer setup: Received initial ASR state", state);
      document.querySelectorAll(DOM_SELECTORS.fullInputBox).forEach((el) => {
        const mic = el.querySelector(".mic-btn");
        if (mic && mic.dataset.waveInit) {
          updateMicButtonState(mic, mic.asrState || "idle");
        }
      });
    };
    document.addEventListener(
      "asrStatusUpdate",
      handleInitialStatus,
      {
        once: true
      }
    );
    const obs = new MutationObserver((records) => {
      records.forEach((r) => {
        r.addedNodes.forEach((n) => {
          if (n instanceof HTMLElement) {
            if (n.matches(DOM_SELECTORS.fullInputBox)) {
              initWave(n);
            }
            n.querySelectorAll(DOM_SELECTORS.fullInputBox).forEach(
              (el) => {
                if (!el.querySelector('.mic-btn[data-wave-init="1"]')) {
                  initWave(el);
                }
              }
            );
          }
        });
      });
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    document.querySelectorAll(DOM_SELECTORS.fullInputBox).forEach((el) => {
      if (!el.querySelector('.mic-btn[data-wave-init="1"]')) {
        initWave(el);
      }
    });
    injectGlobalStyles();
  }

  // src/main.ts
  (function() {
    "use strict";
    setCurrentAsrInstance(null);
    if (!navigator.gpu) {
      console.warn("WebGPU not supported on this browser. ASR will not work.");
    }
    let transformersLibLoaded = typeof window.transformers !== "undefined";
    if (!transformersLibLoaded && typeof __require !== "undefined") {
      const scriptId = "hf-transformers-script";
      if (!document.getElementById(scriptId)) {
        console.log("Loading Hugging Face Transformers library...");
        const script = document.createElement("script");
        script.id = scriptId;
        script.type = "module";
        script.textContent = `
              console.log('[ASR] Injected script block executing...');
              console.log('[ASR] Attempting to load Transformers library...');
              try {
                  const { ${[
          "AutoTokenizer",
          "AutoProcessor",
          "WhisperForConditionalGeneration",
          "TextStreamer",
          "full",
          "env"
        ].join(
          ","
        )} } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@${HUGGING_FACE_TRANSFORMERS_VERSION}');
                  console.log('[ASR] Transformers library imported successfully.');
                  window.transformers = { AutoTokenizer, AutoProcessor, WhisperForConditionalGeneration, TextStreamer, full, env };
                  window.transformers.env.backends.onnx.logLevel = 'info';
                  console.log('[ASR] Transformers library loaded and configured.');
                  document.dispatchEvent(new CustomEvent('transformersLoaded'));
              } catch (error) {
                  console.error("[ASR] Failed to load Hugging Face Transformers library:", error);
              }
          `;
        document.head.appendChild(script);
      }
    } else if (transformersLibLoaded && window.transformers) {
      window.transformers.env.backends.onnx.logLevel = "info";
    }
    console.log("Initializing ASR system...");
    initializeASRSystem();
    console.log("ASR system initialized");
    document.addEventListener("asrStatusUpdate", (e) => {
      const event = e;
      const managerState2 = event.detail.state;
      const message = event.detail.message;
      console.log(
        `[ASR] Received asrStatusUpdate: State=${managerState2}, Msg=${message}`
      );
      let targetMicState;
      switch (managerState2) {
        case "uninitialized":
        case "ready":
        case "error":
          targetMicState = "idle";
          break;
        case "initializing":
        case "loading_model":
        case "warming_up":
          targetMicState = "disabled";
          break;
        default:
          console.warn(
            "[ASR] Unhandled manager state in status listener:",
            managerState2
          );
          targetMicState = "idle";
      }
      if (managerState2 === "error") {
        console.error(
          "[ASR System Error]:",
          message || "Unknown ASR system error"
        );
      }
      document.querySelectorAll(".mic-btn[data-asr-init]").forEach((btn) => {
        if (btn.asrState !== targetMicState) {
          updateMicButtonState(btn, targetMicState);
        }
      });
    });
    if (!window._asrGlobalHandlerAttached) {
      let globalAsrResultHandler = function(e) {
        const event = e;
        const { status, output = "", data, chunkIndex, totalChunks, chunkOutput } = event.detail;
        const asrInstance = getCurrentAsrInstance();
        if (!asrInstance) return;
        const { mic: mic2, chatInputContentEditable: chatInputContentEditable2 } = asrInstance;
        const currentMicState = mic2.asrState;
        if (status === "transcribing_start") {
          buffer = "";
          updateMicButtonState(mic2, "transcribing");
        } else if (status === "update") {
          buffer = output;
          console.log(`[ASR] Single chunk update: "${output}"`);
          if (currentMicState !== "transcribing") {
            updateMicButtonState(mic2, "transcribing");
          }
        } else if (status === "chunk_progress") {
          if (chunkIndex !== void 0 && totalChunks !== void 0) {
            const progressMessage = `Processing chunk ${chunkIndex + 1}/${totalChunks}`;
            updateMicButtonState(mic2, "transcribing", progressMessage);
            if (chunkOutput) {
              console.log(`[ASR] Chunk ${chunkIndex + 1} partial result: "${chunkOutput}"`);
            }
          }
        } else if (status === "complete") {
          updateReactInput(chatInputContentEditable2, output, false);
          buffer = "";
          updateMicButtonState(mic2, "idle");
          chatInputContentEditable2.focus();
        } else if (status === "error") {
          console.error("Transcription error:", data);
          updateMicButtonState(
            mic2,
            "idle",
            `Error: ${data || "Unknown transcription error"}`
          );
        }
      };
      let buffer = "";
      document.addEventListener("asrResult", globalAsrResultHandler);
      window._asrGlobalHandlerAttached = true;
    }
    setupMicButtonObserver();
    const mic = document.querySelector(DOM_SELECTORS.micButton);
    const chatInputContentEditable = document.querySelector(
      DOM_SELECTORS.fullInputBox
    );
    if (mic && chatInputContentEditable) {
      setCurrentAsrInstance({ mic, chatInputContentEditable });
    }
    function updateReactInput(element, text, shouldReplace = false) {
      if (text === "") {
        return;
      }
      element.focus();
      if (shouldReplace) {
        if (element.textContent === text) {
          return;
        }
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(element);
        selection?.removeAllRanges();
        selection?.addRange(range);
        document.execCommand("insertText", false, text);
      } else {
        const currentContent = element.textContent?.trim() || "";
        let textToAppend = text;
        if (currentContent.length > 0 && !text.startsWith(" ")) {
          textToAppend = " " + text;
        }
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
        document.execCommand("insertText", false, textToAppend);
      }
      const inputEvent = new Event("input", { bubbles: true, cancelable: true });
      element.dispatchEvent(inputEvent);
    }
  })();
})();