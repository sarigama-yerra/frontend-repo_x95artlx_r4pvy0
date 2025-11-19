import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function FluidBackground() {
  const ref = useRef(null)
  const requestRef = useRef()
  const uniformsRef = useRef()

  useEffect(() => {
    const container = ref.current
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 1

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    const geometry = new THREE.PlaneGeometry(2, 2)

    const uniforms = {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
    }
    uniformsRef.current = uniforms

    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms,
      fragmentShader: `
        precision highp float;
        uniform vec2 u_resolution;
        uniform float u_time;
        // Simple organic gradient mesh + subtle noise
        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        float smoothnoise(vec2 p){
          vec2 i = floor(p);
          vec2 f = fract(p);
          float a = noise(i);
          float b = noise(i + vec2(1.0, 0.0));
          float c = noise(i + vec2(0.0, 1.0));
          float d = noise(i + vec2(1.0, 1.0));
          vec2 u = f*f*(3.0-2.0*f);
          return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }
        void main(){
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          // center radial falloff to white
          float r = distance(uv, vec2(0.65, 0.5));
          float base = smoothstep(1.0, 0.0, r);
          // slowly morphing bands of cool greys
          float t = u_time * 0.022; // ~45s cycle visually
          float s = smoothnoise(uv*3.0 + t);
          float shade = mix(0.96, 0.83, s*0.6 + base*0.4);
          vec3 col = vec3(shade);
          // subtle grain
          float g = noise(uv * u_resolution.xy * 0.75);
          col = mix(col, col*0.98, g*0.02);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      vertexShader: `
        void main(){
          gl_Position = vec4(position, 1.0);
        }
      `
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const onResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight)
      uniforms.u_resolution.value.set(container.clientWidth, container.clientHeight)
    }
    const animate = (t) => {
      uniforms.u_time.value = t / 1000
      renderer.render(scene, camera)
      requestRef.current = requestAnimationFrame(animate)
    }
    requestRef.current = requestAnimationFrame(animate)
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(requestRef.current)
      window.removeEventListener('resize', onResize)
      container.removeChild(renderer.domElement)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
    }
  }, [])

  return <div ref={ref} className="absolute inset-0" aria-hidden="true" />
}
