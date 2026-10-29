import{M as C,O as Ka,B as We,F as oa,S as W,U as ut,V as H,W as Qe,H as He,N as ga,T as $a,C as P,a as T,A as Xe,b as ge,R as Ja,c as es,d as ts,L as os,e as as,f as ss,g as xa,h as rs,i as is,j as ns,k as aa,l as ls,m as cs,n as wa,o as ee,p as ue,q as no,P as us,I as Et,r as ba,s as hs,t as ya,u as Ut,v as xe,D as Rt,w as fs,x as ds,y as ps,z as ms,E as sa,G as X,J as vs,K as _t,Q as gs,X as xs,Y as ws,Z as ro,_ as ra,$ as ia,a0 as na,a1 as bs,a2 as ys,a3 as Ms,a4 as la,a5 as ca,a6 as Tt,a7 as ua,a8 as Cs,a9 as ha,aa as Ss,ab as _s,ac as io,ad as Ts,ae as Ps,af as Ds,ag as zt}from"./three-Bj1JRWzA.js";import{b as As}from"./index-BjX5Myrm.js";const Ft={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Pe{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Es=new Ka(-1,1,1,-1,0,1);class Us extends We{constructor(){super(),this.setAttribute("position",new oa([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new oa([0,2,0,0,2,0],2))}}const Rs=new Us;class kt{constructor(e){this._mesh=new C(Rs,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Es)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class zs extends Pe{constructor(e,r="tDiffuse"){super(),this.textureID=r,this.uniforms=null,this.material=null,e instanceof W?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=ut.clone(e.uniforms),this.material=new W({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new kt(this.material)}render(e,r,l){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=l.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(r),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class fa extends Pe{constructor(e,r){super(),this.scene=e,this.camera=r,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,r,l){const u=e.getContext(),n=e.state;n.buffers.color.setMask(!1),n.buffers.depth.setMask(!1),n.buffers.color.setLocked(!0),n.buffers.depth.setLocked(!0);let f,h;this.inverse?(f=0,h=1):(f=1,h=0),n.buffers.stencil.setTest(!0),n.buffers.stencil.setOp(u.REPLACE,u.REPLACE,u.REPLACE),n.buffers.stencil.setFunc(u.ALWAYS,f,4294967295),n.buffers.stencil.setClear(h),n.buffers.stencil.setLocked(!0),e.setRenderTarget(l),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(r),this.clear&&e.clear(),e.render(this.scene,this.camera),n.buffers.color.setLocked(!1),n.buffers.depth.setLocked(!1),n.buffers.color.setMask(!0),n.buffers.depth.setMask(!0),n.buffers.stencil.setLocked(!1),n.buffers.stencil.setFunc(u.EQUAL,1,4294967295),n.buffers.stencil.setOp(u.KEEP,u.KEEP,u.KEEP),n.buffers.stencil.setLocked(!0)}}class Fs extends Pe{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class ks{constructor(e,r){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),r===void 0){const l=e.getSize(new H);this._width=l.width,this._height=l.height,r=new Qe(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:He}),r.texture.name="EffectComposer.rt1"}else this._width=r.width,this._height=r.height;this.renderTarget1=r,this.renderTarget2=r.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new zs(Ft),this.copyPass.material.blending=ga,this.timer=new $a}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,r){this.passes.splice(r,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const r=this.passes.indexOf(e);r!==-1&&this.passes.splice(r,1)}isLastEnabledPass(e){for(let r=e+1;r<this.passes.length;r++)if(this.passes[r].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());const r=this.renderer.getRenderTarget();let l=!1;for(let u=0,n=this.passes.length;u<n;u++){const f=this.passes[u];if(f.enabled!==!1){if(f.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(u),f.render(this.renderer,this.writeBuffer,this.readBuffer,e,l),f.needsSwap){if(l){const h=this.renderer.getContext(),g=this.renderer.state.buffers.stencil;g.setFunc(h.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),g.setFunc(h.EQUAL,1,4294967295)}this.swapBuffers()}fa!==void 0&&(f instanceof fa?l=!0:f instanceof Fs&&(l=!1))}}this.renderer.setRenderTarget(r)}reset(e){if(e===void 0){const r=this.renderer.getSize(new H);this._pixelRatio=this.renderer.getPixelRatio(),this._width=r.width,this._height=r.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,r){this._width=e,this._height=r;const l=this._width*this._pixelRatio,u=this._height*this._pixelRatio;this.renderTarget1.setSize(l,u),this.renderTarget2.setSize(l,u);for(let n=0;n<this.passes.length;n++)this.passes[n].setSize(l,u)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Bs extends Pe{constructor(e,r,l=null,u=null,n=null){super(),this.scene=e,this.camera=r,this.overrideMaterial=l,this.clearColor=u,this.clearAlpha=n,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new P}render(e,r,l){const u=e.autoClear;e.autoClear=!1;let n,f;this.overrideMaterial!==null&&(f=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(n=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:l),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(n),this.overrideMaterial!==null&&(this.scene.overrideMaterial=f),e.autoClear=u}}const Os={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new P(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Ye extends Pe{constructor(e,r=1,l,u){super(),this.strength=r,this.radius=l,this.threshold=u,this.resolution=e!==void 0?new H(e.x,e.y):new H(256,256),this.clearColor=new P(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let n=Math.round(this.resolution.x/2),f=Math.round(this.resolution.y/2);this.renderTargetBright=new Qe(n,f,{type:He}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let z=0;z<this.nMips;z++){const O=new Qe(n,f,{type:He});O.texture.name="UnrealBloomPass.h"+z,O.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(O);const V=new Qe(n,f,{type:He});V.texture.name="UnrealBloomPass.v"+z,V.texture.generateMipmaps=!1,this.renderTargetsVertical.push(V),n=Math.round(n/2),f=Math.round(f/2)}const h=Os;this.highPassUniforms=ut.clone(h.uniforms),this.highPassUniforms.luminosityThreshold.value=u,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new W({uniforms:this.highPassUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader}),this.separableBlurMaterials=[];const g=[6,10,14,18,22];n=Math.round(this.resolution.x/2),f=Math.round(this.resolution.y/2);for(let z=0;z<this.nMips;z++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(g[z])),this.separableBlurMaterials[z].uniforms.invSize.value=new H(1/n,1/f),n=Math.round(n/2),f=Math.round(f/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=r,this.compositeMaterial.uniforms.bloomRadius.value=.1;const A=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=A,this.bloomTintColors=[new T(1,1,1),new T(1,1,1),new T(1,1,1),new T(1,1,1),new T(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=ut.clone(Ft.uniforms),this.blendMaterial=new W({uniforms:this.copyUniforms,vertexShader:Ft.vertexShader,fragmentShader:Ft.fragmentShader,premultipliedAlpha:!0,blending:Xe,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new P,this._oldClearAlpha=1,this._basic=new ge,this._fsQuad=new kt(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,r){let l=Math.round(e/2),u=Math.round(r/2);this.renderTargetBright.setSize(l,u);for(let n=0;n<this.nMips;n++)this.renderTargetsHorizontal[n].setSize(l,u),this.renderTargetsVertical[n].setSize(l,u),this.separableBlurMaterials[n].uniforms.invSize.value=new H(1/l,1/u),l=Math.round(l/2),u=Math.round(u/2)}render(e,r,l,u,n){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const f=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),n&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=l.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=l.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let h=this.renderTargetBright;for(let g=0;g<this.nMips;g++)this._fsQuad.material=this.separableBlurMaterials[g],this.separableBlurMaterials[g].uniforms.colorTexture.value=h.texture,this.separableBlurMaterials[g].uniforms.direction.value=Ye.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[g]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[g].uniforms.colorTexture.value=this.renderTargetsHorizontal[g].texture,this.separableBlurMaterials[g].uniforms.direction.value=Ye.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[g]),e.clear(),this._fsQuad.render(e),h=this.renderTargetsVertical[g];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,n&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(l),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=f}_getSeparableBlurMaterial(e){const r=[],l=e/3;for(let u=0;u<e;u++)r.push(.39894*Math.exp(-.5*u*u/(l*l))/l);return new W({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new H(.5,.5)},direction:{value:new H(.5,.5)},gaussianCoefficients:{value:r}},vertexShader:`

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

				}`})}_getCompositeMaterial(e){return new W({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

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

				}`})}}Ye.BlurDirectionX=new H(1,0);Ye.BlurDirectionY=new H(0,1);const Pt={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class Ns extends Pe{constructor(){super(),this.isOutputPass=!0,this.uniforms=ut.clone(Pt.uniforms),this.material=new Ja({name:Pt.name,uniforms:this.uniforms,vertexShader:Pt.vertexShader,fragmentShader:Pt.fragmentShader}),this._fsQuad=new kt(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,r,l){this.uniforms.tDiffuse.value=l.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},es.getTransfer(this._outputColorSpace)===ts&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===os?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===as?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===ss?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===xa?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===rs?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===is?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===ns&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(r),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const Dt={defines:{DEPTH_PACKING:1,PERSPECTIVE_CAMERA:1},uniforms:{tColor:{value:null},tDepth:{value:null},focus:{value:1},aspect:{value:1},aperture:{value:.025},maxblur:{value:.01},nearClip:{value:1},farClip:{value:1e3}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		#include <common>

		varying vec2 vUv;

		uniform sampler2D tColor;
		uniform sampler2D tDepth;

		uniform float maxblur; // max blur amount
		uniform float aperture; // aperture - bigger values for shallower depth of field

		uniform float nearClip;
		uniform float farClip;

		uniform float focus;
		uniform float aspect;

		#include <packing>

		float getDepth( const in vec2 screenPosition ) {
			#if DEPTH_PACKING == 1
			return unpackRGBAToDepth( texture2D( tDepth, screenPosition ) );
			#else
			return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		float getViewZ( const in float depth ) {
			#if PERSPECTIVE_CAMERA == 1
			return perspectiveDepthToViewZ( depth, nearClip, farClip );
			#else
			return orthographicDepthToViewZ( depth, nearClip, farClip );
			#endif
		}


		void main() {

			vec2 aspectcorrect = vec2( 1.0, aspect );

			float viewZ = getViewZ( getDepth( vUv ) );

			float factor = ( focus + viewZ ); // viewZ is <= 0, so this is a difference equation

			vec2 dofblur = vec2 ( clamp( factor * aperture, -maxblur, maxblur ) );

			vec2 dofblur9 = dofblur * 0.9;
			vec2 dofblur7 = dofblur * 0.7;
			vec2 dofblur4 = dofblur * 0.4;

			vec4 col = vec4( 0.0 );

			col += texture2D( tColor, vUv.xy );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur );

			col += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur9 );

			col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur7 );

			col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.4,   0.0  ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur4 );

			gl_FragColor = col / 41.0;
			gl_FragColor.a = 1.0;

		}`};class Is extends Pe{constructor(e,r,l){super(),this.scene=e,this.camera=r;const u=l.focus!==void 0?l.focus:1,n=l.aperture!==void 0?l.aperture:.025,f=l.maxblur!==void 0?l.maxblur:1;this._renderTargetDepth=new Qe(1,1,{minFilter:aa,magFilter:aa,type:He}),this._renderTargetDepth.texture.name="BokehPass.depth",this._materialDepth=new ls,this._materialDepth.depthPacking=cs,this._materialDepth.blending=ga;const h=ut.clone(Dt.uniforms);h.tDepth.value=this._renderTargetDepth.texture,h.focus.value=u,h.aspect.value=r.aspect,h.aperture.value=n,h.maxblur.value=f,h.nearClip.value=r.near,h.farClip.value=r.far,this.materialBokeh=new W({defines:Object.assign({},Dt.defines),uniforms:h,vertexShader:Dt.vertexShader,fragmentShader:Dt.fragmentShader}),this.uniforms=h,this._fsQuad=new kt(this.materialBokeh),this._oldClearColor=new P}render(e,r,l){this.scene.overrideMaterial=this._materialDepth,e.getClearColor(this._oldClearColor);const u=e.getClearAlpha(),n=e.autoClear;e.autoClear=!1,e.setClearColor(16777215),e.setClearAlpha(1),e.setRenderTarget(this._renderTargetDepth),e.clear(),e.render(this.scene,this.camera),this.uniforms.tColor.value=l.texture,this.uniforms.nearClip.value=this.camera.near,this.uniforms.farClip.value=this.camera.far,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(r),e.clear(),this._fsQuad.render(e)),this.scene.overrideMaterial=null,e.setClearColor(this._oldClearColor),e.setClearAlpha(u),e.autoClear=n}setSize(e,r){this.materialBokeh.uniforms.aspect.value=e/r,this._renderTargetDepth.setSize(e,r)}dispose(){this._renderTargetDepth.dispose(),this._materialDepth.dispose(),this.materialBokeh.dispose(),this._fsQuad.dispose()}}class Ls extends wa{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;const e=new ee;e.deleteAttribute("uv");const r=new ue({side:no}),l=new ue,u=new us(16777215,900,28,2);u.position.set(.418,16.199,.3),this.add(u);const n=new C(e,r);n.position.set(-.757,13.219,.717),n.scale.set(31.713,28.305,28.591),this.add(n);const f=new Et(e,l,6),h=new ba;h.position.set(-10.906,2.009,1.846),h.rotation.set(0,-.195,0),h.scale.set(2.328,7.905,4.651),h.updateMatrix(),f.setMatrixAt(0,h.matrix),h.position.set(-5.607,-.754,-.758),h.rotation.set(0,.994,0),h.scale.set(1.97,1.534,3.955),h.updateMatrix(),f.setMatrixAt(1,h.matrix),h.position.set(6.167,.857,7.803),h.rotation.set(0,.561,0),h.scale.set(3.927,6.285,3.687),h.updateMatrix(),f.setMatrixAt(2,h.matrix),h.position.set(-2.017,.018,6.124),h.rotation.set(0,.333,0),h.scale.set(2.002,4.566,2.064),h.updateMatrix(),f.setMatrixAt(3,h.matrix),h.position.set(2.291,-.756,-2.621),h.rotation.set(0,-.286,0),h.scale.set(1.546,1.552,1.496),h.updateMatrix(),f.setMatrixAt(4,h.matrix),h.position.set(-2.193,-.369,-5.547),h.rotation.set(0,.516,0),h.scale.set(3.875,3.487,2.986),h.updateMatrix(),f.setMatrixAt(5,h.matrix),this.add(f);const g=new C(e,Ge(50));g.position.set(-16.116,14.37,8.208),g.scale.set(.1,2.428,2.739),this.add(g);const A=new C(e,Ge(50));A.position.set(-16.109,18.021,-8.207),A.scale.set(.1,2.425,2.751),this.add(A);const z=new C(e,Ge(17));z.position.set(14.904,12.198,-1.832),z.scale.set(.15,4.265,6.331),this.add(z);const O=new C(e,Ge(43));O.position.set(-.462,8.89,14.52),O.scale.set(4.38,5.441,.088),this.add(O);const V=new C(e,Ge(20));V.position.set(3.235,11.486,-12.541),V.scale.set(2.5,2,.1),this.add(V);const q=new C(e,Ge(100));q.position.set(0,20,0),q.scale.set(1,.1,1),this.add(q)}dispose(){const e=new Set;this.traverse(r=>{r.isMesh&&(e.add(r.geometry),e.add(r.material))});for(const r of e)r.dispose()}}function Ge(d){return new hs({color:0,emissive:16777215,emissiveIntensity:d})}const Gs=`
attribute vec3 aFrom;
attribute vec3 aColorFrom;
attribute vec3 aColor;
attribute float aSeed;
uniform float uProgress, uTime, uSize, uScale, uLift, uTurbulence, uFog;
uniform vec3 uTrail;
varying vec3 vColor;
varying float vFade;
vec3 swirl(vec3 p) { return vec3(sin(p.y * 1.7 + p.z * 0.9 + uTime * 0.6), sin(p.z * 1.3 + p.x * 1.1 - uTime * 0.5), sin(p.x * 1.5 + p.y * 0.7 + uTime * 0.4)); }
void main() {
  // Each particle leaves on its own beat (aSeed), arcs over the world, and swirls hardest mid-flight.
  float d = clamp((uProgress - aSeed * 0.4) / 0.6, 0.0, 1.0);
  float e = d * d * (3.0 - 2.0 * d);
  vec3 mid = mix(aFrom, position, 0.5) + vec3(0.0, uLift * (0.6 + aSeed * 0.8), 0.0);
  vec3 p = mix(mix(aFrom, mid, e), mix(mid, position, e), e);
  float travel = sin(e * 3.14159265);
  p += (swirl(p * 0.18) + 0.5 * swirl(p * 0.5 + 3.0)) * travel * uTurbulence;
  p += vec3(sin(uTime * 0.7 + aSeed * 40.0), cos(uTime * 0.6 + aSeed * 31.0), sin(uTime * 0.5 + aSeed * 17.0)) * 0.02;
  // Shapes with black colors are invisible at rest; uTrail lights every particle only while it is travelling.
  vColor = mix(aColorFrom, aColor, e) * (1.0 + travel * 1.4) + uTrail * travel * (0.4 + aSeed);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float depth = max(-mv.z, 0.1);
  vFade = exp(-uFog * uFog * depth * depth);
  gl_PointSize = uSize * uScale * (0.55 + aSeed * 0.9) * (1.0 + travel * 0.9) / depth;
  gl_Position = projectionMatrix * mv;
}`,Vs=`
uniform float uOpacity;
varying vec3 vColor;
varying float vFade;
void main() {
  float a = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5));
  gl_FragColor = vec4(vColor * a * a * vFade * uOpacity, 1.0);
}`;function js(d,e){const r=new We,l=x=>new Ut(new Float32Array(d*x),x),u=l(3),n=l(3),f=l(3),h=l(3),g=l(1);for(let x=0;x<d;x++)g.setX(x,e());r.setAttribute("position",u),r.setAttribute("aColor",n),r.setAttribute("aFrom",f),r.setAttribute("aColorFrom",h),r.setAttribute("aSeed",g);const A={uProgress:{value:1},uTime:{value:0},uSize:{value:.07},uScale:{value:400},uLift:{value:0},uTurbulence:{value:0},uFog:{value:.03},uOpacity:{value:1},uTrail:{value:new P(0,0,0)}},z=new W({uniforms:A,vertexShader:Gs,fragmentShader:Vs,transparent:!0,depthWrite:!1,blending:Xe}),O=new ya(r,z);O.frustumCulled=!1;let V=1,q=null,De=!1;function S(x,we,he,w,Ae){if(x===q)return;const Bt=A.uProgress.value,ht=A.uLift.value;if(q)for(let L=0;L<d;L++){const Ze=g.getX(L),qe=Math.min(1,Math.max(0,(Bt-Ze*.4)/.6)),be=qe*qe*(3-2*qe),F=1-be,ft=ht*(.6+Ze*.8);for(let k=0;k<3;k++){const K=f.array[L*3+k],fe=u.array[L*3+k],j=(K+fe)/2+(k===1?ft:0);f.array[L*3+k]=F*F*K+2*F*be*j+be*be*fe,h.array[L*3+k]=h.array[L*3+k]*F+n.array[L*3+k]*be}}else De||(f.array.set(x.position),h.array.set(x.color));u.array.set(x.position),n.array.set(x.color);for(const L of[u,n,f,h])L.needsUpdate=!0;q=x,V=Math.max(.1,we),A.uLift.value=he,A.uTurbulence.value=w,A.uProgress.value=Ae?1:0}return{object:O,morph:S,trail:A.uTrail.value,scatter(x){f.array.set(x.position),h.array.set(x.color),f.needsUpdate=h.needsUpdate=!0,De=!0},update(x,we,he,w){A.uProgress.value=Math.min(1,A.uProgress.value+x/V),A.uTime.value=we,A.uFog.value=he,A.uScale.value=w},settle(){A.uProgress.value=1},setVisible(x){r.setDrawRange(0,x)},dispose(){r.dispose(),z.dispose()}}}const Ws=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;function Qs(d,e,r,l){const u={uBase:{value:new P(r)},uLine:{value:new P(l)},uFog:{value:.03},uCamera:{value:new T}},n=new W({uniforms:u,vertexShader:`
      varying vec3 vWorld;
      void main() { vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`
      uniform vec3 uBase, uLine, uCamera; uniform float uFog;
      varying vec3 vWorld;
      float grid(vec2 p, float step) { vec2 q = p / step; vec2 g = abs(fract(q - 0.5) - 0.5) / fwidth(q); return 1.0 - min(min(g.x, g.y), 1.0); }
      void main() {
        float r = length(vWorld.xz);
        float lines = (grid(vWorld.xz, 2.0) * 0.5 + grid(vWorld.xz, 10.0) * 0.5) * (1.0 - smoothstep(60.0, 160.0, r));
        float d = distance(uCamera, vWorld);
        float fog = 1.0 - exp(-uFog * uFog * d * d);
        gl_FragColor = vec4(uBase + uLine * lines * (1.0 - fog), 1.0);
      }`}),f=new C(new xe(d,256,128),n);return f.position.y=e-d,{mesh:f,uniforms:u}}function Hs(d,e){const r=new W({side:no,depthWrite:!1,depthTest:!1,uniforms:{uColor:{value:new P(e)}},vertexShader:"void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:"uniform vec3 uColor; void main() { gl_FragColor = vec4(uColor, 1.0); }"}),l=new C(new xe(d,16,8),r);return l.frustumCulled=!1,l.renderOrder=-10,l}function Ys(d,e,r){const l={uColor:{value:new P(r)},uStrength:{value:0}},u=new W({uniforms:l,side:no,transparent:!0,depthWrite:!1,blending:Xe,vertexShader:`
      varying vec3 vNormal; varying vec3 vRay;
      void main() { vec4 mv = modelViewMatrix * vec4(position, 1.0); vNormal = normalize(normalMatrix * normal); vRay = normalize(mv.xyz); gl_Position = projectionMatrix * mv; }`,fragmentShader:`
      uniform vec3 uColor; uniform float uStrength;
      varying vec3 vNormal; varying vec3 vRay;
      void main() { float rim = pow(clamp(dot(normalize(vNormal), normalize(vRay)), 0.0, 1.0), 3.0); gl_FragColor = vec4(uColor * rim * uStrength, 1.0); }`}),n=new C(new xe(d*1.035,128,64),u);return n.position.y=e-d,{mesh:n,uniforms:l}}function da(d,e,r,l=.35){return new W({transparent:!0,depthWrite:!1,blending:Xe,uniforms:{uColor:{value:new P(d)},uTime:{value:0},uOpacity:{value:1},uDashes:{value:e},uSpeed:{value:r},uBase:{value:l}},vertexShader:Ws,fragmentShader:`
      uniform vec3 uColor; uniform float uTime, uOpacity, uDashes, uSpeed, uBase;
      varying vec2 vUv;
      void main() {
        float pulse = pow(fract(vUv.x * uDashes - uTime * uSpeed), 8.0);
        gl_FragColor = vec4(uColor * (uBase + pulse * 3.0) * uOpacity, 1.0);
      }`})}function Xs(d){return new W({transparent:!0,depthWrite:!1,blending:Xe,side:Rt,uniforms:{uColor:{value:new P(d)},uTime:{value:0},uOpacity:{value:1}},vertexShader:`
      varying vec3 vNormal; varying vec3 vView; varying float vHeight;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal); vView = -mv.xyz; vHeight = position.y;
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      uniform vec3 uColor; uniform float uTime, uOpacity;
      varying vec3 vNormal; varying vec3 vView; varying float vHeight;
      void main() {
        float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 2.4);
        float scan = smoothstep(0.94, 1.0, 0.5 + 0.5 * sin(vHeight * 9.0 - uTime * 2.2));
        gl_FragColor = vec4(uColor * (fresnel * 1.3 + scan * 0.3 + 0.02) * uOpacity, 1.0);
      }`})}function Zs(d,e,r){d.onBeforeCompile=l=>{l.uniforms.uReveal=e,l.uniforms.uSeam=r,l.vertexShader=`varying float vRevealY;
`+l.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>
      vec4 revealPosition = vec4(transformed, 1.0);
      #ifdef USE_INSTANCING
        revealPosition = instanceMatrix * revealPosition;
      #endif
      vRevealY = (modelMatrix * revealPosition).y;`),l.fragmentShader=`uniform float uReveal;
uniform vec3 uSeam;
varying float vRevealY;
`+l.fragmentShader.replace("#include <dithering_fragment>",`#include <dithering_fragment>
      float revealDepth = uReveal - vRevealY;
      if (revealDepth < 0.0) discard;
      gl_FragColor.rgb += uSeam * smoothstep(0.3, 0.0, revealDepth) * 2.5;`)},d.customProgramCacheKey=()=>"reveal"}const y=12122062,N=7587257,_e=10534125,U=15974024,Ve=16743014,pa=9414344,ve={orbit:{station:"map",cam:[7.2,11,14.6],look:[.2,0,.4],orbit:.05},flow:{station:"map",cam:[6.5,7,10],look:[.4,.2,.6]},alerts:{station:"map",cam:[5.4,4.6,7.4],look:[1,.7,1.3]},balance:{station:"map",cam:[8.2,4.6,7.2],look:[3.4,2.2,.9]},outlook:{station:"map",cam:[5,6.6,8.6],look:[1,0,1.3]},shield:{station:"map",cam:[10.5,8.5,13.5],look:[0,1.4,0]},finale:{station:"map",cam:[0,46,96],look:[0,-2,-10],orbit:.02,fog:.004},blocks:{station:"blocks",cam:[5.4,3.2,9.5],look:[-.6,.1,0]},scatter:{station:"signals",cam:[0,1.4,11],look:[0,.2,0]},braid:{station:"signals",cam:[3.2,1.3,10.5],look:[2,0,0]},sources:{station:"sources",cam:[0,5.4,10.5],look:[0,-.4,-.8]},layers:{station:"layers",cam:[6.5,3,9.5],look:[0,0,0]},schema:{station:"schema",cam:[0,3.6,11.2],look:[0,.3,0]},tunnel:{station:"tunnel",cam:[-3.4,2.6,7.6],look:[.4,0,0]},waves:{station:"analysis",cam:[0,.6,9.5],look:[0,0,0]},pca:{station:"analysis",cam:[3.6,2.6,8.6],look:[0,0,0]},clusters:{station:"analysis",cam:[-2.6,3,9],look:[0,0,0]}},At=44,ma={blocks:150,signals:210,sources:260,layers:310,schema:0,tunnel:50,analysis:100},va=["flow","alerts","balance","outlook","shield","finale","blocks","signals","braid","sources","layers","schema","tunnel","waves","cloud","flat","cluster"],qs={blocks:.45,alerts:.55,flat:.5,cluster:.55};function Ks(d){const e=d==="finale",r=(...l)=>+(e||l.includes(d));return{flow:+(d==="flow"),alerts:+(d==="alerts"),balance:+(d==="balance"),outlook:+(d==="outlook"),shield:+(d==="shield"),finale:+e,blocks:r("blocks"),signals:r("scatter","braid"),braid:r("braid"),sources:r("sources"),layers:r("layers"),schema:r("schema"),tunnel:r("tunnel"),waves:+(d==="waves"),cloud:r("pca","clusters"),flat:r("pca","clusters"),cluster:r("clusters")}}const Z=d=>1-(1-d)**3,je=d=>d<.5?4*d**3:1-(-2*d+2)**3/2,Te=(d,e,r=.35)=>zt.clamp((d-e*(1-r))/r,0,1);function $s(d,e=2){let r=d[0][0]===d.at(-1)[0]&&d[0][1]===d.at(-1)[1]?d.slice(0,-1):d;for(let l=0;l<e;l++)r=r.flatMap((u,n)=>{const f=r[(n+1)%r.length];return[[u[0]*.75+f[0]*.25,u[1]*.75+f[1]*.25],[u[0]*.25+f[0]*.75,u[1]*.25+f[1]*.75]]});return r}function Js(d,e,r){let l=!1;for(let u=0,n=r.length-1;u<r.length;n=u++){const[f,h]=r[u],[g,A]=r[n];h>e!=A>e&&d<(g-f)*(e-h)/(A-h)+f&&(l=!l)}return l}async function or(d,e){const r=await fetch("./philippines.geo.json");if(!r.ok)throw new Error("Map geometry unavailable");const l=await r.json();let u=new URLSearchParams(location.search).get("quality")==="low";const n=new fs({antialias:!0,alpha:!0,powerPreference:"high-performance"});n.setPixelRatio(u?1:Math.min(devicePixelRatio,1.5)),n.setClearColor(0,0),n.toneMapping=xa,n.toneMappingExposure=1.25,n.domElement.setAttribute("aria-hidden","true"),d.prepend(n.domElement);const f=new wa,h=new ds(1317148,.03);f.fog=h;const g=new ps(40,1,.1,1500);f.add(new ms(14087658,660497,1.3));const A=new sa(14876660,3.2);A.position.set(-20,30,14),f.add(A);const z=new sa(9093119,1.6);z.position.set(18,8,-20),f.add(z);const O=new X;f.add(O);const V=new vs(n),q=V.fromScene(new Ls,.04).texture;f.environment=q,f.environmentIntensity=.32,V.dispose();let De=93;const S=()=>(De=De*1664525+1013904223>>>0,De/4294967296),x=()=>Math.sqrt(-2*Math.log(S()+1e-9))*Math.cos(2*Math.PI*S()),we=new ca,he=new Ms,w=new T,Ae=new T,Bt=new T(0,1,0);function ht(t){const o=document.createElement("canvas");o.width=o.height=128;const a=o.getContext("2d"),i=a.createRadialGradient(64,64,0,64,64,64);t.forEach(([m,M])=>i.addColorStop(m,M)),a.fillStyle=i,a.fillRect(0,0,128,128);const c=new Ss(o);return c.colorSpace=_s,c}const L=ht([[0,"rgba(255,255,255,1)"],[.3,"rgba(255,255,255,.6)"],[1,"rgba(255,255,255,0)"]]),Ze=ht([[0,"rgba(255,140,105,.95)"],[.35,"rgba(243,190,136,.45)"],[1,"rgba(243,190,136,0)"]]),qe=new ue({color:2901318,roughness:.35,metalness:.75}),be=new ue({color:990240,roughness:.5,metalness:.6}),F=(t,o=1)=>new ge({color:t,transparent:o<1,opacity:o,toneMapped:!1}),ft=(t,o=.16)=>new Ds({color:t,transparent:!0,opacity:o,metalness:.2,roughness:.3,clearcoat:.5,clearcoatRoughness:.35,envMapIntensity:.6,depthWrite:!1}),k=t=>(t.blending=Xe,t.depthWrite=!1,t.transparent=!0,t);function K(t,o=y,a=.5){return t.add(new ua(new Ps(t.geometry,25),new Tt({color:o,transparent:!0,opacity:a}))),t}function fe(t,o,a,i=N,c=.3,m=.014){const M=new C(new na(t,t+m,128),new ge({color:i,side:Rt,transparent:!0,opacity:c,depthWrite:!1}));return M.rotation.x=-Math.PI/2,M.position.y=o,a.add(M),M}function j(t,o,a){const i=new We,c=new Ut(new Float32Array(t*3),3).setUsage(io),m=new Ut(new Float32Array(t*3),3).setUsage(io);i.setAttribute("position",c),i.setAttribute("color",m);const M=k(new Ts({size:o,map:L,vertexColors:!0,toneMapped:!1})),R=new ya(i,M);return R.frustumCulled=!1,a.add(R),{object:R,position:c,color:m,material:M,paint:(J,ce,s=1)=>{const p=new P(ce).multiplyScalar(s);m.setXYZ(J,p.r,p.g,p.b)}}}function lo(t,o,a,i){const c=new We,m=new Ut(new Float32Array(t*3),3).setUsage(io);c.setAttribute("position",m);const M=k(new Tt({color:o,opacity:a,toneMapped:!1})),R=new ha(c,M);return R.frustumCulled=!1,i.add(R),{object:R,position:m,material:M,base:a}}const Ot=[];function de(t,o,a,i,c,m){const M=document.createElement("div");M.className="scene-label",M.innerHTML=`${m===void 0?"":`<i style="background:#${m.toString(16).padStart(6,"0")}"></i>`}${t}${o?`<small>${o}</small>`:""}`,d.append(M),Ot.push({element:M,anchor:a,offset:new T(...i),shots:c})}const I={map:new X};O.add(I.map);for(const[t,o]of Object.entries(ma)){const a=o*Math.PI/180,i=new X;i.position.set(Math.cos(a)*At,0,Math.sin(a)*At),i.rotation.y=Math.atan2(Math.cos(a),Math.sin(a)),O.add(i),I[t]=i,fe(5.2,-2.3,i,N,.22),fe(5.55,-2.3,i,N,.1)}const Nt=Qs(600,-2.45,1317148,1916214),co=Ys(600,-2.45,5231024),uo=Hs(1200,1317148);O.add(Nt.mesh,co.mesh),f.add(uo);const It=j(1800,.09,O);It.material.opacity=.55;for(let t=0;t<1800;t++)It.position.setXYZ(t,(S()-.5)*190,-2+S()*26,(S()-.5)*190),It.paint(t,S()>.8?U:y,.4+S()*.5);const B=I.map,ho=K(new C(new _t(6,6.15,.24,96),be),N,.2);ho.position.y=-.36,B.add(ho),[6.35,6.75,7.2].forEach((t,o)=>fe(t,-.24,B,N,.3-o*.08));const fo=new gs(8.4,24,3496014,1913904);fo.position.y=-.235,B.add(fo);const po=(t,o)=>[(t-122.4)*.78,(o-12.5)*.78],mo=[];for(const t of l.features[0].geometry.coordinates){const o=$s(t[0].map(([i,c])=>po(i,c)));mo.push(o);const a=new xs(new ws(o.map(([i,c])=>new H(i,c))),{depth:.16,bevelEnabled:!0,bevelThickness:.03,bevelSize:.03,bevelSegments:2});a.rotateX(-Math.PI/2),B.add(K(new C(a,qe),y,.55))}const vo=j(650,.075,B);for(let t=0,o=0;t<650&&o<4e4;o++){const a=-4.1+S()*7.4,i=-5.45+S()*10.2;mo.some(c=>Js(a,i,c))&&(vo.position.setXYZ(t,a,.21,-i),vo.paint(t,S()>.85?U:y,.35+S()*.6),t++)}const go=[{name:"Luzon",sub:"Grid",lon:121,lat:16.1,color:y},{name:"Visayas",sub:"Proposed pilot",lon:123.7,lat:10.7,color:U},{name:"Mindanao",sub:"Grid",lon:124.8,lat:7.8,color:_e}],dt=go.map(t=>{const[o,a]=po(t.lon,t.lat);return new T(o,.2,-a)});go.forEach((t,o)=>{const a=dt[o],i=new C(new _t(.03,.07,.9,12),F(t.color));i.position.set(a.x,.65,a.z),B.add(i);const c=new C(new xe(.08,16,16),F(t.color));c.position.set(a.x,1.12,a.z),B.add(c);for(let m=0;m<3;m++){const M=fe(.16+m*.18,.23,B,t.color,.7-m*.2,.012);M.position.x=a.x,M.position.z=a.z}de(t.name,t.sub,B,[a.x+.15,1.5,a.z],["orbit","flow","outlook"],t.color)});const pe=dt[1],xo=[[0,1],[1,2]].map(([t,o])=>{const a=dt[t].clone().setY(.35),i=dt[o].clone().setY(.35);return new ro(a,a.clone().lerp(i,.5).setY(2.2),i)}),wo=da(N,3,.45);xo.forEach(t=>B.add(new C(new ra(t,64,.02,6),wo)));const Lt=j(24,.24,B);for(let t=0;t<24;t++)Lt.paint(t,t%2?y:U,1.2);const pt=new Set;for(;pt.size<30;)pt.add(Math.floor(S()*123));const Ee=new Et(new ee(.05,1,.05),F(16777215),123);Ee.frustumCulled=!1,B.add(Ee);const bo=Array.from({length:123},(t,o)=>{const a=.32+1.45*Math.sqrt(o/123),i=o*2.39996;return{x:pe.x+Math.cos(i)*a,z:pe.z+Math.sin(i)*a,h:pt.has(o)?.9+S()*.8:.3+S()*.6,delay:o/123}});bo.forEach((t,o)=>Ee.setColorAt(o,new P(pt.has(o)?Ve:U)));const ye=1/850,Ke=2545,yo=Ke*.04,Ma=150,te=new X;te.position.set(3,-.24,.9),B.add(te);const $e=(t,o,a)=>{const i=new C(new _t(t,t,1,40),o);return i.position.x=a,te.add(i),i},Je=(t,o,a)=>{t.scale.y=Math.max(a,1e-4),t.position.y=o+a/2};Je(K($e(.3,ft(U,.22),.8),U,.6),0,Ke*ye),Je($e(.3,F(Ve,.85),.8),Ke*ye,yo*ye),Je($e(.3,F(U,.6),.8),(Ke+yo)*ye,Ma*ye);const Ca=$e(.3,new ue({color:1915443,emissive:y,emissiveIntensity:.55,roughness:.3,metalness:.4}),0),Mo=$e(.31,F(Ve,.45),0),Co=F(y),So=new C(new _t(.34,.34,.03,40),Co);te.add(So);const _o=F(y,.9),To=new C(new ee(1.3,.014,.014),_o);te.add(To),de("Supply",null,te,[0,3.35,0],["balance"],y),de("Demand + reserves",null,te,[.95,3.6,0],["balance"],U);let mt=2468;function Po(){const t=mt*ye,o=Math.max(0,Ke-mt)*ye,a=As(mt).state;Je(Ca,0,t),So.position.y=t,To.position.set(.4,t,0),Mo.visible=o>5e-4,Je(Mo,t,o);const i=a==="Red alert"?Ve:a==="Yellow alert"?U:y;Co.color.set(i),_o.color.set(i)}Po();const Ue=new C(new ia(4.4,4.4),k(new ge({map:Ze,opacity:0})));Ue.rotation.x=-Math.PI/2,Ue.position.set(pe.x,.27,pe.z),B.add(Ue);const Re=new C(new na(.15,2.1,48,1,0,.7),k(new ge({color:y,opacity:0,side:Rt})));Re.rotation.x=-Math.PI/2,Re.position.set(pe.x,.29,pe.z),B.add(Re);const Sa=[.8,1.4,2].map(t=>{const o=fe(t,.28,B,U,0,.016);return o.position.x=pe.x,o.position.z=pe.z,o}),_a=new xe(6.8,36,14,0,Math.PI*2,0,Math.PI/2),ze=new X;ze.position.y=-.24,B.add(ze);const Gt=Xs(y);Gt.uniforms.uOpacity.value=.4,ze.add(new C(_a,k(new ge({color:y,wireframe:!0,opacity:.08}))),new C(new xe(6.8,64,32,0,Math.PI*2,0,Math.PI/2),Gt));const Vt=Object.values(ma).map(t=>{const o=t*Math.PI/180,a=new T(Math.cos(o)*At,-1.6,Math.sin(o)*At);return new ro(new T(0,.4,0),new T(a.x*.5,9,a.z*.5),a)}),jt=da(y,2,.35,.3),et=new X;B.add(et),Vt.forEach(t=>et.add(new C(new ra(t,80,.07,6),jt)));const vt=j(28,1.1,et);for(let t=0;t<28;t++)vt.paint(t,t%3?y:U,1.2);const Do=12**3,Wt=.34,Qt=new X;I.blocks.add(Qt);const Fe=new Et(new ee(.26,.26,.26),new ue({color:11124151,roughness:.5,metalness:.35,emissive:728602}),Do);Fe.frustumCulled=!1,Qt.add(Fe);const Ta=Array.from({length:Do},(t,o)=>{const a=o%12,i=Math.floor(o/12)%12,c=Math.floor(o/144),m=c/11;return Fe.setColorAt(o,S()>.97?new P(U):m<.5?new P(_e).lerp(new P(N),m*2):new P(N).lerp(new P(y),(m-.5)*2)),{x:(a-5.5)*Wt,y:c*Wt-1.9,z:(i-5.5)*Wt,delay:m*.8+S()*.2}}),Ht=I.signals,Ao=[y,U,_e],ke=220,Be=j(ke*3,.13,Ht),Eo=Ao.map(t=>lo(120,t,.32,Ht)),Uo=Array.from({length:ke*3},(t,o)=>({t:o%ke/ke+S()*.004,jitter:[x()*.07,x()*.07,x()*.07]}));Uo.forEach((t,o)=>Be.paint(o,Ao[Math.floor(o/ke)],1));const tt=new X;tt.position.set(4.3,0,0),Ht.add(tt),tt.add(new C(new xe(.16,24,24),F(y)),new bs(k(new ys({map:L,color:y,opacity:.8})))),tt.children[1].scale.setScalar(1.6);const Pa=[[-4.6,2.2,-1.5],[4.2,-1.8,-.8],[-1.2,-2.4,1.6]],Da=[[1.4,-.6,1.3],[-2.4,2,.4],[3.4,1.9,-1.4]];function Ro(t,o,a,i){const c=Pa[t],m=Da[t],M=o*12+t*2.094+E*.8,R=1-.88*o,le=c[0]+(m[0]-c[0])*o+Math.sin(o*7+t*2+E*.6)*.45,J=c[1]+(m[1]-c[1])*o+Math.cos(o*5+t+E*.5)*.45,ce=c[2]+(m[2]-c[2])*o+Math.sin(o*6+t*3)*.4;return i.set(le+(-2.6+o*6.9-le)*a,J+(R*Math.cos(M)-J)*a,ce+(R*Math.sin(M)-ce)*a)}const ot=I.sources,Yt=[{name:"NGCP",color:y,x:-3.1,z:-.8,h:3.2},{name:"IEMOP",color:U,x:-1.2,z:-2.7,h:3.6},{name:"DOE",color:_e,x:1.2,z:-2.7,h:2.6},{name:"PAGASA",color:N,x:3.1,z:-.8,h:3}],Me=new X;Me.position.set(0,-.9,.3),ot.add(Me);const Xt=new Et(new ee(.02,.012,.12),F(16777215),288);for(let t=0;t<288;t++){const o=t/288*Math.PI*2,a=t%12===0;he.setFromEuler(new la(0,Math.PI/2-o,0)),Xt.setMatrixAt(t,we.compose(w.set(Math.cos(o)*1.75,0,Math.sin(o)*1.75),he,Ae.set(1,1,a?2:1))),Xt.setColorAt(t,new P(a?y:N).multiplyScalar(a?1:.55))}Me.add(Xt);const zo=new ee(.025,.02,1.6);zo.translate(0,0,.8);const Fo=new C(zo,F(y));Me.add(Fo,new C(new xe(.16,20,20),F(y)));const ko=Yt.map(t=>{const o=K(new C(new ee(.5,1,.5),new ue({color:1846318,emissive:t.color,emissiveIntensity:.14,roughness:.35,metalness:.6})),t.color,.8);o.position.set(t.x,0,t.z),ot.add(o);const a=new C(new ee(.58,.07,.58),F(t.color));a.position.set(t.x,0,t.z),ot.add(a);const i=new ba;i.position.set(t.x,-2.2+t.h,t.z),ot.add(i),de(t.name,null,i,[0,.55,0],["sources"],t.color);const c=i.position.clone(),m=Me.position.clone();return{pillar:o,cap:a,curve:new ro(c,c.clone().lerp(m,.5).setY(c.y+1.4),m)}}),at=j(144,.16,ot);for(let t=0;t<144;t++)at.paint(t,Yt[t%4].color,1.1);const Bo=I.layers,Aa=[pa,N,y],Ea=["Raw","Clean","Curated"],Ua=Aa.map((t,o)=>{const a=K(new C(new ee(5.2,.1,3.6),ft(t,.16)),t,.75);return a.position.y=2-o*2,Bo.add(a),de(Ea[o],null,a,[2.75,.25,1.8],["layers"],t),a}),Oe=j(520,.12,Bo),Ra=Array.from({length:520},(t,o)=>({rx:(S()-.5)*4.8,rz:(S()-.5)*3.2,gx:-2.2+o%13*.367,gz:-1.45+Math.floor(o/13)%9*.3625,phase:S()})),za=new P(pa),Oo=new P(N),Fa=new P(y),oe=new P,ka=I.schema,Ne=new X;ka.add(Ne);const Ie=[{name:"fact_grid_interval",color:y,at:[0,.3,0],size:[1.5,.55,1]},{name:"dim_grid",color:N,at:[-2.8,1.3,-.4]},{name:"dim_time",color:N,at:[2.8,1.3,-.4]},{name:"dim_date",color:N,at:[0,2.4,-2.3]},{name:"dim_source",color:N,at:[0,-1.3,1.9]},{name:"fact_grid_alert",color:U,at:[-3.8,-1,-2],size:[1.1,.4,.75]},{name:"fact_plant_outage",color:_e,at:[3.8,-1,-2],size:[1.1,.4,.75]}],Ba=Ie.map((t,o)=>{const[a,i,c]=t.size??[.95,.38,.6],m=K(new C(new ee(a,i,c),new ue({color:990240,emissive:t.color,emissiveIntensity:o?.25:.5,roughness:.4,metalness:.5})),t.color,.85);return m.position.set(...t.at),Ne.add(m),de(t.name,null,m,[0,i/2+.35,0],["schema"],t.color),m}),ae=[[0,1],[0,2],[0,3],[0,4],[5,1],[5,2],[6,1],[6,2]],Oa=new We().setFromPoints(ae.flatMap(([t,o])=>[new T(...Ie[t].at),new T(...Ie[o].at)])),No=k(new Tt({color:y,opacity:0}));Ne.add(new ua(Oa,No));const gt=j(ae.length*3,.2,Ne);for(let t=0;t<ae.length*3;t++)gt.paint(t,Ie[ae[t%ae.length][0]].color,1.2);const st=I.tunnel,xt=1.4,Na=Array.from({length:16},(t,o)=>{const a=-5+o*.62,i=a<xt,c=new C(new Cs(1.35,.018,6,64),F(i?y:U,i?.85:.4));return c.rotation.y=Math.PI/2,c.position.x=a,st.add(c),c}),rt=K(new C(new ia(3.4,3.4),k(new ge({color:y,opacity:0,side:Rt}))),y,.8);rt.rotation.y=Math.PI/2,rt.position.x=xt,st.add(rt),de("Training · earlier data",null,st,[-3.6,1.9,0],["tunnel"],y),de("Testing · later data",null,st,[3.6,1.9,0],["tunnel"],U);const it=j(340,.12,st),Io=Array.from({length:340},(t,o)=>{const a=S()*Math.PI*2,i=Math.sqrt(S())*1.1;return{y:Math.cos(a)*i,z:Math.sin(a)*i,phase:S(),future:o>=260}});Io.forEach((t,o)=>it.paint(o,t.future?U:y,t.future?.6:1));const Zt=I.analysis,wt=new X;Zt.add(wt);const Lo=[U,y,Ve],Go=Lo.map(t=>lo(200,t,.9,Zt)),nt=j(180,.14,Zt);for(let t=0;t<180;t++)nt.paint(t,Lo[t%3],1.2);const bt=new ca().makeRotationFromEuler(new la(.5,.6,.25)),Ia=[[3.4,y],[1.7,_e],[.8,U]].map(([t,o],a)=>{const i=new T(a===0?1:0,a===1?1:0,a===2?1:0).applyMatrix4(bt).multiplyScalar(t),c=k(new Tt({color:o,opacity:0}));return wt.add(new ha(new We().setFromPoints([i.clone().negate(),i]),c)),c}),La=[y,U,_e,Ve],qt=[[-2.5,1],[2.3,1.3],[-.7,-1.7],[2.5,-1.3]].map(([t,o])=>new T(t,o,0).applyMatrix4(bt)),Le=j(1100,.12,wt),Ga=Array.from({length:1100},()=>{const t=x()*1.6,o=x()*.95,a=x()*.5,i=new T(t,o,a).applyMatrix4(bt),c=new T(t,o,0).applyMatrix4(bt);let m=0;return qt.forEach((M,R)=>{M.distanceToSquared(c)<qt[m].distanceToSquared(c)&&(m=R)}),{solid:i,flat:c,grouped:qt[m].clone().add(new T(x()*.38,x()*.38,x()*.2)),k:m}}),Va=new P(14285798),ja=La.map(t=>new P(t)),Wa={value:new P(y).multiplyScalar(.9)},lt=1e3,Vo=new Set,jo=t=>t==="map"?[-.7,3.6]:[-2.6,4.4],ct={};for(const[t,o]of Object.entries(I)){const a=ct[t]={value:lt};o.traverse(i=>{const c=i;if(c.isMesh)for(const m of Array.isArray(c.material)?c.material:[c.material])Vo.has(m)||!(m instanceof ue||m instanceof ge)||(Zs(m,a,Wa),Vo.add(m))})}const Q={station:e==="finale"?"map":ve[e].station,wait:0,progress:1},yt=u?3e3:9e3,Wo=3e3,se=js(yt,S);O.add(se.object),se.trail.set(y).multiplyScalar(.4),f.updateMatrixWorld(!0);function Kt(t){const o=new Float32Array(yt*3),a=new Float32Array(yt*3),i=new T,c=new P;for(let m=0;m<yt;m++)t(m,i,c.setRGB(0,0,0)),i.toArray(o,m*3),c.toArray(a,m*3);return{position:o,color:a}}const Qa=Object.fromEntries(Object.keys(I).map(t=>[t,Kt((o,a)=>a.set(x()*1.6,.6+x()*.9,x()*1.6).add(I[t].position))])),Ha=Kt((t,o,a)=>{if(t%10<7)Vt[t%7].getPoint(S(),o).add(w.set(x(),x(),x()).multiplyScalar(.22)),a.set(S()>.8?U:y).multiplyScalar(.2+S()*.4);else{const i=S()*Math.PI*2,c=7.6+x()*.3;o.set(Math.cos(i)*c,-.2+x()*.1,Math.sin(i)*c),a.set(N).multiplyScalar(.15+S()*.3)}});se.scatter(Kt((t,o)=>o.set(x()*40,40+Math.abs(x())*30,120+x()*50)));const Ya=t=>t==="finale"?Ha:Qa[ve[t].station],Xa=new Qe(1,1,{type:He,samples:u?0:4}),me=new ks(n,Xa);me.addPass(new Bs(f,g));const Mt=new Is(f,g,{focus:10,aperture:35e-5,maxblur:.0045});Mt.enabled=!u,me.addPass(Mt);const $t=new Ye(new H(512,512),.65,.5,.9);$t.enabled=!u,me.addPass($t),me.addPass(new Ns),u&&se.setVisible(Wo);const v=Object.fromEntries(va.map(t=>[t,0])),Qo={};let re=e,Jt=0,Ho=0,eo=!1,ie=1,ne=1,to=0,oo=performance.now(),E=0,Yo=0,Xo=!1,Ce=!0,G=matchMedia("(prefers-reduced-motion: reduce)").matches,D=null;const Se=new T(0,80,96),Y=new T,$={x:0,y:0,tx:0,ty:0},ao=new T,Zo=new T,Ct=[],St=()=>ie/ne<1.1;function qo(t){const o=ve[t],a=I[o.station];a.updateWorldMatrix(!0,!1);const i=new T(...o.look),c=new T(...o.cam);return St()&&t!=="finale"&&c.sub(i).multiplyScalar(1.4).add(i),{pos:a.localToWorld(c),look:a.localToWorld(i)}}function Ko(t){const{pos:o,look:a}=qo(t);if(G)D=null,Se.copy(o),Y.copy(a);else{const M=g.position.clone().sub(ao),R=M.distanceTo(o),le=M.clone().lerp(o,.5);le.y+=Math.min(R*.3,18),D={from:M,control:le,to:o,lookFrom:Y.clone(),lookTo:a,t:0,duration:zt.clamp(1+R*.02,1.2,2.8)};const J=o.clone().sub(M),ce=a.clone().sub(o);Ho=Math.sign(ce.x*J.z-ce.z*J.x)*.08*zt.clamp(R/30,.2,1)}const i=ve[t].station,c=ve[re].station;(!eo||i!==c)&&(ct[c].value=lt,ct[i].value=G?lt:jo(i)[0],Object.assign(Q,{station:i,wait:(D?.duration??0)*.55,progress:G?1:0}));const m=I[c].position.distanceTo(I[i].position);se.morph(Ya(t),(D?.duration??1.4)+.6,Math.min(Math.max(m,eo?12:60)*.25,14),1.3,G),Jt=0,re=t,eo=!0,Ce=!0}function so(){if(ie=Math.max(1,d.clientWidth),ne=Math.max(1,d.clientHeight),g.aspect=ie/ne,g.fov=St()?50:40,g.setViewOffset(ie,ne,St()?0:-ie*.2,St()?ne*.17:0,ie,ne),g.updateProjectionMatrix(),n.setSize(ie,ne),me.setSize(ie,ne),!D){const t=qo(re);Se.copy(t.pos),Y.copy(t.look)}Ce=!0}const $o=new ResizeObserver(so);$o.observe(d);const Jo=t=>{$.tx=t.clientX/innerWidth-.5,$.ty=t.clientY/innerHeight-.5,Ce=!0};window.addEventListener("pointermove",Jo);function Za(t){if(D){D.t=Math.min(1,D.t+t/D.duration);const s=je(D.t),p=1-s;Se.set(0,0,0).addScaledVector(D.from,p*p).addScaledVector(D.control,2*p*s).addScaledVector(D.to,s*s),Y.lerpVectors(D.lookFrom,D.lookTo,s),D.t>=1&&(D=null)}else Jt+=t*(ve[re].orbit??0);if($.x+=($.tx-$.x)*Math.min(1,t*3),$.y+=($.ty-$.y)*Math.min(1,t*3),Zo.setFromMatrixColumn(g.matrixWorld,0),ao.set(0,Math.sin(E*.17)*.15-$.y*.35,0).addScaledVector(Zo,Math.sin(E*.21)*.25+$.x*.7),g.position.copy(Se).sub(Y).applyAxisAngle(Bt,Jt).add(Y).add(ao),g.lookAt(Y),D&&g.rotateZ(Ho*Math.sin(D.t*Math.PI)),g.updateMatrixWorld(),h.density+=((ve[re].fog??.03)-h.density)*Math.min(1,t*1.6||1),Nt.uniforms.uFog.value=h.density,Nt.uniforms.uCamera.value.copy(g.position),uo.position.copy(g.position),co.uniforms.uStrength.value=zt.smoothstep(g.position.y,14,40)*1.6,Mt.uniforms.focus.value=g.position.distanceTo(Y),se.update(t,E,h.density,n.domElement.height*.5),wo.uniforms.uTime.value=E,jt.uniforms.uTime.value=E,Gt.uniforms.uTime.value=E,Q.progress<1)if(Q.wait>0)Q.wait-=t;else{Q.progress=G?1:Math.min(1,Q.progress+t/1.5);const[s,p]=jo(Q.station);ct[Q.station].value=Q.progress>=1?lt:s+(p-s)*je(Q.progress)}const o=Ks(re);for(const s of va){let p=o[s];s==="flat"&&p===1&&v.cloud<.95&&(p=v.flat),v[s]=G?p:v[s]+Math.sign(p-v[s])*Math.min(Math.abs(p-v[s]),t*(qs[s]??.9))}const a=s=>{const p=Qo[s]!==v[s];return Qo[s]=v[s],p};B.visible=!!D||ve[re].station==="map",Yo+=t*(.1+v.flow*.35);for(let s=0;s<24;s++)xo[s%2].getPoint((Yo+s/24)%1,w),Lt.position.setXYZ(s,w.x,w.y,w.z);if(Lt.position.needsUpdate=!0,a("alerts")&&(Ee.visible=v.alerts>.001,bo.forEach((s,p)=>{const b=Z(Te(v.alerts,s.delay)),_=Math.max(s.h*b,1e-4);Ee.setMatrixAt(p,we.compose(w.set(s.x,.2+_/2,s.z),he.identity(),Ae.set(1,_,1)))}),Ee.instanceMatrix.needsUpdate=!0),te.visible=v.balance>.001,te.scale.y=Math.max(Z(v.balance),1e-4),Ue.visible=Re.visible=v.outlook>.001,Ue.material.opacity=v.outlook*(.6+.2*Math.sin(E*2.2)),Ue.scale.setScalar(.85+.15*Math.sin(E*1.1)),Re.material.opacity=v.outlook*.3,Re.rotation.z=-E*1.4,Sa.forEach(s=>{s.material.opacity=v.outlook*.45}),ze.visible=v.shield>.001,ze.scale.setScalar(Math.max(Z(v.shield),1e-4)),ze.rotation.y=E*.05,et.visible=v.finale>.001,jt.uniforms.uOpacity.value=v.finale*.6,vt.material.opacity=v.finale,et.visible){for(let s=0;s<28;s++)Vt[s%7].getPoint((E*.15+s/28)%1,w),vt.position.setXYZ(s,w.x,w.y,w.z);vt.position.needsUpdate=!0}if(a("blocks")&&(Fe.visible=v.blocks>.001,Ta.forEach((s,p)=>{const b=Te(v.blocks,s.delay,.3),_=b>0?Math.min(1,b*3):1e-4;Fe.setMatrixAt(p,we.compose(w.set(s.x,s.y+(1-Z(b))*5,s.z),he.identity(),Ae.set(_,_,_)))}),Fe.instanceMatrix.needsUpdate=!0),Qt.rotation.y+=t*.12*v.blocks,Be.object.visible=v.signals>.001,Be.material.opacity=v.signals,tt.scale.setScalar(Math.max(Z(v.braid),1e-4)),Be.object.visible){const s=je(v.braid);Uo.forEach((p,b)=>{const _=Math.floor(b/ke);Ro(_,(p.t+E*.06)%1,s,w),Be.position.setXYZ(b,w.x+p.jitter[0],w.y+p.jitter[1],w.z+p.jitter[2])}),Be.position.needsUpdate=!0,Eo.forEach((p,b)=>{for(let _=0;_<120;_++)Ro(b,_/119,s,w),p.position.setXYZ(_,w.x,w.y,w.z);p.position.needsUpdate=!0,p.material.opacity=p.base*v.signals})}else Eo.forEach(s=>{s.material.opacity=0});const i=v.sources>.001;if(ko.forEach(({pillar:s,cap:p},b)=>{const _=Math.max(Yt[b].h*Z(Te(v.sources,b/3)),1e-4);s.scale.y=_,s.position.y=-2.2+_/2,p.position.y=-2.2+_,s.visible=p.visible=i}),Me.visible=at.object.visible=i,Me.scale.setScalar(Math.max(Z(v.sources),1e-4)),Fo.rotation.y=-E*.8,at.material.opacity=v.sources,i){for(let s=0;s<144;s++)ko[s%4].curve.getPoint((E*.22+Math.floor(s/4)/36)%1,w),at.position.setXYZ(s,w.x,w.y,w.z);at.position.needsUpdate=!0}const c=v.layers>.001;Ua.forEach((s,p)=>{s.visible=c,s.scale.set(Math.max(Z(Te(v.layers,p/2)),1e-4),1,Math.max(Z(Te(v.layers,p/2)),1e-4))}),Oe.object.visible=c,Oe.material.opacity=v.layers,c&&(Ra.forEach((s,p)=>{const b=3.6-(s.phase+E*.09)%1*6.4,_=b>2?0:b>0?.6*(2-b)/2:b>-2?.6+.4*-b/2:1,ta=je(_);Oe.position.setXYZ(p,s.rx+(s.gx-s.rx)*ta,b,s.rz+(s.gz-s.rz)*ta),(_<.6?oe.copy(za).lerp(Oo,_/.6):oe.copy(Oo).lerp(Fa,(_-.6)/.4)).multiplyScalar(b<-2.2?Math.max(0,1+(b+2.2)*2.5):1),Oe.color.setXYZ(p,oe.r,oe.g,oe.b)}),Oe.position.needsUpdate=!0,Oe.color.needsUpdate=!0);const m=v.schema>.001;if(Ne.visible=m,Ne.rotation.y=Math.sin(E*.2)*.3,Ba.forEach((s,p)=>s.scale.setScalar(Math.max(Z(Te(v.schema,p/6)),1e-4))),No.opacity=v.schema*.4,gt.material.opacity=v.schema,m){for(let s=0;s<ae.length*3;s++){const[p,b]=ae[s%ae.length];w.set(...Ie[p].at).lerp(Ae.set(...Ie[b].at),(E*.3+Math.floor(s/ae.length)/3)%1),gt.position.setXYZ(s,w.x,w.y,w.z)}gt.position.needsUpdate=!0}const M=v.tunnel>.001;Na.forEach((s,p)=>{s.visible=M,s.scale.setScalar(Math.max(Z(Te(v.tunnel,p/17)),1e-4))}),rt.visible=it.object.visible=M,rt.material.opacity=v.tunnel*.1,it.material.opacity=v.tunnel,M&&(Io.forEach((s,p)=>{const b=s.future?xt+.4+(s.phase+E*.02)%1*3:-5+(s.phase+E*.12)%1*(xt-.12+5);it.position.setXYZ(p,b,s.y,s.z)}),it.position.needsUpdate=!0);const R=v.waves>.001,le=(s,p)=>.95-s*.95+.5*Math.sin(1.25*p-E*1.2-s*.9);if(Go.forEach(s=>{s.object.visible=R,s.material.opacity=s.base*v.waves}),nt.object.visible=R,nt.material.opacity=v.waves,R){Go.forEach((s,p)=>{for(let b=0;b<200;b++){const _=-4.6+b/199*9.2;s.position.setXYZ(b,_,le(p,_),0)}s.position.needsUpdate=!0});for(let s=0;s<180;s++){const p=s%3,b=-4.6+(s/180+E*.04)%1*9.2;nt.position.setXYZ(s,b,le(p,b),0)}nt.position.needsUpdate=!0}const J=v.cloud>.001;if(Le.object.visible=J,Le.material.opacity=v.cloud,Ia.forEach(s=>{s.opacity=v.cloud*(1-v.cluster)*.85}),wt.rotation.y+=t*.14*v.cloud,J){const s=je(v.flat),p=je(v.cluster);Ga.forEach((b,_)=>{w.lerpVectors(b.solid,b.flat,s).lerp(b.grouped,p),Le.position.setXYZ(_,w.x,w.y,w.z),oe.copy(Va).lerp(ja[b.k],p),Le.color.setXYZ(_,oe.r,oe.g,oe.b)}),Le.position.needsUpdate=!0,Le.color.needsUpdate=!0}const ce=!D||D.t>.85;for(const s of Ot){let p=ce&&s.shots.includes(re);p&&(s.anchor.updateWorldMatrix(!0,!1),w.copy(s.offset),s.anchor.localToWorld(w).project(g),p=w.z<1,p&&(s.element.style.transform=`translate(${((w.x*.5+.5)*ie).toFixed(1)}px, ${((-w.y*.5+.5)*ne).toFixed(1)}px) translate(-50%, -100%)`)),s.element.classList.toggle("on",p)}}function ea(t){if(Xo)return;if(to=requestAnimationFrame(ea),document.hidden){oo=t;return}const o=Math.min((t-oo)/1e3,.1);oo=t,!(G&&!Ce)&&(!G&&!u&&Ct.length<150&&(Ct.push(o),Ct.length===150&&[...Ct].sort((a,i)=>a-i)[75]>.034&&(u=!0,n.setPixelRatio(1),me.setPixelRatio(1),$t.enabled=!1,Mt.enabled=!1,se.setVisible(Wo),so())),E+=G?0:o,Za(G?0:o),me.render(),Ce=!1)}function qa(t){t.preventDefault(),d.classList.remove("scene-ready"),G=!0}return n.domElement.addEventListener("webglcontextlost",qa),so(),Se.set(30,100,250),Y.set(0,6,-60),g.position.copy(Se),g.lookAt(Y),Ko(e),d.classList.add("scene-ready"),to=requestAnimationFrame(ea),{setShot(t){t!==re&&Ko(t)},setSupply(t){mt=t,Po(),Ce=!0},setPaused(t){G=t,G&&(se.settle(),Q.progress=1,ct[Q.station].value=lt),G&&D&&(Se.copy(D.to),Y.copy(D.lookTo),D=null),Ce=!0},dispose(){Xo=!0,cancelAnimationFrame(to),$o.disconnect(),window.removeEventListener("pointermove",Jo);const t=new Set,o=new Set;f.traverse(a=>{const i=a;i.geometry&&t.add(i.geometry),i.material&&(Array.isArray(i.material)?i.material:[i.material]).forEach(c=>o.add(c))}),t.forEach(a=>a.dispose()),o.forEach(a=>a.dispose()),L.dispose(),Ze.dispose(),q.dispose(),se.dispose(),me.dispose(),n.dispose(),n.domElement.remove(),Ot.forEach(a=>a.element.remove())}}}export{or as createScene};
