import { useEffect, useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Main component to display throughput metrics
export default function Throughput({ data }) {
    const divRef = useRef(null); // Reference to the chart container
    const [divWidth, setDivWidth] = useState(0); // State to hold the width of the chart

    // Transform input data for charting
    const transformedData = data.map(item => ({
        date: new Date(item.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric' }),
        read: ((item.read / 1024) / 1024), // Convert read data to GB
        write: (item.write / 1024) / 1024 // Convert write data to GB
    }));

    // Calculate maximum read and write values for display
    const maxRead = Math.max(...transformedData.map(item => item.read));
    const maxWrite = Math.max(...transformedData.map(item => item.write));

    // Effect to calculate and update chart width on resize
    useEffect(() => {
        const calculateWidth = () => {
            if (divRef.current) {
                setDivWidth(divRef.current.offsetWidth - 24); // Adjust width for padding
            }
        };

        calculateWidth(); // Initial width calculation
        window.addEventListener('resize', calculateWidth); // Update width on window resize
        return () => {
            window.removeEventListener('resize', calculateWidth); // Cleanup event listener
        };
    }, []);

    return <>
        <div className="text-xl !font-extralight my-4">Throughput</div>
        <div className='flex grid-cols-2' id="iops-section">
            <div className='w-10/12 text-xs' ref={divRef} >
                <LineChart
                    width={divWidth}
                    height={350}
                    data={transformedData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid horizontal vertical={false} />
                    <XAxis dataKey="date" />
                    <Tooltip formatter={(value) => `${value.toFixed(2)} GB`} />
                    <YAxis tickFormatter={(value) => `${value.toFixed(2)} GB`} />
                    <Line type="monotone" dataKey="read" stroke="#AA7EDD" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="write" stroke="#00A3CA" />
                </LineChart>
            </div>

            <div className='w-2/12 text-gray-500'>
                <div className='text-xl'>Throughput</div>
                <div className='border border-gray-500'>
                    <div className=' p-2'>
                        <div>Read</div>
                        <div className='text-graph-3 flex gap-1 items-center'>
                            <div className='text-lg'>{maxRead.toFixed(2)} </div>
                            <div className='text-sm'>GB/s</div>
                        </div>
                    </div>
                    <div className='p-2 border-t border-gray-500'>
                        <div>Write</div>
                        <div className='text-graph-2 flex gap-1 items-center'>
                            <div className='text-lg'> {maxWrite.toFixed(2)} </div>
                            <div className='text-sm'>GB/s</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </>
}
