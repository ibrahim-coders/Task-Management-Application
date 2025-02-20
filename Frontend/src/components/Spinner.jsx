import { PiSpinnerGapBold } from 'react-icons/pi';

const Spinner = () => {
  return (
    <div className="grid grid-cols-1 place-content-center min-h-screen">
      <div className="flex justify-center items-center text-center">
        <PiSpinnerGapBold className="text-4xl text-sky-500 animate-spin" />
      </div>
    </div>
  );
};

export default Spinner;
