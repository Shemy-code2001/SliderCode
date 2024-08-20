import { useTexture } from "@react-three/drei";
import { frames } from "../constants";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import gsap from "gsap";

import framesVertexShader from "./shaders/frames/vertex.glsl";
import framesFragmentShader from "./shaders/frames/fragment.glsl";

const Frames = () => {
  const { camera } = useThree();
  camera.lookAt(0, 0, 1.5);

  return (
    <>
      {frames.map((frame, index) => (
        <Frame
          key={index}
          {...frame}
          position={[0, 0, index - 5]}
          total={frames.length}
          index={index}
        />
      ))}
    </>
  );
};

const Frame = ({ ...frame }) => {
  const { url, position, total } = frame;
  const texture = useTexture(url);
  const frameRef = useRef();
  const scrollOffset = useRef(0);
  const animationRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const max = total / 2;
  const speed = 0.02;

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: framesVertexShader,
      fragmentShader: framesFragmentShader,
      transparent: true,
      uniforms: {
        uTexture: new THREE.Uniform(texture),
      },
    });
  }, [texture]);

  useEffect(() => {
    const scale = isDragging ? 1 : 1.1;
    if (animationRef.current) {
      animationRef.current.kill();
    }
    animationRef.current = gsap.to(frameRef.current.scale, {
      x: scale,
      y: scale,
      z: scale,
      ease: "power4.out",
      delay: isDragging ? 0.1 : 0,
      duration: isDragging ? 0.5 : 0.25,
    });

    const handleWheel = (event) => {
      scrollOffset.current += event.deltaY * speed;
    };

    const handleTouchMove = (event) => {
      scrollOffset.current +=
        Math.max(event.touches[0].clientY, event.touches[0].clientX) * speed;
    };

    const handleDrag = (event) => {
      if (isDragging) {
        const movement =
          Math.max(Math.abs(event.movementY), Math.abs(event.movementX)) *
          speed *
          2;
        const direction =
          Math.abs(event.movementY) > Math.abs(event.movementX)
            ? Math.sign(event.movementY)
            : -Math.sign(event.movementX);
        scrollOffset.current += movement * direction;
      }
    };

    const handleMouseDown = () => {
      setIsDragging(true);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("wheel", handleWheel);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  useFrame(() => {
    frameRef.current.position.z = THREE.MathUtils.lerp(
      frameRef.current.position.z,
      frameRef.current.position.z + scrollOffset.current,
      0.02
    );
    scrollOffset.current = THREE.MathUtils.lerp(scrollOffset.current, 0, 0.1);
    const offset = frameRef.current.position.z % max;
    if (frameRef.current.position.z > max) {
      frameRef.current.position.z = -max + offset;
    } else if (frameRef.current.position.z < -max) {
      frameRef.current.position.z = max + offset;
    }
  });

  return (
    <mesh ref={frameRef} position={[...position]}>
      <boxGeometry args={[1, 1, 0.001]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

export default Frames;
