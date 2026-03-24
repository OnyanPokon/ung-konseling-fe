/* eslint-disable react/prop-types */
const CustomRadioScale = ({ value, onChange }) => {
  return (
    <div className="w-full">
      <div className="-mx-2 overflow-x-auto px-2 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-[320px] items-center justify-between gap-2 p-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => {
            const isSelected = value === score;
            return (
              <div
                key={score}
                onClick={() => onChange?.(score)}
                className={`flex h-9 w-9 flex-shrink-0 cursor-pointer flex-col items-center justify-center rounded-full text-[15px] font-semibold transition-all duration-200 sm:h-11 sm:w-11 ${
                  isSelected ? 'scale-110 border-2 border-blue-600 bg-blue-600 text-white shadow-md' : 'border-2 border-gray-300 bg-white text-gray-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-500'
                } `}
              >
                {score}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-2 flex w-full justify-between px-1 text-sm font-medium text-gray-500">
        <span>Sangat Kurang</span>
        <span>Sangat Baik</span>
      </div>
    </div>
  );
};

export default CustomRadioScale;
