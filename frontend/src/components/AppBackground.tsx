import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react';

const AppBackground = () => {
  const shaderGradientProps = {
    animate: 'on',
    brightness: 1.1,
    cAzimuthAngle: 180,
    cDistance: 3.9,
    cPolarAngle: 115,
    cameraZoom: 1,
    color1: '#7c3aed', //violet-600
    color2: '#fb7185', //rose-400
    color3: '#000000',
    destination: 'onCanvas',
    envPreset: 'city',
    fov: 45,
    grain: 'off',
    lightType: '3d',
    pixelDensity: 1,
    positionX: -0.5,
    positionY: 0.1,
    positionZ: 0,
    range: 'disabled',
    rangeEnd: 40,
    rangeStart: 0,
    reflection: 0.1,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 235,
    shader: 'defaults',
    type: 'waterPlane',
    uAmplitude: 0,
    uDensity: 1.1,
    uFrequency: 5.5,
    uSpeed: 0.02,
    uStrength: 1.3,
    uTime: 0.2,
    wireframe: false,
  } as React.ComponentProps<typeof ShaderGradient>;

  return (
    <ShaderGradientCanvas
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <ShaderGradient {...shaderGradientProps} />
    </ShaderGradientCanvas>
  );
};

export default AppBackground;
