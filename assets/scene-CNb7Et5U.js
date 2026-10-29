import{M as m,O as Je,B as J,F as De,S as B,U as te,V as M,W as Q,H as k,N as Ze,T as et,C as se,a as p,A as tt,b as Z,R as st,c as it,d as rt,L as at,e as ot,f as nt,g as He,h as lt,i as ut,j as ht,k as ct,l as ft,P as dt,m as pt,D as mt,n as Ue,G as Ne,o as X,p as Le,q as ze,r as gt,s as vt,E as wt,t as Y,Q as xt,u as Ie,v as Oe,w as Ge,x as Qe,y as me,z as bt,I as ke,J as Mt,K as Tt,X as _t,Y as Ct,Z as St,_ as yt,$ as Pt,a0 as Et,a1 as At}from"./three-Zl-aGNcY.js";const ee={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class U{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Rt=new Je(-1,1,1,-1,0,1);class Ft extends J{constructor(){super(),this.setAttribute("position",new De([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new De([0,2,0,0,2,0],2))}}const Bt=new Ft;class ge{constructor(e){this._mesh=new m(Bt,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Rt)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Dt extends U{constructor(e,s="tDiffuse"){super(),this.textureID=s,this.uniforms=null,this.material=null,e instanceof B?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=te.clone(e.uniforms),this.material=new B({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new ge(this.material)}render(e,s,a){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=a.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(s),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Ve extends U{constructor(e,s){super(),this.scene=e,this.camera=s,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,s,a){const n=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let u,f;this.inverse?(u=0,f=1):(u=1,f=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(n.REPLACE,n.REPLACE,n.REPLACE),r.buffers.stencil.setFunc(n.ALWAYS,u,4294967295),r.buffers.stencil.setClear(f),r.buffers.stencil.setLocked(!0),e.setRenderTarget(a),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(s),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(n.EQUAL,1,4294967295),r.buffers.stencil.setOp(n.KEEP,n.KEEP,n.KEEP),r.buffers.stencil.setLocked(!0)}}class Ut extends U{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Nt{constructor(e,s){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),s===void 0){const a=e.getSize(new M);this._width=a.width,this._height=a.height,s=new Q(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:k}),s.texture.name="EffectComposer.rt1"}else this._width=s.width,this._height=s.height;this.renderTarget1=s,this.renderTarget2=s.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Dt(ee),this.copyPass.material.blending=Ze,this.timer=new et}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,s){this.passes.splice(s,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const s=this.passes.indexOf(e);s!==-1&&this.passes.splice(s,1)}isLastEnabledPass(e){for(let s=e+1;s<this.passes.length;s++)if(this.passes[s].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());const s=this.renderer.getRenderTarget();let a=!1;for(let n=0,r=this.passes.length;n<r;n++){const u=this.passes[n];if(u.enabled!==!1){if(u.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(n),u.render(this.renderer,this.writeBuffer,this.readBuffer,e,a),u.needsSwap){if(a){const f=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(f.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(f.EQUAL,1,4294967295)}this.swapBuffers()}Ve!==void 0&&(u instanceof Ve?a=!0:u instanceof Ut&&(a=!1))}}this.renderer.setRenderTarget(s)}reset(e){if(e===void 0){const s=this.renderer.getSize(new M);this._pixelRatio=this.renderer.getPixelRatio(),this._width=s.width,this._height=s.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,s){this._width=e,this._height=s;const a=this._width*this._pixelRatio,n=this._height*this._pixelRatio;this.renderTarget1.setSize(a,n),this.renderTarget2.setSize(a,n);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(a,n)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Lt extends U{constructor(e,s,a=null,n=null,r=null){super(),this.scene=e,this.camera=s,this.overrideMaterial=a,this.clearColor=n,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new se}render(e,s,a){const n=e.autoClear;e.autoClear=!1;let r,u;this.overrideMaterial!==null&&(u=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:a),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=u),e.autoClear=n}}const zt={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new se(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class D extends U{constructor(e,s=1,a,n){super(),this.strength=s,this.radius=a,this.threshold=n,this.resolution=e!==void 0?new M(e.x,e.y):new M(256,256),this.clearColor=new se(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),u=Math.round(this.resolution.y/2);this.renderTargetBright=new Q(r,u,{type:k}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let b=0;b<this.nMips;b++){const N=new Q(r,u,{type:k});N.texture.name="UnrealBloomPass.h"+b,N.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(N);const v=new Q(r,u,{type:k});v.texture.name="UnrealBloomPass.v"+b,v.texture.generateMipmaps=!1,this.renderTargetsVertical.push(v),r=Math.round(r/2),u=Math.round(u/2)}const f=zt;this.highPassUniforms=te.clone(f.uniforms),this.highPassUniforms.luminosityThreshold.value=n,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new B({uniforms:this.highPassUniforms,vertexShader:f.vertexShader,fragmentShader:f.fragmentShader}),this.separableBlurMaterials=[];const c=[6,10,14,18,22];r=Math.round(this.resolution.x/2),u=Math.round(this.resolution.y/2);for(let b=0;b<this.nMips;b++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[b])),this.separableBlurMaterials[b].uniforms.invSize.value=new M(1/r,1/u),r=Math.round(r/2),u=Math.round(u/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=s,this.compositeMaterial.uniforms.bloomRadius.value=.1;const ie=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=ie,this.bloomTintColors=[new p(1,1,1),new p(1,1,1),new p(1,1,1),new p(1,1,1),new p(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=te.clone(ee.uniforms),this.blendMaterial=new B({uniforms:this.copyUniforms,vertexShader:ee.vertexShader,fragmentShader:ee.fragmentShader,premultipliedAlpha:!0,blending:tt,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new se,this._oldClearAlpha=1,this._basic=new Z,this._fsQuad=new ge(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,s){let a=Math.round(e/2),n=Math.round(s/2);this.renderTargetBright.setSize(a,n);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(a,n),this.renderTargetsVertical[r].setSize(a,n),this.separableBlurMaterials[r].uniforms.invSize.value=new M(1/a,1/n),a=Math.round(a/2),n=Math.round(n/2)}render(e,s,a,n,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const u=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=a.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=a.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let f=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=f.texture,this.separableBlurMaterials[c].uniforms.direction.value=D.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=D.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this._fsQuad.render(e),f=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(a),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=u}_getSeparableBlurMaterial(e){const s=[],a=e/3;for(let n=0;n<e;n++)s.push(.39894*Math.exp(-.5*n*n/(a*a))/a);return new B({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new M(.5,.5)},direction:{value:new M(.5,.5)},gaussianCoefficients:{value:s}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new B({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}}D.BlurDirectionX=new M(1,0);D.BlurDirectionY=new M(0,1);const K={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class It extends U{constructor(){super(),this.isOutputPass=!0,this.uniforms=te.clone(K.uniforms),this.material=new st({name:K.name,uniforms:this.uniforms,vertexShader:K.vertexShader,fragmentShader:K.fragmentShader}),this._fsQuad=new ge(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,s,a){this.uniforms.tDiffuse.value=a.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},it.getTransfer(this._outputColorSpace)===rt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===at?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===ot?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===nt?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===He?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===lt?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===ut?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===ht&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(s),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const _=12122062,G=7587257,$=10534125,q=15974024;async function Gt(h){const e=new ct({antialias:!0,alpha:!0,powerPreference:"low-power"});e.setPixelRatio(Math.min(devicePixelRatio,1.5)),e.setClearColor(593426,0),e.toneMapping=He,e.toneMappingExposure=1.3,e.domElement.setAttribute("aria-hidden","true"),h.prepend(e.domElement);const s=new ft,a=new dt(39,1,.1,100);a.position.set(6.3,11.5,13.2),a.lookAt(0,0,0),s.add(new pt(14742253,1.8));const n=new mt(14221296,4);n.position.set(-5,10,4),s.add(n);const r=new Ue(9093119,100,30);r.position.set(6,4,-5),s.add(r);const u=new Ue(11665355,70,30);u.position.set(-6,1,5),s.add(u);const f=new Ne;s.add(f);const c=Object.fromEntries(["grid","lake","signals","clusters"].map(t=>{const i=new Ne;return f.add(i),[t,i]})),ie=new X({color:3362126,roughness:.34,metalness:.72}),b=new X({color:1122084,roughness:.5,metalness:.6}),N=new Le({color:_,transparent:!0,opacity:.38}),v=t=>new X({color:t,emissive:t,emissiveIntensity:1.6,roughness:.25,metalness:.4});function re(t,i,o=_,l=.35){i.add(new yt(new Pt(t,25),new Le({color:o,transparent:!0,opacity:l})))}function A(t,i,o,l=G,d=.3){const w=new m(new Et(t,t+.012,120),new Z({color:l,side:At,transparent:!0,opacity:d}));return w.rotation.x=-Math.PI/2,w.position.y=i,o.add(w),w}const T=c.grid,V=new m(new ze(5.7,5.85,.24,100),b);V.position.y=-.48,T.add(V),re(V.geometry,V,G,.22),[4.95,5.4,5.95,6.2].forEach(t=>A(t,-.33,T));const ve=new gt(7.8,20,3496014,2111026);ve.position.y=-.345,T.add(ve);const we=await fetch("./philippines.geo.json");if(!we.ok)throw e.dispose(),e.domElement.remove(),new Error("Map geometry unavailable");const je=await we.json(),xe=(t,i)=>new p((t-122.4)*.78,0,-(i-12.5)*.78);for(const t of je.features[0].geometry.coordinates){const i=t[0],o=new vt(i.map(([w,x])=>new M((w-122.4)*.78,(x-12.5)*.78))),l=new wt(o,{depth:.3,bevelEnabled:!0,bevelThickness:.035,bevelSize:.035,bevelSegments:2,steps:1});l.rotateX(-Math.PI/2);const d=new m(l,ie);T.add(d),re(l,d,_,.58)}const ae=[{name:"Luzon",lon:121,lat:16.1,color:_},{name:"Visayas",lon:123.7,lat:10.7,color:q},{name:"Mindanao",lon:124.8,lat:7.8,color:$}],oe=[],H=[];ae.forEach((t,i)=>{const o=xe(t.lon,t.lat);o.y=.3;const l=new m(new ze(.035,.08,.9,12),v(t.color));l.position.copy(o).add(new p(0,.45,0)),T.add(l);const d=new m(new Y(.085,12,12),v(t.color));d.position.copy(o).add(new p(0,.94,0)),T.add(d);for(let x=0;x<3;x++){const C=A(.17+x*.19,.25,T,t.color,.75-x*.2);C.position.x=o.x,C.position.z=o.z}const w=document.createElement("div");if(w.className="map-label",w.innerHTML=`<span class="map-dot" style="background:#${t.color.toString(16)}"></span>${t.name}<small>${i===1?"PROPOSED PILOT":"PHILIPPINE GRID"}</small>`,h.append(w),H.push({element:w,anchor:o.clone().add(new p(.22,1.5,0))}),i){const x=xe(ae[i-1].lon,ae[i-1].lat).setY(.4),C=o.clone().setY(.4),qe=x.clone().lerp(C,.5).setY(2.4),Be=new xt(x,qe,C);oe.push(Be),T.add(new m(new Ie(Be,70,.014,5,!1),v(G)))}});const be=Array.from({length:12},(t,i)=>{const o=new m(new Y(.046,8,8),v(i%2?_:q));return T.add(o),o}),ne=new Float32Array(480);let le=93;const g=()=>(le=le*1664525+1013904223>>>0,le/4294967296);for(let t=0;t<ne.length;t+=3)ne.set([(g()-.5)*15,g()*6-.3,(g()-.5)*12],t);const Me=new J;Me.setAttribute("position",new Oe(ne,3)),T.add(new Ge(Me,new Qe({size:.022,color:_,transparent:!0,opacity:.65})));const S=c.lake,ue=[9414344,7849146,_];for(let t=0;t<3;t++){const i=new m(new me(5.5,.28,4.3),new X({color:ue[t],transparent:!0,opacity:.35,metalness:.55,roughness:.22}));i.position.y=(1-t)*1.9,S.add(i),re(i.geometry,i,ue[t],.7);const o=new m(new me(5.4,.12,4.2),b);o.position.y=i.position.y-.22,S.add(o);for(let l=0;l<35;l++){const d=new m(new me(.16,.14+g()*.22,.16),v(ue[t]));d.position.set((l%7-3)*.64,i.position.y+.25,(Math.floor(l/7)-2)*.64),S.add(d)}}const We=Array.from({length:34},()=>{const t=new m(new Y(.04,7,7),v(_));return t.position.set((g()-.5)*4.7,g()*6-3,(g()-.5)*3.4),S.add(t),t});for(const t of[-2.65,2.65])for(const i of[-2.05,2.05]){const o=new J().setFromPoints([new p(t,-2,i),new p(t,2,i)]);S.add(new bt(o,N))}A(4.4,-2.6,S),A(4.65,-2.6,S),S.scale.setScalar(1.2);const L=c.signals,Te=new m(new ke(3.6,.018,8,150),v(G));Te.rotation.x=Math.PI/2.8,L.add(Te);const he=new m(new ke(4,.009,8,150),new Z({color:$,transparent:!0,opacity:.45}));he.rotation.set(.7,1.1,0),L.add(he);const _e=new Float32Array(360*3);for(let t=0;t<360;t++){const i=g()*Math.PI*2,o=.4+g()*2.8;_e.set([Math.cos(i)*o,(g()-.5)*1.8+Math.cos(i)*1,Math.sin(i)*o*.7],t*3)}const Ce=new J;Ce.setAttribute("position",new Oe(_e,3)),L.add(new Ge(Ce,new Qe({color:_,size:.065,transparent:!0,opacity:.9})));for(let t=0;t<3;t++){const i=Array.from({length:100},(o,l)=>{const d=l/99*7-3.5;return new p(d,Math.sin(d*.9+t*1.2)*.9+(t-1)*.6,(t-1)*1.1)});L.add(new m(new Ie(new Mt(i),100,.022,6,!1),v([_,$,q][t])))}L.scale.setScalar(1.3);const R=c.clusters,Xe=[new p(-2.1,-.7,.8),new p(1.8,1.1,-1.1),new p(-1.4,1.7,-1.6),new p(1.9,-.8,1.6)],ce=[_,q,$,G];Xe.forEach((t,i)=>{const o=new Tt(new Y(.065,8,8),v(ce[i]),70),l=new _t;for(let x=0;x<70;x++){const C=new p(g()+g()-1,g()+g()-1,g()+g()-1).multiplyScalar(1.2).add(t);l.makeTranslation(C.x,C.y,C.z),o.setMatrixAt(x,l)}R.add(o);const d=new m(new Ct(1.35,1),new Z({color:ce[i],wireframe:!0,transparent:!0,opacity:.12}));d.position.copy(t),R.add(d);const w=new m(new St(.16),v(ce[i]));w.position.copy(t),R.add(w)}),A(4.4,-2.3,R),A(4.6,-2.3,R),R.scale.setScalar(1.2);const Ye=new Q(1,1,{type:k,samples:4}),F=new Nt(e,Ye);F.addPass(new Lt(s,a));const Ke=new D(new M(800,800),.38,.55,1.15);F.addPass(Ke),F.addPass(new It);let fe="grid",j=matchMedia("(prefers-reduced-motion: reduce)").matches,z=1,I=1,de=0,O=0,W=0,Se=!1,y=!0;const P={x:0,y:0},E={x:0,y:0};function ye(t){fe=t,Object.entries(c).forEach(([i,o])=>{o.visible=i===fe}),H.forEach(i=>i.element.hidden=fe!=="grid"),y=!0}function Pe(){z=Math.max(1,h.clientWidth),I=Math.max(1,h.clientHeight),a.aspect=z/I,a.position.set(6.3,11.5,13.2).multiplyScalar(a.aspect<.95?1.12:1),a.lookAt(0,0,0),a.updateProjectionMatrix(),e.setSize(z,I),F.setSize(z,I),y=!0}const Ee=new ResizeObserver(Pe);Ee.observe(h);function Ae(t){const i=h.getBoundingClientRect();P.x=((t.clientX-i.left)/i.width-.5)*.22,P.y=((t.clientY-i.top)/i.height-.5)*.07,y=!0}function Re(){P.x=P.y=0,y=!0}h.addEventListener("pointermove",Ae),h.addEventListener("pointerleave",Re);const pe=new p;function Fe(t){if(Se)return;if(de=requestAnimationFrame(Fe),document.hidden){W=t;return}if(t-W<32)return;const i=Math.min((t-W)/1e3,.08);W=t,!(j&&!y)&&(j||(O+=i,E.y+=(P.x-E.y)*.055,E.x+=(P.y-E.x)*.055,f.rotation.y=E.y+Math.sin(O*.12)*.045,f.rotation.x=E.x,be.forEach((o,l)=>o.position.copy(oe[l%oe.length].getPoint((O*.13+l/be.length)%1))),We.forEach((o,l)=>{o.position.y=2.7-(O*.55+l*.18)%5.4}),he.rotation.z=O*.05),s.updateMatrixWorld(),H.forEach(o=>{pe.copy(o.anchor).applyMatrix4(T.matrixWorld).project(a),o.element.style.left=`${(pe.x*.5+.5)*z}px`,o.element.style.top=`${(-pe.y*.5+.5)*I}px`}),F.render(),y=!1)}function $e(t){t.preventDefault(),h.classList.remove("scene-ready"),h.dataset.error="3D unavailable. Static illustration shown.",j=!0}return e.domElement.addEventListener("webglcontextlost",$e),ye("grid"),Pe(),h.classList.add("scene-ready"),de=requestAnimationFrame(Fe),{setMode:ye,setPaused(t){j=t,y=!0},reset(){P.x=P.y=E.x=E.y=0,f.rotation.set(0,0,0),y=!0},dispose(){Se=!0,cancelAnimationFrame(de),Ee.disconnect(),h.removeEventListener("pointermove",Ae),h.removeEventListener("pointerleave",Re);const t=new Set,i=new Set;s.traverse(o=>{const l=o;l.geometry&&t.add(l.geometry),l.material&&(Array.isArray(l.material)?l.material:[l.material]).forEach(d=>i.add(d))}),t.forEach(o=>o.dispose()),i.forEach(o=>o.dispose()),F.dispose(),e.dispose(),e.domElement.remove(),H.forEach(o=>o.element.remove())}}}export{Gt as createScene};
