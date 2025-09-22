import { Ring2 } from 'ldrs/react';
import 'ldrs/react/Ring2.css';

interface SpinnerProps {
  size?: number; // opcional
}

const Spinner = ({ size = 40 }: SpinnerProps) => {
  return (
    <Ring2
      size={size}
      stroke={5}
      strokeLength={0.25}
      bgOpacity={0.1}
      speed={0.8}
      color="black"
    />
  );
};

export default Spinner;

