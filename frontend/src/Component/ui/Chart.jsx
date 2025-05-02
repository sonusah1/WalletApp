import {
    AreaChart,
    Area,
    XAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from 'recharts'
  
  const data = [
    { name: 'Jan', Total: 1200 },
    { name: 'Feb', Total: 2100 },
    { name: 'Mar', Total: 800 },
    { name: 'Apr', Total: 1600 },
    { name: 'May', Total: 900 },
    { name: 'Jun', Total: 3600 },
    { name: 'Jul', Total: 500 },
    { name: 'Aug', Total: 110 },
    { name: 'Sep', Total: 448 },
  ]
  
  const Chart = ({ aspect = 2, title = "Chart", height = 250 }) => {
    return (
      <div className="flex-[4] p-4 text-gray-500 shadow-md shadow-gray-300 rounded-xl">
        <div className="mb-5 text-lg font-semibold">{title}</div>
        <ResponsiveContainer width="100%" height={height} aspect={aspect}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="gray" />
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e1e1" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="Total"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#total)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }
  
  export default Chart
  