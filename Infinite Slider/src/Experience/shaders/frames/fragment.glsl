uniform sampler2D uTexture; 
varying vec2 vUv;

float rect(vec2 uv, vec2 pos, vec2 size) {
    vec2 d = abs(uv - pos) - size;
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

void main () {
    vec3 color = texture2D(uTexture, vUv).rgb;
    float f = rect(vUv, vec2(0.5), vec2(0.375));
    f = smoothstep(0.2, 0.0, f);
    
    gl_FragColor = vec4(color, f);
}