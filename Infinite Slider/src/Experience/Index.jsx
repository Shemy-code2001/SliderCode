import { Canvas } from "@react-three/fiber";
import Frames from "./Frames";
const Index = () => {
  return (
    <section className="fixed left-0 top-0  h-screen w-full">
      <Canvas
        flat
        camera={{
          position: [2, 3, 6],
          fov: 25,
          near: 0.1,
          far: 100,
        }}
      >
        <color attach="background" args={["#182122"]} />
        <Frames />
      </Canvas>
    </section>
  );
};

export default Index;
