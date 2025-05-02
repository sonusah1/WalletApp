import {
    KeyboardArrowDownRounded,
    KeyboardArrowUpRounded,
    MoreVertRounded,
  } from '@mui/icons-material'
  import { CircularProgressbar } from 'react-circular-progressbar'
  import 'react-circular-progressbar/dist/styles.css'
  
  const Featured = () => {
    return (
      <div className="flex-[2] p-4 shadow-md shadow-gray-300 rounded-xl">
        <div className="flex items-center justify-between text-gray-500 mb-4">
          <h1 className="text-base font-medium">Total Revenue</h1>
          <MoreVertRounded fontSize="small" />
        </div>
  
        <div className="flex flex-col items-center justify-center gap-4 px-4">
          <div className="w-24 h-24">
            <CircularProgressbar value={70} text="70%" strokeWidth={4} />
          </div>
  
          <p className="font-medium text-gray-500">Total sales made today</p>
          <p className="text-3xl">$420</p>
          <p className="text-xs font-medium text-gray-500 text-center">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit
            itaque tenetur dolorum iusto?
          </p>
  
          <div className="w-full flex items-center justify-between mt-2">
            <div className="text-center">
              <div className="text-sm text-gray-500 font-medium">Target</div>
              <div className="flex items-center justify-center text-green-600 mt-2 text-sm">
                <KeyboardArrowUpRounded fontSize="small" />
                <span>$12.4k</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 font-medium">Last Week</div>
              <div className="flex items-center justify-center text-red-600 mt-2 text-sm">
                <KeyboardArrowDownRounded fontSize="small" />
                <span>$12.4k</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 font-medium">Last Month</div>
              <div className="flex items-center justify-center text-red-600 mt-2 text-sm">
                <KeyboardArrowDownRounded fontSize="small" />
                <span>$12.4k</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default Featured
  