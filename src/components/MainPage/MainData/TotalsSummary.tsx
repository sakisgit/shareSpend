

const TotalsSummary = () => {
  return (
    <>
        {/* Bottom section for totals */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-2xl">
                <h1 className="text-xl font-bold mb-4 text-gray-800">
                    Total Expenses Summary
                </h1>

                {/* Totals container */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                
                    {/* Overall total */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                        <h2 className="font-semibold text-gray-800">💰 Total Expenses:</h2>
                        <p className="text-gray-600">$350.00</p>
                    </div>

                    {/* Per user totals */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                        <h2 className="font-semibold text-gray-800">User1 Expenses:</h2>
                        <p className="text-gray-600">$120.00</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                        <h2 className="font-semibold text-gray-800">User2 Expenses:</h2>
                        <p className="text-gray-600">$80.00</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                        <h2 className="font-semibold text-gray-800">User3 Expenses:</h2>
                        <p className="text-gray-600">$150.00</p>
                    </div>
                </div>
            </div>
    </>
  )
}

export default TotalsSummary