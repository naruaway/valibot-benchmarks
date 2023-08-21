"use strict";
      (()=>{"use strict";var e=class extends Error{issues;constructor(e){super(e[0].message),this.name="ValiError",this.issues=e}};Symbol("brand");function r(r,n,t){let a=r;const i=[];for(const e of n)try{a=e(a,t)}catch(e){if(t.abortEarly||t.abortPipeEarly)throw e;i.push(...e.issues)}if(i.length)throw new e(i);return a}function n(e,r){return[...e?.path||[],r]}function t(e,r){const[n,t=[]]=e&&"string"!=typeof e?[void 0,e]:[e,r];return{error:n,pipe:t}}function a(a,i,s){const{error:o,pipe:u}=t(i,s);return{schema:"array",array:{item:a},async:!1,parse(t,i){if(!Array.isArray(t))throw new e([{reason:"type",validation:"array",origin:"value",message:o||"Invalid type",input:t,...i}]);const s=[],c=[];for(const[e,r]of t.entries())try{s.push(a.parse(r,{...i,path:n(i,{schema:"array",input:t,key:e,value:r})}))}catch(e){if(i?.abortEarly)throw e;c.push(...e.issues)}if(c.length)throw new e(c);return r(s,u,{...i,reason:"array"})}}}function i(r,n){return{schema:"literal",literal:r,async:!1,parse(t,a){if(t!==r)throw new e([{reason:"type",validation:"literal",origin:"value",message:n||"Invalid type",input:t,...a}]);return t}}}function s(a,i,s){const{error:o,pipe:u}=t(i,s);return{schema:"object",object:a,async:!1,parse(t,i){if(!t||"object"!=typeof t||"[object Object]"!==t.toString())throw new e([{reason:"type",validation:"object",origin:"value",message:o||"Invalid type",input:t,...i}]);const s={},c=[];for(const[e,r]of Object.entries(a))try{const a=t[e];s[e]=r.parse(a,{...i,path:n(i,{schema:"object",input:t,key:e,value:a})})}catch(e){if(i?.abortEarly)throw e;c.push(...e.issues)}if(c.length)throw new e(c);return r(s,u,{...i,reason:"object"})}}}function o(e){return{schema:"optional",wrapped:e,async:!1,parse:(r,n)=>void 0===r?r:e.parse(r,n)}}function u(n,a){const{error:i,pipe:s}=t(n,a);return{schema:"string",async:!1,parse(n,t){if("string"!=typeof n)throw new e([{reason:"type",validation:"string",origin:"value",message:i||"Invalid type",input:n,...t}]);return r(n,s,{...t,reason:"string"})}}}function c(e,r){return{...e,parse:(n,t)=>r(e.parse(n,t))}}function l(r,n){return(t,a)=>{if(t>r)throw new e([{validation:"max_value",origin:"value",message:n||"Invalid value",input:t,...a}]);return t}}function p(r,n){return(t,a)=>{if(t<r)throw new e([{validation:"min_value",origin:"value",message:n||"Invalid value",input:t,...a}]);return t}}const h=s({one:a(c(s({items:a(s({val:o((f=[i("hello"),i("world")],{schema:"union",union:f,async:!1,parse(r,n){let t;const a=[];for(const e of f)try{t=[e.parse(r,n)];break}catch(e){a.push(...e.issues)}if(!t)throw new e([{reason:"type",validation:"union",origin:"value",message:y||"Invalid type",input:r,issues:a,...n}]);return t[0]}})),str:c(u([function(r,n){return(t,a)=>{if(t.length<r)throw new e([{validation:"min_length",origin:"value",message:n||"Invalid length",input:t,...a}]);return t}}(2),function(r,n){return(t,a)=>{if(t.length>r)throw new e([{validation:"max_length",origin:"value",message:n||"Invalid length",input:t,...a}]);return t}}(5)]),(e=>e+"_APPENDED")),num:c(function(n,a){const{error:i,pipe:s}=t(n,a);return{schema:"number",async:!1,parse(n,t){if("number"!=typeof n)throw new e([{reason:"type",validation:"number",origin:"value",message:i||"Invalid type",input:n,...t}]);return r(n,s,{...t,reason:"number"})}}}([p(100),l(200)]),String)}))}),(e=>["FIRST",...e.items])))});var f,y;globalThis.BENCHMARK_VAR_SCHEMA_SAFE_PARSE=e=>function(e,r,n){try{return{success:!0,data:e.parse(r,n)}}catch(e){return{success:!1,error:e}}}(h,e)})();
      (()=>{"use strict";globalThis.BENCHMARK_VAR_DATA={expected:{success:!0},data:{one:[{items:[{val:"hello",str:"abc",num:123},{val:"hello",str:"abcd",num:155},{val:"world",str:"abc",num:123},{val:"hello",str:"abc",num:199}]}]}}})();
      const safeParse = globalThis.BENCHMARK_VAR_SCHEMA_SAFE_PARSE;
  const data = globalThis.BENCHMARK_VAR_DATA;
  const now = typeof performance !== 'undefined' ? () => performance.now() : () => Date.now();
  const start = now();
  for (let i = 0; ; ++i) {
    const ret = safeParse(data.data);

    // TODO: Remove this logic from here and implement specialized verifier for test data
    if (ret.success !== data.expected.success) {
      throw new Error('mismatch')
    }

    const elapsedTime = now() - start;
    if (elapsedTime > 100) {
       const result = {opsPerSecond: Math.floor(i / (elapsedTime / 1000))};
       if (globalThis.BENCHMARK_VAR_ON_FINISH) {
         globalThis.BENCHMARK_VAR_ON_FINISH(result);
       } else {
         console.log(JSON.stringify(result));
       }
       break
    }
  }
